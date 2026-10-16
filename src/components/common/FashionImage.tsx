import React, { useState } from 'react';
import { getStorageUrl } from '../../lib/supabase';
import {
  FASHION_HERO_ATELIER,
  FASHION_LOOKBOOK_COAT,
  FASHION_TECHNICAL_FLATS,
  FASHION_AVANT_GARDE,
  FASHION_MOODBOARD,
  FASHION_DESIGNER_PORTRAIT,
  FASHION_RUNWAY_GOWN,
  PHOTO_HERO_ATELIER,
  PHOTO_RUNWAY_EDITORIAL,
  PHOTO_TEXTILE_DRAPERY,
  PHOTO_TAILORING_WORKSPACE,
  PHOTO_AVANT_GARDE_COUTURE,
  PHOTO_DESIGNER_PORTRAIT_1,
  PHOTO_PFW_RUNWAY_BURGUNDY,
  PHOTO_MODERN_TAILORING,
  PHOTO_MOODBOARD_FABRICS,
} from '../../assets/fashionImages';
import { FashionLightbox } from './FashionLightbox';
import { Maximize2 } from 'lucide-react';

interface FashionImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: '3:4' | '1:1' | '16:9' | '4:3' | 'natural';
  category?: string;
  title?: string;
  subtitle?: string;
  designer?: string;
  atelierNotes?: string;
  fabrication?: string;
  season?: string;
  priority?: boolean;
  enableLightbox?: boolean;
  preferPhoto?: boolean;
}

/**
 * Editorial Fashion Image component adhering to Zero-Broken-Image Policy.
 * Dynamically resolves real uploaded storage assets, high-resolution editorial photography,
 * or renders bespoke luxury haute-couture vector plates for lookbooks, technical flats,
 * moodboards, and portraits.
 */
export const FashionImage: React.FC<FashionImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '3:4',
  category = 'Haute Couture',
  title = '',
  subtitle = '',
  designer = '',
  atelierNotes = '',
  fabrication = '',
  season = '',
  priority = false,
  enableLightbox = false,
  preferPhoto = true,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Pick appropriate bespoke fashion editorial artwork based on context
  const getContextualFashionArtwork = () => {
    const text = `${category} ${title} ${alt}`.toLowerCase();

    // Technical Flats & Specs should remain precision CAD drawings
    if (text.includes('flat') || text.includes('tech') || text.includes('spec') || text.includes('pattern') || text.includes('cad')) {
      return FASHION_TECHNICAL_FLATS;
    }

    // Moodboard
    if (text.includes('mood') || text.includes('research') || text.includes('swatch')) {
      return preferPhoto ? PHOTO_MOODBOARD_FABRICS : FASHION_MOODBOARD;
    }

    // Textile weave
    if (text.includes('textile') || text.includes('silk') || text.includes('drape') || text.includes('fabric')) {
      return preferPhoto ? PHOTO_TEXTILE_DRAPERY : FASHION_MOODBOARD;
    }

    // Avant-Garde
    if (text.includes('avant') || text.includes('pleat') || text.includes('sculpt')) {
      return preferPhoto ? PHOTO_AVANT_GARDE_COUTURE : FASHION_AVANT_GARDE;
    }

    // Tailoring & Outerwear
    if (text.includes('trench') || text.includes('coat') || text.includes('tailor') || text.includes('outerwear')) {
      return preferPhoto ? PHOTO_RUNWAY_EDITORIAL : FASHION_LOOKBOOK_COAT;
    }

    // Designer portrait
    if (text.includes('portrait') || text.includes('designer') || text.includes('headshot') || aspectRatio === '1:1') {
      return preferPhoto ? PHOTO_DESIGNER_PORTRAIT_1 : FASHION_DESIGNER_PORTRAIT;
    }

    // Eveningwear / Runway
    if (text.includes('runway') || text.includes('evening') || text.includes('gown') || text.includes('chiffon')) {
      return preferPhoto ? PHOTO_PFW_RUNWAY_BURGUNDY : FASHION_RUNWAY_GOWN;
    }

    // Atelier & Hero
    if (aspectRatio === '16:9' || text.includes('atelier') || text.includes('studio') || text.includes('hero')) {
      return preferPhoto ? PHOTO_HERO_ATELIER : FASHION_HERO_ATELIER;
    }

    return preferPhoto ? PHOTO_MODERN_TAILORING : FASHION_LOOKBOOK_COAT;
  };

  const resolvedUrl = src ? getStorageUrl(src) : getContextualFashionArtwork();

  const aspectClass =
    aspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : '';

  return (
    <>
      <div
        className={`relative overflow-hidden bg-[#181614] ${aspectClass} ${className} ${
          enableLightbox ? 'cursor-pointer group' : ''
        }`}
        onClick={() => {
          if (enableLightbox) setLightboxOpen(true);
        }}
      >
        <img
          src={error ? getContextualFashionArtwork() : resolvedUrl}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 scale-100' : 'opacity-90 scale-[1.01]'
          } ${enableLightbox ? 'group-hover:scale-105' : ''}`}
        />

        {enableLightbox && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="p-2.5 rounded-full bg-white/90 text-[#141210] shadow-md flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </span>
          </div>
        )}
      </div>

      {enableLightbox && (
        <FashionLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageUrl={error ? getContextualFashionArtwork() : resolvedUrl}
          title={title || alt}
          subtitle={subtitle}
          category={category}
          designer={designer}
          atelierNotes={atelierNotes}
          fabrication={fabrication}
          season={season}
        />
      )}
    </>
  );
};
