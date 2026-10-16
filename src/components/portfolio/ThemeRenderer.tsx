import React, { useState } from 'react';
import { Portfolio, Project } from '../../types/database';
import { FashionImage } from '../common/FashionImage';
import { Mail, Globe, MapPin, Share2, Copy, Check, ArrowUpRight, Award, Sparkles, BookOpen, Layers, Scissors, Camera, ChevronRight, X } from 'lucide-react';

interface ThemeRendererProps {
  portfolio: Portfolio;
  previewMode?: boolean;
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({ portfolio, previewMode = false }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const theme = portfolio.theme || 'minimal-editorial';
  const cfg = portfolio.theme_config || {};
  const sections = (portfolio.section_config || []).filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const owner = portfolio.owner || {};

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio.title,
          text: portfolio.subtitle || portfolio.introduction || 'Fashion Design Portfolio',
          url: `${window.location.origin}/portfolio/${portfolio.slug}`,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Theme styling variants
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'luxury-fashion':
        return 'bg-[#0E0D0C] text-[#F3EFE6]';
      case 'art-portfolio':
        return 'bg-[#F6F3EC] text-[#282420]';
      case 'creative-studio':
        return 'bg-[#F9F9F9] text-[#111111]';
      case 'modern-grid':
        return 'bg-[#FFFFFF] text-[#1E1E1E]';
      case 'lookbook':
        return 'bg-[#FAF8F5] text-[#1C1917]';
      case 'minimal-editorial':
      default:
        return 'bg-[#FAF9F6] text-[#1A1A1A]';
    }
  };

  const getHeadingFont = () => {
    switch (cfg.typographyPreset) {
      case 'haute-couture':
        return 'font-display tracking-widest uppercase';
      case 'modern-sans':
        return 'font-sans font-bold tracking-tight';
      case 'monograph':
        return 'font-mono uppercase tracking-wider';
      case 'editorial-serif':
      default:
        return 'font-serif font-normal italic';
    }
  };

  const getBorderColor = () => {
    return theme === 'luxury-fashion' ? 'border-[#26221D]' : 'border-[#E7E2D6]';
  };

  const getMutedText = () => {
    return theme === 'luxury-fashion' ? 'text-[#9C9488]' : 'text-[#6E675D]';
  };

  const projects = portfolio.projects || [];

  return (
    <div className={`min-h-screen ${getThemeWrapperClass()} transition-colors duration-300 selection:bg-amber-800 selection:text-white`}>
      {/* Portfolio Header Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${getBorderColor()} ${theme === 'luxury-fashion' ? 'bg-[#0E0D0C]/90' : 'bg-[#FAF9F6]/90'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase opacity-75">
              {owner.display_name || 'Fashion Designer'}
            </span>
            <h1 className={`text-base md:text-lg font-bold truncate ${getHeadingFont()}`}>
              {portfolio.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {previewMode && (
              <span className="text-[11px] font-mono uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded">
                Draft Preview
              </span>
            )}
            <button
              onClick={handleCopyLink}
              className={`p-2 border ${getBorderColor()} hover:opacity-80 rounded text-xs flex items-center gap-1.5 transition-colors`}
              title="Copy Portfolio Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-xs">{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded text-xs flex items-center gap-1.5 transition-colors"
              title="Share Portfolio"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Render Dynamic Sections in Configured Order */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-24 md:space-y-36">
        {sections.map((sec) => {
          switch (sec.type) {
            case 'hero':
              return (
                <section key={sec.id} className="relative pt-6 md:pt-12">
                  {cfg.heroLayout === 'magazine-cover' ? (
                    <div className="relative rounded-2xl overflow-hidden min-h-[560px] flex items-end p-8 md:p-16 border border-black/10">
                      <div className="absolute inset-0 z-0">
                        <FashionImage
                          src={portfolio.cover_image_path}
                          alt={portfolio.title}
                          className="w-full h-full object-cover"
                          aspectRatio="16:9"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                      </div>
                      <div className="relative z-10 max-w-3xl text-white space-y-4">
                        <span className="text-xs font-mono tracking-widest uppercase text-amber-200">
                          {portfolio.specialization || 'Haute Couture Collection'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
                          {portfolio.title}
                        </h2>
                        {portfolio.subtitle && (
                          <p className="text-lg md:text-xl text-neutral-200 font-light italic">
                            {portfolio.subtitle}
                          </p>
                        )}
                        {portfolio.introduction && (
                          <p className="text-sm md:text-base text-neutral-300 leading-relaxed pt-2 max-w-2xl">
                            {portfolio.introduction}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : cfg.heroLayout === 'centered-editorial' ? (
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                      <div className="flex items-center justify-center gap-3 text-xs font-mono tracking-widest uppercase opacity-70">
                        <span>{owner.display_name}</span>
                        <span>·</span>
                        <span>{portfolio.specialization}</span>
                      </div>
                      <h2 className={`text-4xl md:text-7xl font-normal ${getHeadingFont()} leading-[1.1]`}>
                        {portfolio.title}
                      </h2>
                      {portfolio.subtitle && (
                        <p className="text-lg md:text-2xl italic font-serif opacity-80 max-w-2xl mx-auto">
                          {portfolio.subtitle}
                        </p>
                      )}
                      <div className="w-16 h-[1px] bg-current opacity-30 mx-auto my-6" />
                      {portfolio.cover_image_path && (
                        <div className="mt-10 overflow-hidden rounded-xl border border-black/10 max-w-3xl mx-auto">
                          <FashionImage
                            src={portfolio.cover_image_path}
                            alt={portfolio.title}
                            aspectRatio="16:9"
                            priority
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Default: Split-Screen Hero */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-70">
                          <span>{owner.display_name}</span>
                          <span>/</span>
                          <span>{portfolio.specialization || 'Fashion Design'}</span>
                        </div>
                        <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] ${getHeadingFont()}`}>
                          {portfolio.title}
                        </h2>
                        {portfolio.subtitle && (
                          <p className="text-xl sm:text-2xl font-serif italic opacity-85">
                            {portfolio.subtitle}
                          </p>
                        )}
                        {portfolio.introduction && (
                          <p className={`text-sm sm:text-base leading-relaxed ${getMutedText()} max-w-xl`}>
                            {portfolio.introduction}
                          </p>
                        )}
                        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                          {owner.institution && (
                            <span className="flex items-center gap-1.5 opacity-80">
                              <BookOpen className="w-3.5 h-3.5" />
                              {owner.institution}
                            </span>
                          )}
                          {owner.location && (
                            <span className="flex items-center gap-1.5 opacity-80">
                              <MapPin className="w-3.5 h-3.5" />
                              {owner.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <div className={`overflow-hidden rounded-xl border ${getBorderColor()} shadow-sm`}>
                          <FashionImage
                            src={portfolio.cover_image_path}
                            alt={portfolio.title}
                            aspectRatio="3:4"
                            category={portfolio.specialization || 'Atelier'}
                            title={portfolio.title}
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );

            case 'about':
              return (
                <section key={sec.id} className={`border-t ${getBorderColor()} pt-16`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4 space-y-3">
                      <span className="text-xs font-mono tracking-widest uppercase opacity-60">01. Perspective</span>
                      <h3 className={`text-2xl md:text-3xl font-bold ${getHeadingFont()}`}>
                        {sec.title}
                      </h3>
                      {sec.subtitle && (
                        <p className="text-xs uppercase tracking-wider font-mono opacity-70">{sec.subtitle}</p>
                      )}
                    </div>
                    <div className="md:col-span-8 space-y-6">
                      <p className="text-base sm:text-lg leading-relaxed font-serif italic opacity-90">
                        {owner.bio ||
                          "Fashion design is the structural dialogue between body, silhouette, and tactile materiality. Every garment is drafted with rigorous proportion, respectful textile sourcing, and unwavering focus on form."}
                      </p>
                      {owner.specialties && owner.specialties.length > 0 && (
                        <div className="pt-4">
                          <h4 className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">Design Focus</h4>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {owner.specialties.map((spec, i) => (
                              <span key={i} className="opacity-80">
                                {spec} {owner.specialties && i < owner.specialties.length - 1 ? '·' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

            case 'featured_projects':
              return (
                <section key={sec.id} className={`border-t ${getBorderColor()} pt-16`}>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                      <span className="text-xs font-mono tracking-widest uppercase opacity-60">02. Selected Works</span>
                      <h3 className={`text-2xl md:text-4xl font-bold ${getHeadingFont()} mt-1`}>
                        {sec.title}
                      </h3>
                    </div>
                    <p className={`text-xs font-mono uppercase tracking-wider ${getMutedText()}`}>
                      {projects.length} Curated Collections
                    </p>
                  </div>

                  {projects.length === 0 ? (
                    <div className={`p-12 border ${getBorderColor()} rounded-xl text-center space-y-3`}>
                      <Scissors className="w-8 h-8 mx-auto opacity-40" />
                      <h4 className="font-serif text-lg">Curating Collection Pieces</h4>
                      <p className={`text-xs ${getMutedText()} max-w-md mx-auto`}>
                        Design projects linked to this portfolio will be presented here in high-resolution editorial format.
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-8 ${
                        cfg.gridDensity === 'compact'
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                          : cfg.gridDensity === 'spacious'
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {projects.map((proj, idx) => (
                        <article
                          key={proj.id || idx}
                          onClick={() => setSelectedProject(proj)}
                          className={`group cursor-pointer border ${getBorderColor()} rounded-xl overflow-hidden bg-black/2 hover:border-current transition-all duration-300 flex flex-col justify-between`}
                        >
                          <div>
                            <FashionImage
                              src={proj.cover_image_path}
                              alt={proj.title}
                              aspectRatio={cfg.imageAspectRatio || '3:4'}
                              category={proj.category?.name || 'Collection'}
                              title={proj.title}
                            />
                            <div className="p-5 space-y-2">
                              <div className="flex items-center justify-between text-xs font-mono opacity-60">
                                <span>{proj.category?.name || 'Fashion Design'}</span>
                                {proj.project_date && <span>{new Date(proj.project_date).getFullYear()}</span>}
                              </div>
                              <h4 className="font-serif text-lg font-semibold group-hover:italic transition-all">
                                {proj.title}
                              </h4>
                              {proj.short_description && (
                                <p className={`text-xs line-clamp-2 ${getMutedText()}`}>
                                  {proj.short_description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`px-5 pb-5 pt-2 border-t ${getBorderColor()} flex items-center justify-between text-xs font-mono opacity-70 group-hover:opacity-100`}>
                            <span>View Atelier Specs</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );

            case 'illustrations':
            case 'mood_boards':
            case 'textiles':
            case 'technical_flats':
              return (
                <section key={sec.id} className={`border-t ${getBorderColor()} pt-16`}>
                  <div className="space-y-4 mb-8">
                    <span className="text-xs font-mono tracking-widest uppercase opacity-60">
                      Archive &amp; Technical Specs
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-bold ${getHeadingFont()}`}>
                      {sec.title}
                    </h3>
                    {sec.subtitle && (
                      <p className={`text-xs font-mono uppercase tracking-wider ${getMutedText()}`}>
                        {sec.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className={`border ${getBorderColor()} rounded-xl overflow-hidden p-3 bg-black/2 space-y-3`}>
                        <FashionImage
                          alt={`${sec.title} item ${item}`}
                          aspectRatio="4:3"
                          category={sec.title}
                          title={`Study ${item} · Prototype & Fabrication`}
                        />
                        <div className="px-2 pb-2">
                          <p className="text-xs font-mono opacity-70">Plate #{item} — Materiality &amp; Drape Analysis</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'education':
              return (
                <section key={sec.id} className={`border-t ${getBorderColor()} pt-16`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                      <span className="text-xs font-mono tracking-widest uppercase opacity-60">Background</span>
                      <h3 className={`text-2xl md:text-3xl font-bold ${getHeadingFont()} mt-1`}>
                        {sec.title}
                      </h3>
                    </div>
                    <div className="md:col-span-8 space-y-6">
                      <div className={`border-b ${getBorderColor()} pb-4`}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-semibold text-base">{owner.institution || 'Fashion Institute'}</h4>
                          <span className="text-xs font-mono opacity-60">Class of {owner.graduation_year || '2026'}</span>
                        </div>
                        <p className={`text-xs ${getMutedText()} mt-1`}>
                          Degree in Fashion Design &amp; Haute Couture Construction
                        </p>
                      </div>
                      {owner.skills && owner.skills.length > 0 && (
                        <div>
                          <h5 className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">Technical Competencies</h5>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {owner.skills.map((s, i) => (
                              <span key={i} className="opacity-80">
                                {s} {owner.skills && i < owner.skills.length - 1 ? '·' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key={sec.id} className={`border-t ${getBorderColor()} pt-16 pb-12`}>
                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    <span className="text-xs font-mono tracking-widest uppercase opacity-60">Inquiries</span>
                    <h3 className={`text-3xl md:text-5xl font-bold ${getHeadingFont()}`}>
                      {sec.title}
                    </h3>
                    <p className={`text-sm ${getMutedText()}`}>
                      For runway commissions, editorial styling, capsule production, or career inquiries:
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center items-center gap-6 text-sm">
                      {owner.social_links?.email && (
                        <a
                          href={`mailto:${owner.social_links.email}`}
                          className="flex items-center gap-2 hover:opacity-75 transition-opacity underline underline-offset-4"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{owner.social_links.email}</span>
                        </a>
                      )}
                      {owner.website_url && (
                        <a
                          href={owner.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 hover:opacity-75 transition-opacity underline underline-offset-4"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Atelier Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </main>

      {/* Project Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] text-[#1A1A1A] border border-[#E7E2D6] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-[#E7E2D6]">
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
                  {selectedProject.category?.name || 'Collection Piece'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Close project modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <FashionImage
                src={selectedProject.cover_image_path}
                alt={selectedProject.title}
                aspectRatio="16:9"
                category={selectedProject.category?.name}
                title={selectedProject.title}
              />

              {selectedProject.description && (
                <div className="prose text-sm text-[#4A453E] leading-relaxed">
                  <p>{selectedProject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7E2D6] text-xs">
                {selectedProject.tools && selectedProject.tools.length > 0 && (
                  <div>
                    <h5 className="font-mono uppercase text-[#78716A] mb-1">Techniques &amp; Tools</h5>
                    <p>{selectedProject.tools.join(', ')}</p>
                  </div>
                )}
                {selectedProject.inspiration && (
                  <div>
                    <h5 className="font-mono uppercase text-[#78716A] mb-1">Concept &amp; Inspiration</h5>
                    <p>{selectedProject.inspiration}</p>
                  </div>
                )}
                {selectedProject.outcome && (
                  <div>
                    <h5 className="font-mono uppercase text-[#78716A] mb-1">Fabrication Outcome</h5>
                    <p>{selectedProject.outcome}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
