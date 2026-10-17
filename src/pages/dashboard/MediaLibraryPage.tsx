import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MediaAsset,
  loadUserMediaAssets,
  uploadFashionPhoto,
  removeFashionAsset,
} from '../../services/mediaService';
import { FashionImage } from '../../components/common/FashionImage';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  CloudCheck,
  CloudOff,
  Filter,
  Maximize2,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [hasCloudBucket, setHasCloudBucket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadCategory, setUploadCategory] = useState<MediaAsset['category']>('lookbook');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadMedia = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await loadUserMediaAssets(user.id);
      setAssets(res.assets);
      setHasCloudBucket(res.hasCloudBucket);
    } catch (err) {
      console.warn('Media library loading exception:', err);
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
    setUploadProgress({ current: 0, total: fileList.length });

    let uploadedCount = 0;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress({ current: i + 1, total: fileList.length });
      try {
        await uploadFashionPhoto(file, user.id, uploadCategory);
        uploadedCount++;
      } catch (e) {
        console.warn('File upload exception:', e);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    setStatusMessage(
      `Successfully added ${uploadedCount} design ${uploadedCount === 1 ? 'photo' : 'photos'} to your atelier library.`
    );
    setTimeout(() => setStatusMessage(null), 5000);
    loadMedia();
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!user?.id) return;
    await removeFashionAsset(asset, user.id);
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url || asset.path);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyBucketSql = () => {
    const sql = `INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT (id) DO UPDATE SET public = true;`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory === 'all') return true;
    return asset.category === selectedCategory;
  });

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E7E2D6] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
            Atelier Assets · High-Resolution Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
            Fashion Media Library
          </h1>
          <p className="text-xs text-[#57524A] mt-1 max-w-xl">
            Upload, curate, and reference runway lookbooks, CAD technical flats, drape photography,
            and textile swatches for your designer portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasCloudBucket ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Cloud Bucket Active</span>
            </div>
          ) : (
            <button
              onClick={copyBucketSql}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
              title="Copy 1-click SQL to enable Supabase Cloud Storage bucket"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Copied Storage SQL!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Enable Cloud Bucket (Copy SQL)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{statusMessage}</span>
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
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all ${
          dragOver
            ? 'border-[#141210] bg-[#FAF9F6] scale-[1.005]'
            : 'border-[#DCD7CD] bg-white hover:border-[#A8A29E]'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#141210] shadow-xs">
            <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-[#141210]">
              {uploading
                ? `Processing Fashion Photos (${uploadProgress?.current} of ${uploadProgress?.total})...`
                : 'Upload Runway Photography, Lookbooks & Flats'}
            </h3>
            <p className="text-xs text-[#78716A] mt-1 leading-relaxed">
              Drag and drop high-resolution JPEG, PNG, or WebP files here, or choose from your files.
            </p>
          </div>

          {/* Quick Category Selection for incoming upload */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-[11px] font-mono text-[#78716A]">Asset Category:</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as MediaAsset['category'])}
              className="text-xs py-1 px-2.5 bg-[#FAF9F6] border border-[#DCD7CD] rounded-lg text-[#141210] focus:outline-hidden"
              disabled={uploading}
            >
              <option value="lookbook">Lookbook & Editorial</option>
              <option value="runway">Runway Presentation</option>
              <option value="sketch">Technical Flat / CAD</option>
              <option value="textile">Textile / Fabric Swatch</option>
              <option value="general">General Atelier Asset</option>
            </select>
          </div>

          <label className="inline-block cursor-pointer px-6 py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs disabled:opacity-50">
            <span>{uploading ? 'Processing Upload...' : 'Select Photos from Computer'}</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-[#78716A] mr-1 shrink-0" />
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'lookbook', label: 'Lookbook' },
            { id: 'runway', label: 'Runway' },
            { id: 'sketch', label: 'Flats & CAD' },
            { id: 'textile', label: 'Textiles' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#141210] text-white'
                  : 'bg-white border border-[#DCD7CD] text-[#57524A] hover:text-[#141210]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#78716A] shrink-0">
          Showing {filteredAssets.length} of {assets.length} {assets.length === 1 ? 'Design Photo' : 'Design Photos'}
        </span>
      </div>

      {/* Media Grid */}
      <div>
        {loading ? (
          <div className="p-16 text-center text-xs text-[#78716A]">
            Loading your atelier photography archive...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-16 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#A3998F]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#141210]">No photos in this category yet</h4>
            <p className="text-xs text-[#57524A] max-w-sm mx-auto">
              Upload your runway shots, fabric swatches, or CAD patterns above to begin building your personal media archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => {
              const isCopied = copiedId === asset.id;
              return (
                <div
                  key={asset.id}
                  className="group border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs relative flex flex-col justify-between hover:border-[#141210] transition-colors"
                >
                  {/* Photo Container */}
                  <div className="relative overflow-hidden aspect-square bg-[#1A1A1A]">
                    <FashionImage
                      src={asset.url || asset.path}
                      alt={asset.name}
                      aspectRatio="1:1"
                      category={asset.category}
                      title={asset.name}
                      enableLightbox
                    />

                    {/* Category pill on image */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider">
                      {asset.category}
                    </span>

                    {/* Storage indicator */}
                    <span
                      className={`absolute top-2 right-2 p-1 rounded-full text-[10px] ${
                        asset.storage === 'cloud'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-stone-800/80 text-amber-200'
                      }`}
                      title={asset.storage === 'cloud' ? 'Supabase Cloud Storage' : 'Atelier High-Res Archive'}
                    >
                      {asset.storage === 'cloud' ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : (
                        <Sparkles className="w-2.5 h-2.5" />
                      )}
                    </span>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3 bg-white border-t border-[#F0ECE1] space-y-2">
                    <div>
                      <p className="font-medium text-xs text-[#141210] truncate" title={asset.name}>
                        {asset.name}
                      </p>
                      <p className="font-mono text-[10px] text-[#78716A] mt-0.5">
                        {formatFileSize(asset.size)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#F7F5F0]">
                      <button
                        onClick={() => handleCopyUrl(asset)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#57524A] hover:text-[#141210] transition-colors cursor-pointer"
                        title="Copy Photo URL for use in Portfolios"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(asset)}
                        className="p-1 hover:bg-red-50 text-[#78716A] hover:text-red-600 rounded-md transition-colors cursor-pointer"
                        title="Delete photo"
                        aria-label="Delete asset"
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

      {/* Helpful Guidance Card */}
      <div className="p-5 border border-[#E7E2D6] rounded-2xl bg-[#FAF9F6] text-xs text-[#57524A] flex items-start gap-3 leading-relaxed">
        <Info className="w-4 h-4 text-[#78716A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#141210]">How to use your uploaded photos in Portfolios &amp; Projects:</p>
          <p>
            When editing a Portfolio or Project, you can upload design photos directly using the file selector, or copy the asset URL from this library and paste it into any custom image field. All uploaded photos are preserved and instantly visible in runway lookbooks and project galleries.
          </p>
        </div>
      </div>
    </div>
  );
};
