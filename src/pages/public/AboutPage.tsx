import React from 'react';
import { Link } from 'react-router-dom';
import { FashionImage } from '../../components/common/FashionImage';
import {
  PHOTO_HERO_ATELIER,
  PHOTO_TAILORING_WORKSPACE,
  PHOTO_TEXTILE_DRAPERY,
  PHOTO_DESIGNER_PORTRAIT_1,
  PHOTO_DESIGNER_PORTRAIT_2,
  FASHION_TECHNICAL_FLATS,
} from '../../assets/fashionImages';
import { ArrowRight, Check, Award, Sparkles, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Mission &amp; Atelier Heritage</span>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#141210] leading-tight">
          Documenting the Craftsmanship of Fashion.
        </h1>
        <p className="text-base sm:text-lg text-[#57524A] leading-relaxed">
          The specialized digital publication and portfolio management platform created for fashion design students, couture apprentices, and contemporary garment makers.
        </p>
      </div>

      {/* 2. Visual Atelier Split Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6 text-[#4A453E] leading-relaxed">
          <span className="text-xs font-mono uppercase text-[#78716A] tracking-wider">01. BEYOND 2D SCREENS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210]">
            Bridging the Physical Atelier and Digital Jury
          </h2>
          <p className="text-sm">
            Fashion design is inherently physical, spatial, and tactile. Unlike standard software portfolios or generic art websites, a true fashion portfolio requires more than a simple photo grid: it requires the documentation of drape, structural balance, pattern drafting, textile fabrication, and runway presentation.
          </p>
          <p className="text-sm">
            FD Atelier was founded to give fashion designers a platform that honors their medium. We provide purpose-built sections for technical CAD flats, mood boards, fabrication studies, and collection narratives, ensuring that jury examiners, talent scouts, and creative directors can appreciate the depth of your research.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white border border-[#E7E2D6]">
              <span className="text-xl font-serif font-bold text-[#141210] block mb-1">100%</span>
              <span className="text-[#78716A]">Fashion-Specific Taxonomy &amp; Spec Sections</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E7E2D6]">
              <span className="text-xl font-serif font-bold text-[#141210] block mb-1">6</span>
              <span className="text-[#78716A]">Haute Couture &amp; Editorial Layouts</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden border border-[#E7E2D6] shadow-xl bg-white p-2">
            <FashionImage
              src={PHOTO_TAILORING_WORKSPACE}
              alt="Atelier Tailoring Worktable with Shears and Toiles"
              aspectRatio="4:3"
              category="Craftsmanship"
              title="Atelier Pattern Drafting Worktable"
              enableLightbox
            />
            <div className="p-4 bg-white flex items-center justify-between text-xs text-[#57524A] border-t border-[#F2EFE9] mt-2 font-mono">
              <span>PATTERN DRAFTING &amp; MUSLIN TOILES</span>
              <span className="opacity-60">PARIS / ANTWERP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Pillars with Real Pictures */}
      <div className="space-y-8">
        <div className="border-b border-[#E7E2D6] pb-4">
          <span className="text-xs font-mono uppercase text-[#78716A] tracking-wider">FOUNDATIONAL VALUES</span>
          <h2 className="text-3xl font-serif font-bold text-[#141210] mt-1">Our Three Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#141210]">
                <img
                  src={FASHION_TECHNICAL_FLATS}
                  alt="Technical CAD Flats"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#141210]">1. Technical Rigor</h3>
              <p className="text-xs text-[#57524A] leading-relaxed">
                Garments must be constructed, not merely illustrated. We prioritize pattern dimensions, floating horsehair canvas callouts, and seam finishes.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#78716A] pt-4 border-t border-[#F2EFE9]">
              CAD &amp; SPECIFICATION STANDARDS
            </div>
          </div>

          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#141210]">
                <img
                  src={PHOTO_TEXTILE_DRAPERY}
                  alt="Tactile Silk Drapery"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#141210]">2. Material Provenance</h3>
              <p className="text-xs text-[#57524A] leading-relaxed">
                From raw silk weights to botanical dye fixation tests, document your mill provenance and sustainable sourcing with archival transparency.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#78716A] pt-4 border-t border-[#F2EFE9]">
              FABRICATION &amp; BOTANICAL DYES
            </div>
          </div>

          <div className="border border-[#E7E2D6] rounded-2xl overflow-hidden bg-white shadow-xs p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#141210]">
                <img
                  src={PHOTO_HERO_ATELIER}
                  alt="Haute Couture Silhouette"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#141210]">3. Sovereign Identity</h3>
              <p className="text-xs text-[#57524A] leading-relaxed">
                Your portfolio lives on your unique public URL with PostgreSQL Row Level Security. No unwanted ads, no algorithmic feeds, no compromise.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#78716A] pt-4 border-t border-[#F2EFE9]">
              PERMANENT RECRUITER &amp; JURY URL
            </div>
          </div>
        </div>
      </div>

      {/* 4. Atelier Advisory & Team Showcase */}
      <div className="border border-[#E7E2D6] rounded-3xl p-8 sm:p-12 bg-white shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-[#78716A] tracking-wider">ATELIER CURATION</span>
          <h2 className="text-3xl font-serif font-bold text-[#141210]">Developed with Fashion Academies</h2>
          <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
            Architected in consultation with mentors and alumni from Antwerp Royal Academy of Fine Arts, Central Saint Martins, and Bunka Fashion College Tokyo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E2D6] flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#DCD7CD] shrink-0">
              <img
                src={PHOTO_DESIGNER_PORTRAIT_1}
                alt="Camille Laurent"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#141210]">Camille Laurent</h4>
              <p className="text-xs text-[#78716A] font-mono">Head Atelier &amp; Draping Scholar</p>
              <p className="text-xs text-[#57524A] mt-1">Antwerp Royal Academy alumnus; Parisian bespoke tailoring specialist.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E2D6] flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#DCD7CD] shrink-0">
              <img
                src={PHOTO_DESIGNER_PORTRAIT_2}
                alt="Kenzo Mori"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#141210]">Kenzo Mori</h4>
              <p className="text-xs text-[#78716A] font-mono">Tailoring Director</p>
              <p className="text-xs text-[#57524A] mt-1">Bunka Fashion College Tokyo; architectural menswear and wool engineering.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom CTA */}
      <div className="bg-[#141210] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6">
        <h3 className="font-serif text-3xl font-bold">Present your work to the global fashion community</h3>
        <p className="text-xs sm:text-sm text-[#A8A29A] max-w-lg mx-auto leading-relaxed">
          Create your atelier profile in minutes and start assembling your digital lookbook.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#141210] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EFECE5] transition-colors"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
