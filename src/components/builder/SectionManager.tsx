import React from 'react';
import { PortfolioSection, SectionType } from '../../types/database';
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from 'lucide-react';

interface SectionManagerProps {
  sections: PortfolioSection[];
  onChange: (updated: PortfolioSection[]) => void;
}

const AVAILABLE_SECTION_TYPES: { type: SectionType; title: string; subtitle: string }[] = [
  { type: 'hero', title: 'Introduction', subtitle: 'Atelier Statement' },
  { type: 'about', title: 'Designer Statement', subtitle: 'Philosophy & Craft' },
  { type: 'featured_projects', title: 'Selected Collections', subtitle: 'Runway & Capsule Pieces' },
  { type: 'illustrations', title: 'Fashion Illustrations', subtitle: 'Croquis & Design Sketches' },
  { type: 'mood_boards', title: 'Mood Boards & Research', subtitle: 'Atmospheric Invocations' },
  { type: 'textiles', title: 'Textile & Surface Design', subtitle: 'Drape & Manipulation' },
  { type: 'garment_construction', title: 'Garment Construction', subtitle: 'Pattern Drafting & Tailoring' },
  { type: 'technical_flats', title: 'Technical Flats & Specs', subtitle: 'CAD & Production Packages' },
  { type: 'photography', title: 'Fashion Photography', subtitle: 'Lookbook & Editorial' },
  { type: 'process', title: 'Design Process', subtitle: 'Ideation to Final Piece' },
  { type: 'education', title: 'Education & Honors', subtitle: 'Academic Lineage' },
  { type: 'skills', title: 'Skills & Techniques', subtitle: 'Couture Craftsmanship' },
  { type: 'awards', title: 'Awards & Exhibitions', subtitle: 'Industry Recognition' },
  { type: 'contact', title: 'Atelier Inquiries', subtitle: 'Commission & Consultation' },
];

export const SectionManager: React.FC<SectionManagerProps> = ({ sections, onChange }) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Update order indices
    const updated = copy.map((sec, i) => ({ ...sec, order: i }));
    onChange(updated);
  };

  const toggleVisibility = (id: string) => {
    const updated = sections.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
    onChange(updated);
  };

  const updateTitle = (id: string, title: string) => {
    const updated = sections.map((sec) => (sec.id === id ? { ...sec, title } : sec));
    onChange(updated);
  };

  const removeSection = (id: string) => {
    const updated = sections.filter((sec) => sec.id !== id).map((sec, i) => ({ ...sec, order: i }));
    onChange(updated);
  };

  const addSection = (typeDef: (typeof AVAILABLE_SECTION_TYPES)[0]) => {
    const newSection: PortfolioSection = {
      id: `${typeDef.type}-${Date.now()}`,
      type: typeDef.type,
      title: typeDef.title,
      subtitle: typeDef.subtitle,
      enabled: true,
      order: sections.length,
    };
    onChange([...sections, newSection]);
  };

  const existingTypes = new Set(sections.map((s) => s.type));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-[#1A1A1A]">Section Architecture</h3>
          <p className="text-xs text-[#78716A]">Customize the narrative order and visibility of your runway sections.</p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              sec.enabled ? 'bg-white border-[#E7E2D6]' : 'bg-[#F5F2EB]/50 border-dashed border-[#DCD7CD] opacity-60'
            }`}
          >
            <div className="text-[#A3998F]">
              <GripVertical className="w-4 h-4 cursor-grab" />
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={sec.title}
                onChange={(e) => updateTitle(sec.id, e.target.value)}
                className="w-full text-xs font-semibold bg-transparent border-0 p-0 focus:ring-0 text-[#1A1A1A]"
              />
              <span className="text-[10px] font-mono tracking-wider text-[#8C827A] uppercase block">
                {sec.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => moveSection(idx, 'up')}
                disabled={idx === 0}
                className="p-1 hover:bg-[#F2EFE9] disabled:opacity-30 rounded text-[#4A453E]"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSection(idx, 'down')}
                disabled={idx === sections.length - 1}
                className="p-1 hover:bg-[#F2EFE9] disabled:opacity-30 rounded text-[#4A453E]"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleVisibility(sec.id)}
                className="p-1 hover:bg-[#F2EFE9] rounded text-[#4A453E]"
                title={sec.enabled ? 'Hide section' : 'Show section'}
              >
                {sec.enabled ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-[#A3998F]" />}
              </button>
              {sec.type !== 'hero' && (
                <button
                  type="button"
                  onClick={() => removeSection(sec.id)}
                  className="p-1 hover:bg-red-50 rounded text-red-600"
                  title="Remove section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Available Sections Drawer */}
      <div className="pt-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716A] mb-2">
          Add Specialized Fashion Sections
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SECTION_TYPES.filter((s) => !existingTypes.has(s.type)).map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => addSection(item)}
              className="px-2.5 py-1.5 border border-[#DCD7CD] bg-white hover:border-[#1A1A1A] rounded text-xs flex items-center gap-1.5 transition-colors text-[#4A453E]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
