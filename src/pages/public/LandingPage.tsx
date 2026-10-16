import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedPortfolios } from '../../services/portfolioService';
import { Portfolio } from '../../types/database';
import { FashionImage } from '../../components/common/FashionImage';
import { FashionLightbox } from '../../components/common/FashionLightbox';
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
  FASHION_GALLERY_ITEMS,
  FashionGalleryItem,
} from '../../assets/fashionImages';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Scissors,
  Palette,
  ShieldCheck,
  Globe,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredPortfolios, setFeaturedPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<string>('all');
  const [activeThemePreview, setActiveThemePreview] = useState<string>('minimal-editorial');
  const [activeLightboxItem, setActiveLightboxItem] = useState<FashionGalleryItem | null>(null);

  useEffect(() => {
    fetchFeaturedPortfolios().then(({ data }) => {
      setFeaturedPortfolios(data);
      setLoading(false);
    });
  }, []);

  // Filter gallery items by category
  const filteredGallery =
    selectedGalleryTab === 'all'
      ? FASHION_GALLERY_ITEMS
      : selectedGalleryTab === 'runway'
      ? FASHION_GALLERY_ITEMS.filter((i) => i.category.includes('Haute') || i.category.includes('Tailoring'))
      : selectedGalleryTab === 'technical'
      ? FASHION_GALLERY_ITEMS.filter((i) => i.type === 'flat' || i.category.includes('Pattern'))
      : selectedGalleryTab === 'textile'
      ? FASHION_GALLERY_ITEMS.filter((i) => i.type === 'moodboard' || i.category.includes('Textile'))
      : FASHION_GALLERY_ITEMS.filter((i) => i.type === 'photography');

  // Interactive theme preview styling configurations
  const themePresets: Record<
    string,
    { name: string; tag: string; description: string; bg: string; text: string; border: string; fontClass: string }
  > = {
    'minimal-editorial': {
      name: 'Minimal Editorial',
      tag: 'Antwerp & Scandinavian Minimal',
      description: 'Generous white space, refined serif typography, and balanced asymmetrical margins.',
      bg: 'bg-[#FAF9F6]',
      text: 'text-[#141210]',
      border: 'border-[#E7E2D6]',
      fontClass: 'font-serif',
    },
    'luxury-fashion': {
      name: 'Luxury Fashion',
      tag: 'Paris Haute Couture Spread',
      description: 'Deep onyx backdrop, high-contrast imagery, and dramatic magazine-cover title lockups.',
      bg: 'bg-[#0D0C0B]',
      text: 'text-[#FAF8F5]',
      border: 'border-[#292522]',
      fontClass: 'font-display',
    },
    'creative-studio': {
      name: 'Creative Studio',
      tag: 'Milanese Avant-Garde',
      description: 'High-density grids, bold sans headings, and vibrant editorial accent borders.',
      bg: 'bg-[#F2EFE9]',
      text: 'text-[#1C1A17]',
      border: 'border-[#D9D3C7]',
      fontClass: 'font-sans',
    },
    'modern-grid': {
      name: 'Modern Grid',
      tag: 'Tokyo Architectural Monograph',
      description: 'Rigorous 12-column alignment, visible drafting rule lines, and structured coordinate cards.',
      bg: 'bg-[#FFFFFF]',
      text: 'text-[#0F0E0D]',
      border: 'border-[#141210]',
      fontClass: 'font-mono',
    },
    'lookbook': {
      name: 'Lookbook',
      tag: 'Runway Capsule Monograph',
      description: 'Full-bleed 3:4 portrait plates with prominent look numbers, fabric compositions, and credits.',
      bg: 'bg-[#181614]',
      text: 'text-[#EFECE6]',
      border: 'border-[#332C25]',
      fontClass: 'font-serif italic',
    },
    'art-portfolio': {
      name: 'Art Portfolio',
      tag: 'Curatorial Exhibition Monograph',
      description: 'Gallery museum plates with neutral matting, curatorial statements, and archival catalogue tags.',
      bg: 'bg-[#F7F5F0]',
      text: 'text-[#201C18]',
      border: 'border-[#DBD5C8]',
      fontClass: 'font-serif',
    },
  };

  return (
    <div className="space-y-24 md:space-y-36 pb-20">
      {/* 1. Hero Section adhering to Split-Screen Hero & Claim-to-Proof Adjacency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#78716A] uppercase bg-[#FAF9F6] border border-[#E7E2D6] px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>FD ATELIER</span>
              <span>·</span>
              <span>HAUTE COUTURE DIGITAL RUNWAY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-[#141210] leading-[1.08] text-balance">
              The Digital Atelier for Fashion Designers.
            </h1>

            <p className="text-base sm:text-lg text-[#57524A] leading-relaxed max-w-xl">
              Build, customize, and publish haute couture and ready-to-wear digital portfolios without writing a line of code. Designed exclusively for fashion students, independent ateliers, and design professionals.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/register"
                className="px-7 py-4 bg-[#141210] text-[#FAF9F6] hover:bg-[#2A2723] rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-md group"
              >
                <span>Create Your Portfolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/explore"
                className="px-7 py-4 border border-[#DCD7CD] bg-white text-[#141210] hover:border-[#141210] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>Explore Portfolios</span>
              </Link>
            </div>

            {/* Quick credentials badge */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#78716A] font-mono">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero Coding Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>CAD Flat Specs &amp; Moodboards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>6 Luxury Themes</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-fashion Visual Media Frame with Real Editorial Photography */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E7E2D6] shadow-xl bg-white p-2">
              <FashionImage
                src={PHOTO_HERO_ATELIER}
                alt="Haute Couture atelier drape and design form in sunlight"
                aspectRatio="3:4"
                category="Haute Couture"
                title="Maison de l’Ombre · Architectural Draping Study"
                subtitle="True bias silk dupioni & double-faced wool"
                designer="Camille Laurent"
                fabrication="100% Raw Silk Dupioni & Melton Wool"
                season="Capsule Autumn/Winter 2026"
                atelierNotes="Constructed with hand-pad stitching, floating horsehair canvas, and zero-waste bias cutting."
                priority
                enableLightbox
              />
              <div className="p-4 bg-white flex items-center justify-between text-xs text-[#57524A] border-t border-[#F2EFE9] mt-2">
                <div>
                  <p className="font-serif italic font-semibold text-[#141210]">Maison de l’Ombre</p>
                  <p className="text-[11px] font-mono opacity-70">Antwerp Royal Academy of Fine Arts</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-[#F2EFE9] px-2.5 py-1 rounded border border-[#E5E0D5]">
                    Click to Inspect
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adjacency Proof Row */}
        <div className="mt-16 pt-8 border-t border-[#E7E2D6] grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">6</p>
            <p className="text-xs text-[#78716A] uppercase font-mono tracking-wider mt-1">Couture Layout Themes</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">14+</p>
            <p className="text-xs text-[#78716A] uppercase font-mono tracking-wider mt-1">Fashion Section Types</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">100%</p>
            <p className="text-xs text-[#78716A] uppercase font-mono tracking-wider mt-1">PostgreSQL &amp; RLS Verified</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">Direct</p>
            <p className="text-xs text-[#78716A] uppercase font-mono tracking-wider mt-1">Recruiter &amp; Press Links</p>
          </div>
        </div>
      </section>

      {/* 2. Featured Portfolios Section with Authentic Photography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E7E2D6]">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Curated Discovery</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210] mt-1">
              Featured Designer Portfolios
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#141210] hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <span>View All Works</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-[#E7E2D6] rounded-xl p-4 bg-white animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-[#F2EFE9] rounded-lg" />
                <div className="h-4 bg-[#F2EFE9] rounded w-3/4" />
                <div className="h-3 bg-[#F2EFE9] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredPortfolios.length === 0 ? (
          <div className="p-12 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-3">
            <Scissors className="w-8 h-8 text-[#A3998F] mx-auto" />
            <h3 className="font-serif text-xl font-semibold">Atelier Collections in Preparation</h3>
            <p className="text-xs text-[#78716A] max-w-md mx-auto">
              Be the first designer to publish your fashion portfolio on FD Atelier and appear in the featured editorial gallery.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-block px-5 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
              >
                Publish Your First Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPortfolios.map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.slug}`}
                className="group border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white hover:border-[#141210] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <FashionImage
                    src={item.cover_image_path}
                    alt={item.title}
                    aspectRatio="3:4"
                    category={item.specialization || 'Fashion'}
                    title={item.title}
                  />
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
                      <span className="uppercase tracking-wider font-semibold text-[#141210]/80">
                        {item.specialization || 'Haute Couture'}
                      </span>
                      <span className="bg-[#FAF9F6] border border-[#E7E2D6] px-2 py-0.5 rounded text-[10px]">
                        {item.owner?.user_type || 'Designer'}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141210] group-hover:italic transition-all">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-[#57524A] line-clamp-2 leading-relaxed">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#78716A]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#141210]" />
                    <span className="font-medium text-[#141210]">{item.owner?.display_name || 'Designer'}</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider group-hover:text-[#141210] font-semibold flex items-center gap-1">
                    <span>View Monograph</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Interactive Runway Lookbook & Fashion Media Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E7E2D6]">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Actual Atelier Imagery</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210] mt-1">
              Curated Lookbook &amp; Technical Archive
            </h2>
            <p className="text-xs text-[#57524A] mt-1">
              Click on any photograph or technical plate to inspect high-resolution fabrication details and atelier notes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'runway', label: 'Runway & Lookbooks' },
              { id: 'technical', label: 'CAD Flats & Specs' },
              { id: 'textile', label: 'Textiles & Moodboards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGalleryTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedGalleryTab === tab.id
                    ? 'bg-[#141210] text-white font-semibold'
                    : 'bg-white border border-[#DCD7CD] text-[#57524A] hover:bg-[#FAF9F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs group hover:border-[#141210] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative overflow-hidden bg-[#181614] aspect-[4/3]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-white text-[#141210] shadow-md flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase">
                    <Maximize2 className="w-4 h-4" />
                    <span>Inspect Piece</span>
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-[#141210]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase border border-white/10">
                  {item.category}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#78716A]">
                  <span>{item.designer}</span>
                  <span>{item.season}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#141210] group-hover:italic transition-all">
                  {item.title}
                </h3>
                <p className="text-xs text-[#57524A] line-clamp-2 leading-relaxed">
                  {item.atelierNotes}
                </p>
                {item.fabrication && (
                  <div className="pt-2 border-t border-[#F2EFE9] text-[10px] font-mono text-[#78716A]">
                    <span className="uppercase text-[#141210] font-semibold">Fabric: </span>
                    <span>{item.fabrication}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Live Theme Switcher on Homepage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Couture Aesthetics</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">
            6 Distinct Editorial Themes. Switch Instantly.
          </h2>
          <p className="text-sm text-[#57524A] leading-relaxed">
            Test how your monograph appears across world-class layouts. Select a theme below to preview the responsive aesthetic:
          </p>
        </div>

        {/* Theme Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {Object.entries(themePresets).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveThemePreview(key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeThemePreview === key
                  ? 'border-[#141210] bg-[#141210] text-white shadow-md'
                  : 'border-[#E7E2D6] bg-white text-[#141210] hover:border-[#141210]'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{config.name}</div>
              <div
                className={`text-[10px] font-mono mt-1 ${
                  activeThemePreview === key ? 'text-[#B8AF9F]' : 'text-[#78716A]'
                }`}
              >
                {config.tag}
              </div>
            </button>
          ))}
        </div>

        {/* Live Theme Preview Sandbox Frame */}
        {(() => {
          const activeConfig = themePresets[activeThemePreview];
          return (
            <div
              className={`rounded-3xl border ${activeConfig.border} ${activeConfig.bg} ${activeConfig.text} p-6 sm:p-12 transition-all duration-500 shadow-xl overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-current/15 mb-8">
                <div>
                  <span className="text-xs font-mono tracking-widest uppercase opacity-70">
                    PREVIEWING: {activeConfig.name.toUpperCase()}
                  </span>
                  <h3 className={`text-3xl sm:text-4xl font-bold mt-1 ${activeConfig.fontClass}`}>
                    Maison de l’Ombre
                  </h3>
                  <p className="text-xs opacity-80 mt-1 max-w-xl">{activeConfig.description}</p>
                </div>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider bg-current text-inverted transition-opacity hover:opacity-90 self-start md:self-auto"
                  style={{
                    backgroundColor: activeThemePreview === 'luxury-fashion' ? '#FAF8F5' : '#141210',
                    color: activeThemePreview === 'luxury-fashion' ? '#141210' : '#FAF8F5',
                  }}
                >
                  Use This Theme &rarr;
                </Link>
              </div>

              {/* Mock editorial layout inside frame */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <div className="text-xs font-mono opacity-60 uppercase tracking-widest">LOOK 04 · ANTWERP ARCHIVE</div>
                  <h4 className={`text-2xl sm:text-3xl font-bold leading-snug ${activeConfig.fontClass}`}>
                    Sculptural Pagoda Melton Wool Trench
                  </h4>
                  <p className="text-xs opacity-75 leading-relaxed">
                    Extreme shoulder architecture balanced against narrow armscye drafting. Floating horsehair canvas and hand-pad stitching.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs font-mono opacity-80">
                    <span>480 GSM MELTON</span>
                    <span>·</span>
                    <span>SAVILE ROW CANVAS</span>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden border border-current/20 shadow-sm aspect-[3/4]">
                    <img
                      src={PHOTO_RUNWAY_EDITORIAL}
                      alt="Pagoda Trench Runway Monograph"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-current/20 shadow-sm aspect-[3/4]">
                    <img
                      src={FASHION_TECHNICAL_FLATS}
                      alt="Technical Flat CAD Drafting"
                      className="w-full h-full object-cover bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 5. Garment Development Lifecycle Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Full Lifecycle Documentation</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">
            From Initial Draping to the Catwalk.
          </h2>
          <p className="text-sm text-[#57524A] leading-relaxed">
            Generic website builders flatten fashion into plain blog posts. FD Atelier is architected around the genuine garment development process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center text-[#141210] font-mono text-sm font-bold">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-[#141210]">Concept &amp; Moodboard</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Upload physical swatches, madder root botanical dye cards, Pantone chips, and silhouette gesture sketches with full credit notation.
            </p>
          </div>

          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center text-[#141210] font-mono text-sm font-bold">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-[#141210]">Draping &amp; Muslin Toile</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Document fitting iterations on mannequins, bias tension tests, and tailor chalk annotations proving spatial mastery.
            </p>
          </div>

          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center text-[#141210] font-mono text-sm font-bold">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-[#141210]">CAD Flats &amp; Tech Packs</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Attach millimeter-accurate CAD pattern drafting coordinates, seam allowances, and Milanese buttonhole callouts.
            </p>
          </div>

          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E7E2D6] flex items-center justify-center text-[#141210] font-mono text-sm font-bold">
              04
            </div>
            <h3 className="font-serif text-lg font-bold text-[#141210]">Digital Runway Showcase</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Publish with permanent URLs, recruiter-friendly download actions, and complete protection under PostgreSQL Row Level Security.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Editorial CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141210] text-[#FAF9F6] rounded-3xl p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF2DC_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <span className="text-xs font-mono tracking-widest text-[#A8A29A] uppercase">Ready to Showcase?</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white max-w-2xl mx-auto leading-tight">
            Elevate Your Fashion Design Portfolio Today.
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A29A] max-w-xl mx-auto leading-relaxed">
            Join students from prestigious fashion academies and independent designers presenting their work to luxury brands, buyers, and fashion houses.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[#141210] hover:bg-[#EFECE5] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 border border-[#38332D] text-[#FAF9F6] hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Browse Public Works
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for any gallery item clicked */}
      {activeLightboxItem && (
        <FashionLightbox
          isOpen={!!activeLightboxItem}
          onClose={() => setActiveLightboxItem(null)}
          imageUrl={activeLightboxItem.imageUrl}
          title={activeLightboxItem.title}
          subtitle={activeLightboxItem.subtitle}
          category={activeLightboxItem.category}
          designer={activeLightboxItem.designer}
          atelierNotes={activeLightboxItem.atelierNotes}
          fabrication={activeLightboxItem.fabrication}
          season={activeLightboxItem.season}
        />
      )}
    </div>
  );
};
