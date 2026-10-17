/**
 * Atelier Media Service
 * Manages fashion design photos, runway lookbooks, technical flats, and swatches.
 * Features dual-layer storage: Supabase Storage cloud bucket with seamless resilient local persistence.
 */

import { supabase, getStorageUrl } from '../lib/supabase';
import { BUCKET_NAME, checkIsSupabaseConfigured } from '../lib/config';

export interface MediaAsset {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
  category: 'lookbook' | 'runway' | 'sketch' | 'textile' | 'general';
  created_at: string;
  storage: 'cloud' | 'local';
}

const DB_NAME = 'fd_atelier_media_db';
const STORE_NAME = 'fashion_media_assets';
const DB_VERSION = 1;

/**
 * Open IndexedDB for high-capacity media asset storage
 */
function openMediaDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Save an asset to local IndexedDB
 */
export async function saveLocalAsset(asset: MediaAsset): Promise<void> {
  try {
    const db = await openMediaDatabase();
    if (!db) {
      // Fallback to localStorage for small entries
      const existing = getStoredLocalAssets(asset.id.split('_')[0] || 'default');
      const filtered = existing.filter((a) => a.id !== asset.id);
      localStorage.setItem(`atelier_media_${asset.id.split('_')[0] || 'default'}`, JSON.stringify([asset, ...filtered].slice(0, 30)));
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(asset);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not cache asset locally:', err);
  }
}

/**
 * Retrieve local assets from IndexedDB
 */
export async function getLocalAssets(userId: string): Promise<MediaAsset[]> {
  try {
    const db = await openMediaDatabase();
    if (!db) {
      return getStoredLocalAssets(userId);
    }

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const all: MediaAsset[] = req.result || [];
        // Filter by userId prefix or ownership
        const userAssets = all.filter((a) => a.id.startsWith(userId) || a.path.includes(userId));
        resolve(userAssets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      };
      req.onerror = () => resolve(getStoredLocalAssets(userId));
    });
  } catch {
    return getStoredLocalAssets(userId);
  }
}

/**
 * Delete a local asset from IndexedDB
 */
export async function deleteLocalAsset(id: string): Promise<void> {
  try {
    const db = await openMediaDatabase();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
    }
  } catch {
    // ignore
  }
}

