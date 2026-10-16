import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { isSupabaseConfigured } from '../../lib/config';
import { Category } from '../../types/database';
import { Plus, Tag, Check, X, Edit3, Trash2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const loadCategories = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    await supabase.from('categories').insert({
      name,
      slug,
      description: description || null,
      enabled: true,
    });

    setName('');
    setSlug('');
    setDescription('');
    setShowAddModal(false);
    loadCategories();
  };

  const handleToggleEnabled = async (cat: Category) => {
    await supabase
      .from('categories')
      .update({ enabled: !cat.enabled, updated_at: new Date().toISOString() })
      .eq('id', cat.id);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#141210]">Fashion Category Taxonomy</h1>
          <p className="text-xs text-[#57524A] mt-0.5">
            Configure available fashion design categories for project organization and exploration filters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">Querying categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78716A]">No categories defined in database.</div>
        ) : (
          <div className="divide-y divide-[#F0ECE1]">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#141210]">{c.name}</span>
                    <span className="font-mono text-[11px] text-[#78716A]">/{c.slug}</span>
                  </div>
                  {c.description && <p className="text-[#57524A] text-xs mt-0.5">{c.description}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                      c.enabled ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {c.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => handleToggleEnabled(c)}
                    className="px-2.5 py-1 border border-[#DCD7CD] hover:border-[#141210] rounded text-[11px] font-medium"
                  >
                    {c.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCreate} className="bg-white border border-[#E7E2D6] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#141210]">Add Fashion Category</h3>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Leather Goods & Millinery"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="leather-millinery"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted luxury bags and sculptural headwear..."
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#F0ECE1]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#DCD7CD] rounded-lg text-xs font-semibold hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
