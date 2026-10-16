import React from 'react';
import { Portfolio, PortfolioThemeConfig } from '../../types/database';

interface ThemeCustomizerProps {
  theme: Portfolio['theme'];
  onThemeChange: (theme: Portfolio['theme']) => void;
  config: PortfolioThemeConfig;
  onConfigChange: (config: PortfolioThemeConfig) => void;
}

const THEMES: { id: Portfolio['theme']; name: string; description: string; previewBg: string }[] = [
  {
    id: 'minimal-editorial',
    name: 'Minimal Editorial',
    description: 'Pristine whitespace, large serif titles, minimalist captions, single-column focus.',
    previewBg: 'bg-[#FAF9F6] border-[#E7E2D6]',
  },
  {
    id: 'luxury-fashion',
    name: 'Luxury Fashion',
    description: 'Rich dark taupe & charcoal palette with cinematic high-contrast spreads.',
    previewBg: 'bg-[#121110] border-[#2A2723] text-white',
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Asymmetric editorial blocks with sharp structural borders and bold type.',
    previewBg: 'bg-[#F7F7F7] border-[#D9D9D9]',
  },
  {
    id: 'modern-grid',
    name: 'Modern Grid',
    description: 'Clean architectural 3-column layout with balanced spacing and clarity.',
    previewBg: 'bg-[#FFFFFF] border-[#E5E5E5]',
  },
  {
    id: 'lookbook',
    name: 'Lookbook',
    description: 'High-fashion runway progression with vertical monograph plates.',
    previewBg: 'bg-[#F9F7F4] border-[#E6E1D8]',
  },
  {
    id: 'art-portfolio',
    name: 'Art Portfolio',
    description: 'Archival tactile frames, warm paper tone, and atelier craft notes.',
    previewBg: 'bg-[#F5F2EB] border-[#DDD7CB]',
  },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onThemeChange,
  config,
  onConfigChange,
}) => {
  const updateConfig = (key: keyof PortfolioThemeConfig, value: any) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Theme Presets */}
      <div>
        <h3 className="font-semibold text-sm text-[#1A1A1A] mb-1">Editorial Theme Presets</h3>
        <p className="text-xs text-[#78716A] mb-4">Choose from six bespoke couture layout architectures.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onThemeChange(t.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                theme === t.id
                  ? 'ring-2 ring-[#1A1A1A] border-transparent shadow-xs'
                  : 'border-[#E7E2D6] hover:border-[#1A1A1A]/40 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-semibold text-xs text-[#1A1A1A]">{t.name}</span>
                <div className={`w-3.5 h-3.5 rounded-full border ${t.previewBg}`} />
              </div>
              <p className="text-[11px] text-[#78716A] leading-relaxed">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hero Layout */}
      <div>
        <h3 className="font-semibold text-sm text-[#1A1A1A] mb-1">Hero Architecture</h3>
        <p className="text-xs text-[#78716A] mb-3">Cover staging for your entrance view.</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'split-screen', label: 'Split Screen' },
            { id: 'centered-editorial', label: 'Centered Serif' },
            { id: 'magazine-cover', label: 'Magazine Cover' },
          ].map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => updateConfig('heroLayout', h.id)}
              className={`py-2 px-3 text-xs rounded-lg border text-center transition-colors ${
                config.heroLayout === h.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white border-[#E7E2D6] text-[#4A453E] hover:border-[#1A1A1A]'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Typography Preset */}
      <div>
        <h3 className="font-semibold text-sm text-[#1A1A1A] mb-1">Typography Prescription</h3>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { id: 'editorial-serif', label: 'Editorial Serif (Playfair)' },
            { id: 'haute-couture', label: 'Haute Couture (Cinzel)' },
            { id: 'modern-sans', label: 'Architectural Sans (Jakarta)' },
            { id: 'monograph', label: 'Monograph (Mono)' },
          ].map((ty) => (
            <button
              key={ty.id}
              type="button"
              onClick={() => updateConfig('typographyPreset', ty.id)}
              className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors truncate ${
                config.typographyPreset === ty.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white border-[#E7E2D6] text-[#4A453E] hover:border-[#1A1A1A]'
              }`}
            >
              {ty.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Grid Density & Aspect Ratio */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Collection Density</label>
          <select
            value={config.gridDensity}
            onChange={(e) => updateConfig('gridDensity', e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-[#DCD7CD] bg-white text-[#1A1A1A]"
          >
            <option value="compact">Compact (Dense Grid)</option>
            <option value="comfortable">Comfortable (3-Column)</option>
            <option value="spacious">Spacious (2-Column Magazine)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Image Framing</label>
          <select
            value={config.imageAspectRatio}
            onChange={(e) => updateConfig('imageAspectRatio', e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-[#DCD7CD] bg-white text-[#1A1A1A]"
          >
            <option value="3:4">Editorial Vertical (3:4)</option>
            <option value="1:1">Runway Square (1:1)</option>
            <option value="16:9">Cinematic Wide (16:9)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
