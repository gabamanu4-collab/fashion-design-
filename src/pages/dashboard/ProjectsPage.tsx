import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserProjects, deleteProject } from '../../services/projectService';
import { Project } from '../../types/database';
import { FashionImage } from '../../components/common/FashionImage';
import { Plus, Edit3, Trash2, Search, Scissors, AlertTriangle } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProjects = () => {
    if (!user?.id) return;
    setLoading(true);
    fetchUserProjects(user.id).then(({ data }) => {
      setProjects(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProjects();
  }, [user?.id]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await deleteProject(deleteTarget.id);
    setActionLoading(false);
    setDeleteTarget(null);
    loadProjects();
  };

  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      (p.short_description && p.short_description.toLowerCase().includes(term)) ||
      (p.category?.name && p.category.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D6]">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
            Atelier Works &amp; Flats
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
            Fashion Design Projects
          </h1>
          <p className="text-xs text-[#57524A] mt-1">
            Manage collections, technical flats, pattern specs, and drape studies linked across your portfolios.
          </p>
        </div>

        <Link
          to="/dashboard/projects/new"
          className="px-4 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Design Project</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#A3998F] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter projects by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#DCD7CD] rounded-lg text-xs text-[#141210] placeholder-[#8C827A] focus:outline-hidden focus:border-[#141210]"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#78716A]">
          Loading your design projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 border border-dashed border-[#DCD7CD] rounded-2xl bg-white text-center space-y-4">
          <Scissors className="w-8 h-8 text-[#A3998F] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#141210]">No Design Projects Found</h3>
          <p className="text-xs text-[#57524A] max-w-md mx-auto">
            Upload your garment photography, pattern specifications, and technical flats to showcase in your portfolio sections.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Project</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="border border-[#E7E2D6] rounded-xl overflow-hidden bg-white hover:border-[#141210] transition-colors flex flex-col justify-between"
            >
              <div>
                <FashionImage
                  src={proj.cover_image_path}
                  alt={proj.title}
                  aspectRatio="4:3"
                  category={proj.category?.name || 'Project'}
                  title={proj.title}
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
                    <span>{proj.category?.name || 'Garment'}</span>
                    {proj.project_date && <span>{new Date(proj.project_date).getFullYear()}</span>}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#141210] truncate">
                    {proj.title}
                  </h3>
                  {proj.short_description && (
                    <p className="text-xs text-[#57524A] line-clamp-2">{proj.short_description}</p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between text-xs">
                <Link
                  to={`/dashboard/projects/${proj.id}/edit`}
                  className="font-semibold text-[#141210] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </Link>
                <button
                  onClick={() => setDeleteTarget(proj)}
                  className="p-1 hover:bg-red-50 text-red-600 rounded"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E2D6] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-xl font-bold text-[#141210]">Delete Design Project?</h3>
            </div>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#141210]">{deleteTarget.title}</strong>? All uploaded gallery images and technical flats for this project will be removed from Supabase Storage.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#F0ECE1]">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-[#DCD7CD] rounded-lg text-xs font-semibold hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
