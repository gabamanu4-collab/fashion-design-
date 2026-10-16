import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getEffectiveSupabaseUrl, getEffectiveSupabaseKey, checkIsSupabaseConfigured, BUCKET_NAME } from './config';

// Fallback placeholder credentials to prevent initialization crashes when env vars are pending
const getInitialUrl = () => getEffectiveSupabaseUrl() || 'https://placeholder-project.supabase.co';
const getInitialKey = () => getEffectiveSupabaseKey() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

let activeClient: SupabaseClient = createClient(getInitialUrl(), getInitialKey(), {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function reinitSupabaseClient(): SupabaseClient {
  const url = getInitialUrl();
  const key = getInitialKey();
  activeClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return activeClient;
}

if (typeof window !== 'undefined') {
  window.addEventListener('supabase-config-changed', () => {
    reinitSupabaseClient();
  });
}

/**
 * Dynamic Proxy so all consumer files calling supabase.from(...), supabase.auth, etc.
 * automatically delegate to the latest re-initialized SupabaseClient instance.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = activeClient as any;
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * Helper to get public URL for a stored image in Supabase Storage.
 * Handles both full URLs (if already formatted) and relative storage paths.
 */
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (!checkIsSupabaseConfigured()) {
    return path;
  }
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data?.publicUrl || '';
}

/**
 * Storage upload utility with namespace {userId}/{contextId}/{timestamp}_{filename}
 */
export async function uploadMediaFile(
  file: File,
  userId: string,
  contextId: string
): Promise<{ path: string; url: string; error: Error | null }> {
  if (!checkIsSupabaseConfigured()) {
    return {
      path: '',
      url: '',
      error: new Error('Supabase is not configured. Please supply your Supabase URL and anon key in the Database Setup page or environment.'),
    };
  }

  // Validate MIME type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return {
      path: '',
      url: '',
      error: new Error('Invalid file format. Please upload JPEG, PNG, or WebP images.'),
    };
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return {
      path: '',
      url: '',
      error: new Error('File exceeds maximum size of 10MB.'),
    };
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueName = `${Date.now()}_${cleanFileName}`;
  const filePath = `${userId}/${contextId}/${uniqueName}`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    return { path: '', url: '', error: new Error(error.message) };
  }

  const url = getStorageUrl(data.path);
  return { path: data.path, url, error: null };
}

/**
 * Safely removes a file from the portfolio-media bucket
 */
export async function deleteMediaFile(path: string): Promise<{ success: boolean; error: Error | null }> {
  if (!checkIsSupabaseConfigured() || !path) {
    return { success: false, error: new Error('Supabase not configured or path missing') };
  }
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    return { success: false, error: new Error(error.message) };
  }
  return { success: true, error: null };
}