function getStoredLocalAssets(userId: string): MediaAsset[] {
  try {
    const raw = localStorage.getItem(`atelier_media_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Compress and optimize an image file to maintain high visual fidelity while reducing file size
 */
export function optimizeImageFile(file: File, maxDimension = 2000, quality = 0.88): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: event.target?.result as string, size: file.size });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        const approxSize = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, size: approxSize });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a fashion design photo.
 * Tries Supabase Cloud Storage first; falls back seamlessly to Atelier local persistent library.
 */
export async function uploadFashionPhoto(
  file: File,
  userId: string,
  category: MediaAsset['category'] = 'general'
): Promise<{ asset: MediaAsset; cloudUploaded: boolean; error: Error | null }> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const assetId = `${userId}_${timestamp}_${cleanName}`;
  const cloudFilePath = `${userId}/library/${timestamp}_${cleanName}`;

  // First optimize the image client-side so it loads instantly and renders crisply
  let optimizedDataUrl = '';
  let optimizedSize = file.size;
  try {
    const opt = await optimizeImageFile(file);
    optimizedDataUrl = opt.dataUrl;
    optimizedSize = opt.size;
  } catch {
    // If optimization fails, fallback to raw reader
    optimizedDataUrl = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(file);
    });
  }

  // Attempt Supabase Cloud Storage
  let cloudUploaded = false;
  let finalPath = optimizedDataUrl;
  let finalUrl = optimizedDataUrl;

  if (checkIsSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(cloudFilePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        cloudUploaded = true;
        finalPath = data.path;
        finalUrl = getStorageUrl(data.path);
      } else {
        console.warn('Supabase cloud storage returned notice (fallback used):', error?.message);
      }
    } catch (err) {
      console.warn('Supabase cloud storage connection notice:', err);
    }
  }

  const asset: MediaAsset = {
    id: assetId,
    name: file.name,
    path: finalPath,
    url: finalUrl,
    size: optimizedSize,
    type: file.type || 'image/jpeg',
    category,
    created_at: new Date().toISOString(),
    storage: cloudUploaded ? 'cloud' : 'local',
  };

  // Always save to local Atelier database for rapid instant retrieval and offline safety
  await saveLocalAsset(asset);

  return { asset, cloudUploaded, error: null };
}

/**
 * Load all fashion design media assets for the current user
 */
export async function loadUserMediaAssets(userId: string): Promise<{ assets: MediaAsset[]; hasCloudBucket: boolean }> {
  if (!userId) return { assets: [], hasCloudBucket: false };

  const localAssets = await getLocalAssets(userId);
  let cloudAssets: MediaAsset[] = [];
  let hasCloudBucket = false;

  if (checkIsSupabaseConfigured()) {
    try {
      // Check if bucket exists and list items
      const { data: buckets } = await supabase.storage.listBuckets();
      hasCloudBucket = Boolean(buckets?.some((b) => b.id === BUCKET_NAME));

      if (hasCloudBucket) {
        // List in root and subfolders
        const { data: rootItems } = await supabase.storage
          .from(BUCKET_NAME)
          .list(userId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (rootItems && rootItems.length > 0) {
          for (const item of rootItems) {
            if (item.id) {
              // It's a file
              cloudAssets.push({
                id: `${userId}_${item.name}`,
                name: item.name.replace(/^\d+_/, ''),
                path: `${userId}/${item.name}`,
                url: getStorageUrl(`${userId}/${item.name}`),
                size: item.metadata?.size || 0,
                type: item.metadata?.mimetype || 'image/jpeg',
                category: 'general',
                created_at: item.created_at || new Date().toISOString(),
                storage: 'cloud',
              });
            } else {
              // It's a directory (e.g., "library" or "covers")
              const subfolder = item.name;
              const { data: subItems } = await supabase.storage
                .from(BUCKET_NAME)
                .list(`${userId}/${subfolder}`, { limit: 100 });

              if (subItems) {
                for (const subItem of subItems) {
                  if (subItem.id) {
                    cloudAssets.push({
                      id: `${userId}_${subfolder}_${subItem.name}`,
                      name: subItem.name.replace(/^\d+_/, ''),
                      path: `${userId}/${subfolder}/${subItem.name}`,
                      url: getStorageUrl(`${userId}/${subfolder}/${subItem.name}`),
                      size: subItem.metadata?.size || 0,
                      type: subItem.metadata?.mimetype || 'image/jpeg',
                      category: subfolder === 'covers' ? 'lookbook' : 'general',
                      created_at: subItem.created_at || new Date().toISOString(),
                      storage: 'cloud',
                    });
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error reading cloud media:', err);
    }
  }

  // Deduplicate and combine (cloud assets take precedence if same name, else local assets)
  const map = new Map<string, MediaAsset>();
  for (const a of cloudAssets) {
    map.set(a.name, a);
  }
  for (const a of localAssets) {
    if (!map.has(a.name)) {
      map.set(a.name, a);
    }
  }

  const combined = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { assets: combined, hasCloudBucket };
}

/**
 * Remove an asset from both Cloud Storage and Local storage
 */
export async function removeFashionAsset(asset: MediaAsset, userId: string): Promise<boolean> {
  await deleteLocalAsset(asset.id);

  if (asset.storage === 'cloud' && checkIsSupabaseConfigured() && asset.path) {
    try {
      await supabase.storage.from(BUCKET_NAME).remove([asset.path]);
    } catch {
      // ignore
    }
  }

  return true;
}
