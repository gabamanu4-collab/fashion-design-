import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Palette, Layers, Camera, ArrowRight, Check } from 'lucide-react';
import { FashionImage } from '../../components/common/FashionImage';
import {
  FASHION_HERO_ATELIER,
  FASHION_LOOKBOOK_COAT,
  FASHION_TECHNICAL_FLATS,
  FASHION_AVANT_GARDE,
  FASHION_MOODBOARD,
  PHOTO_RUNWAY_EDITORIAL,
  PHOTO_AVANT_GARDE_COUTURE,
  PHOTO_MOODBOARD_FABRICS,
} from '../../assets/fashionImages';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Craft &amp; Architecture</span>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#141210] leading-tight">
          Engineered for the Modern Fashion Atelier.
        </h1>
        <p className="text-base text-[#57524A] leading-relaxed">
          Explore purpose-built tools designed specifically for patternmakers, garment fabricators, runway directors, and fashion scholars.
        </p>
      </div>

      {/* Feature 1: Garment Construction & Flats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E2D6] flex items-center justify-center text-[#141210]">
            <Scissors className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono text-[#78716A] uppercase tracking-wider">01. TECHNICAL INTEGRITY</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141210]">Garment Construction &amp; Flats</h2>
          <p className="text-sm text-[#57524A] leading-relaxed">
            Attach pattern drafting dimensions, CAD technical drawings, seam finishes, and fabrication notes directly to your design pieces. Give recruiters and ateliers proof of your technical mastery.
          </p>
          <ul className="space-y-2 text-xs text-[#57524A] font-mono">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Full floating canvas &amp; interlining documentation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pattern coordinate specifications and seam allowances</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Milanese keyhole buttonhole &amp; hem finish callouts</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6 border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <FashionImage
            src={FASHION_TECHNICAL_FLATS}
            alt="Technical Flat CAD Drafting"
            aspectRatio="16:9"
            category="Technical Flats"
            title="Style No. FD-2026-08 Specs"
            enableLightbox
          />
        </div>
      </div>

      {/* Feature 2: 6 Distinct Themes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1 border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <div className="grid grid-cols-2 gap-2">
            <FashionImage
              src={PHOTO_RUNWAY_EDITORIAL}
              alt="Luxury Fashion Lookbook Theme"
              aspectRatio="3:4"
              category="Lookbook"
              title="Pagoda Trench Look 04"
              enableLightbox
            />
            <FashionImage
              src={PHOTO_AVANT_GARDE_COUTURE}
              alt="Creative Studio Avant-Garde Theme"
              aspectRatio="3:4"
              category="Wearable Art"
              title="Kinetic Organza Sculpture"
              enableLightbox
            />
          </div>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E2D6] flex items-center justify-center text-[#141210]">
            <Palette className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono text-[#78716A] uppercase tracking-wider">02. BESPOKE CURATION</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141210]">6 Distinct Editorial Themes</h2>
          <p className="text-sm text-[#57524A] leading-relaxed">
            Choose between Minimal Editorial, Luxury Fashion, Creative Studio, Modern Grid, Lookbook, and Art Portfolio. Every theme alters layout composition, typographic scale, and image aspect ratios with instant live preview.
          </p>
          <ul className="space-y-2 text-xs text-[#57524A] font-mono">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Tailored luxury font pairings (Cinzel, Playfair Display)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Adaptive grid density (Compact, 3-Column, Spacious 2-Column)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Simulated 1440px desktop &amp; 375px mobile viewports</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Feature 3: Mood Boards & Concept Research */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E2D6] flex items-center justify-center text-[#141210]">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono text-[#78716A] uppercase tracking-wider">03. INTELLECTUAL LINEAGE</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141210]">Mood Boards &amp; Concept Research</h2>
          <p className="text-sm text-[#57524A] leading-relaxed">
            Preserve your intellectual process. Document the inspiration behind collections—from historical references and textile mill provenance to botanical dye tests and silhouette iterations.
          </p>
          <ul className="space-y-2 text-xs text-[#57524A] font-mono">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Textile swatches with GSM weights and weave patterns</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Color harmony chips and Pantone matching notations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Croquis sketches and gesture studies side-by-side</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6 border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <FashionImage
            src={PHOTO_MOODBOARD_FABRICS}
            alt="Concept Research Moodboard"
            aspectRatio="16:9"
            category="Moodboard"
            title="Terracotta Pigments & Raw Wool"
            enableLightbox
          />
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-[#141210] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6">
        <h3 className="font-serif text-3xl font-bold">Ready to assemble your runway monograph?</h3>
        <p className="text-xs sm:text-sm text-[#A8A29A] max-w-lg mx-auto">
          Start uploading your technical flats, collection photography, and research coordinates in seconds.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#141210] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#EFECE5]"
        >
          <span>Launch Your Atelier</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
