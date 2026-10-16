import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { FashionImage } from '../../components/common/FashionImage';
import {
  FASHION_DESIGNER_PORTRAIT,
  FASHION_TECHNICAL_FLATS,
  FASHION_LOOKBOOK_COAT,
  FASHION_RUNWAY_GOWN,
  PHOTO_DESIGNER_PORTRAIT_1,
  PHOTO_RUNWAY_EDITORIAL,
  PHOTO_PFW_RUNWAY_BURGUNDY,
} from '../../assets/fashionImages';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Initialize Your Atelier Profile',
      desc: 'Specify your fashion specialization (Haute Couture, RTW, Avant-Garde, Knitwear), educational background, technical patternmaking proficiencies, and atelier contact channels.',
      image: PHOTO_DESIGNER_PORTRAIT_1,
      alt: 'Atelier profile headshot and credentials',
    },
    {
      num: '02',
      title: 'Curate Design Projects & Upload Media',
      desc: 'Upload high-resolution runway photography, technical flat drawings, textile swatch textures, and process documentation directly into your Supabase-backed media library.',
      image: FASHION_TECHNICAL_FLATS,
      alt: 'CAD technical flats and pattern grading',
    },
    {
      num: '03',
      title: 'Architect Sections & Select Theme',
      desc: 'Use the interactive builder to arrange sections in your narrative order. Switch between 6 luxury themes, customize layout density, and test with live desktop and mobile previews.',
      image: PHOTO_RUNWAY_EDITORIAL,
      alt: 'Luxury lookbook theme and layout customizer',
    },
    {
      num: '04',
      title: 'Publish & Share Your Unique URL',
      desc: 'Generate a clean, permanent public URL (e.g. /portfolio/maison-de-lombre) protected by PostgreSQL Row Level Security. Share directly with fashion school juries, recruiters, and luxury houses.',
      image: PHOTO_PFW_RUNWAY_BURGUNDY,
      alt: 'Paris fashion runway showcase live url',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Runway Progression</span>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#141210] leading-tight">
          How the Portfolio Builder Works.
        </h1>
        <p className="text-base text-[#57524A] leading-relaxed">
          From concept sketches to an internationally accessible digital runway in four purposeful steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="border border-[#E7E2D6] rounded-2xl bg-white overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#141210] transition-colors"
          >
            <div>
              <FashionImage
                src={step.image}
                alt={step.alt}
                aspectRatio="4:3"
                category={`Step ${step.num}`}
                title={step.title}
                enableLightbox
              />
              <div className="p-6 space-y-2">
                <span className="text-2xl font-serif font-bold text-[#141210]/40 block">{step.num}</span>
                <h3 className="font-serif text-lg font-bold text-[#141210]">{step.title}</h3>
                <p className="text-xs text-[#57524A] leading-relaxed">{step.desc}</p>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center gap-1.5 text-[11px] font-mono text-[#78716A]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step Verified</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[#E7E2D6] rounded-3xl p-10 bg-[#FAF9F6] text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#141210]">No Coding or Web Development Required</h3>
        <p className="text-xs sm:text-sm text-[#57524A] max-w-md mx-auto">
          Every portfolio is generated with semantic HTML, responsive grids, and instant caching.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#141210] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2A2723]"
          >
            <span>Begin Building Your Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
