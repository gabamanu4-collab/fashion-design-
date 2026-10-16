import React, { useEffect } from 'react';
import { X, ZoomIn, Download, ExternalLink, Maximize2 } from 'lucide-react';

interface FashionLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  category?: string;
  designer?: string;
  atelierNotes?: string;
  fabrication?: string;
  season?: string;
}

export const FashionLightbox: React.FC<FashionLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  category,
  designer,
  atelierNotes,
  fabrication,
  season,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-[#141210] border border-[#2D2824] rounded-2xl overflow-hidden shadow-2xl">
        {/* Left / Center: High-Resolution Fashion Visual Media */}
        <div className="lg:w-2/3 bg-[#0D0C0A] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative group">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-lg transition-transform duration-300"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/50 text-[10px] font-mono tracking-widest uppercase pointer-events-none">
            <span>FD ARCHIVE · HIGH RESOLUTION</span>
            <span>PRESS READY</span>
          </div>
        </div>

        {/* Right: Editorial Atelier Monograph Metadata */}
        <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#26221E] bg-[#141210] text-[#E8E4DD] space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B39B7D] bg-[#241F1A] px-2.5 py-1 rounded border border-[#3E342B]">
                {category || 'Haute Couture'}
              </span>
              {season && (
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#8C8479]">
                  {season}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-[#A89F93] font-serif italic">{subtitle}</p>
              )}
            </div>

            {designer && (
              <div className="pt-2 border-t border-[#26221E]">
                <p className="text-[10px] font-mono uppercase text-[#736B61] tracking-wider">Lead Designer</p>
                <p className="text-sm font-semibold text-white mt-0.5">{designer}</p>
              </div>
            )}

            {fabrication && (
              <div className="pt-2 border-t border-[#26221E]">
                <p className="text-[10px] font-mono uppercase text-[#736B61] tracking-wider">Fabrication &amp; Weave</p>
                <p className="text-xs text-[#CFC8BD] mt-0.5 font-mono">{fabrication}</p>
              </div>
            )}

            {atelierNotes && (
              <div className="pt-2 border-t border-[#26221E] space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#736B61] tracking-wider">Atelier Construction Notes</p>
                <p className="text-xs text-[#A8A196] leading-relaxed">{atelierNotes}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#26221E] flex items-center justify-between gap-3 text-xs">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 bg-[#24201C] hover:bg-[#332D27] text-white rounded-lg flex items-center justify-center gap-2 border border-[#3D352D] font-mono text-[11px] tracking-wider uppercase transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Asset</span>
            </a>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-white text-[#141210] hover:bg-[#EAE6DD] rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
