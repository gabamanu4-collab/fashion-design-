import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, uploadMediaFile, deleteMediaFile, getStorageUrl } from '../../lib/supabase';
import { isSupabaseConfigured, BUCKET_NAME } from '../../lib/config';
import { FashionImage } from '../../components/common/FashionImage';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface StorageItem {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  metadata?: any;
}

export const MediaLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadMedia = async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(user.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) {
        console.warn('Media list notice:', error.message);
        setFiles([]);
      } else {
        setFiles(data || []);
      }
    } catch (err) {
      console.warn('Media load exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [user?.id]);

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !user?.id) return;
    setUploading(true);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      await uploadMediaFile(file, user.id, 'library');
    }

    setUploading(false);
    loadMedia();
  };

  const handleDelete = async (fileName: string) => {
    if (!user?.id) return;
    const path = `${user.id}/${fileName}`;
    await deleteMediaFile(path);
    setFiles(files.filter((f) => f.name !== fileName));
  };

  const handleCopyUrl = (fileName: string) => {
    if (!user?.id) return;
    const path = `${user.id}/${fileName}`;
    const url = getStorageUrl(path);
    navigator.clipboard.writeText(url);
    setCopiedPath(fileName);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E7E2D6]">
        <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
          Supabase Storage · portfolio-media
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Atelier Media Library
        </h1>
        <p className="text-xs text-[#57524A] mt-1">
          Upload and manage high-resolution runway photography, textile scans, and fashion flats.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            Supabase Storage credentials are required to list and upload media. Configure VITE_SUPABASE_URL and key in your environment.
          </span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragOver ? 'border-[#141210] bg-[#FAF9F6]' : 'border-[#DCD7CD] bg-white'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#141210]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#141210]">
              {uploading ? 'Uploading to Supabase Storage...' : 'Upload Fashion Photography &amp; Flats'}
            </h3>
            <p className="text-xs text-[#78716A] mt-1">
              Drag &amp; drop JPEG, PNG, or WebP files here, or browse from your workstation (Max 10MB per file).
            </p>
          </div>
          <label className="inline-block cursor-pointer px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold transition-colors">
            <span>Browse Files</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-lg text-[#141210]">Uploaded Assets</h2>
          <span className="text-xs font-mono text-[#78716A]">
            {files.length} Stored {files.length === 1 ? 'Object' : 'Objects'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">
            Querying storage bucket objects...
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-[#A3998F] mx-auto" />
            <p className="text-xs text-[#57524A]">Your storage bucket namespace is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => {
              const fullPath = `${user?.id}/${file.name}`;
              return (
                <div
                  key={file.name}
                  className="group border border-[#E7E2D6] rounded-xl overflow-hidden bg-white shadow-xs relative flex flex-col justify-between"
                >
                  <FashionImage
                    src={fullPath}
                    alt={file.name}
                    aspectRatio="1:1"
                    category="Asset"
                    title={file.name}
                  />
                  <div className="p-2.5 bg-white border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                    <p className="font-mono text-[10px] text-[#78716A] truncate max-w-[100px]">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyUrl(file.name)}
                        className="p-1 hover:bg-[#FAF9F6] rounded text-[#57524A]"
                        title="Copy Public URL"
                      >
                        {copiedPath === file.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
