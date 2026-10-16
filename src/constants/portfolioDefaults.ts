import { PortfolioThemeConfig, PortfolioSection } from '../types/database';

export const defaultThemeConfig: PortfolioThemeConfig = {
  accentColor: '#171717',
  backgroundColor: '#FAF9F6',
  textColor: '#1A1A1A',
  typographyPreset: 'editorial-serif',
  gridDensity: 'comfortable',
  imageAspectRatio: '3:4',
  heroLayout: 'split-screen',
  showContactBar: true,
  showBioSection: true,
  showSocialLinks: true,
};

export const defaultSections: PortfolioSection[] = [
  { id: 'hero-1', type: 'hero', title: 'Introduction', subtitle: 'Atelier Statement', enabled: true, order: 0 },
  { id: 'about-1', type: 'about', title: 'Designer Statement', subtitle: 'Philosophy & Craft', enabled: true, order: 1 },
  { id: 'feat-1', type: 'featured_projects', title: 'Selected Collections', subtitle: 'Runway & Capsule Pieces', enabled: true, order: 2 },
  { id: 'ill-1', type: 'illustrations', title: 'Fashion Illustrations', subtitle: 'Croquis & Design Sketches', enabled: true, order: 3 },
  { id: 'mood-1', type: 'mood_boards', title: 'Mood Boards & Concept Research', subtitle: 'Atmospheric Invocations', enabled: true, order: 4 },
  { id: 'text-1', type: 'textiles', title: 'Textile & Surface Design', subtitle: 'Drape & Manipulation', enabled: true, order: 5 },
  { id: 'tech-1', type: 'technical_flats', title: 'Technical Flats & Specs', subtitle: 'Pattern Drafting & Construction', enabled: false, order: 6 },
  { id: 'edu-1', type: 'education', title: 'Education & Honors', subtitle: 'Academic & Studio Lineage', enabled: false, order: 7 },
  { id: 'contact-1', type: 'contact', title: 'Atelier Inquiries', subtitle: 'Commission & Consultation', enabled: true, order: 8 },
];
