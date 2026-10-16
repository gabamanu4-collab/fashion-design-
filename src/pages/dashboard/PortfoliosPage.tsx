import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUserPortfolios,
  deletePortfolio,
  duplicatePortfolio,
  updatePortfolio,
} from '../../services/portfolioService';
import { Portfolio } from '../../types/database';
import { FashionImage } from '../../components/common/FashionImage';
import {
  Plus,
  Edit3,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  Scissors,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const PortfoliosPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPortfolios = () => {
    if (!user?.id) return;
    setLoading(true);
    fetchUserPortfolios(user.id).then(({ data }) => {
      setPortfolios(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPortfolios();
  }, [user?.id]);

  const handleDuplicate = async (port: Portfolio) => {
    if (!user?.id) return;
    const newTitle = `${port.title} (Copy)`;
    const newSlug = `${port.slug}-copy-${Date.now().toString().slice(-4)}`;
    setActionLoading(true);
    const { data } = await duplicatePortfolio(port.id, newTitle, newSlug, user.id);
    setActionLoading(false);
    if (data) {
      loadPortfolios();
    }
  };

  const handleTogglePublish = async (port: Portfolio) => {
    const nextStatus = port.publication_status === 'published' ? 'draft' : 'published';
    setActionLoading(true);
    await updatePortfolio(port.id, {
      publication_status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : port.published_at,
    });
    setActionLoading(false);
    loadPortfolios();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await deletePortfolio(deleteTarget.id);
    setActionLoading(false);
    setDeleteTarget(null);
    loadPortfolios();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D6]">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
            Collections &amp; Portfolios
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
            My Fashion Portfolios
          </h1>
          <p className="text-xs text-[#57524A] mt-1">
            Build independent editorial runways for different capsules, seasons, or jury reviews.
          </p>
        </div>

        <Link
          to="/dashboard/portfolios/new"
          className="px-4 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Portfolio</span>
        </Link>
      </div>

      {/* Portfolios List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#78716A]">
          Loading your atelier collections...
        </div>
      ) : portfolios.length === 0 ? (
        <div className="p-12 border border-dashed border-[#DCD7CD] rounded-2xl bg-white text-center space-y-4">
          <Scissors className="w-8 h-8 text-[#A3998F] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#141210]">
            No Portfolios in Your Atelier
          </h3>
          <p className="text-xs text-[#57524A] max-w-md mx-auto">
            Create a portfolio to organize your garments, pick a theme, and publish your personal runway link.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/portfolios/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Portfolio</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((port) => (
            <div
              key={port.id}
              className="border border-[#E7E2D6] rounded-xl overflow-hidden bg-white hover:border-[#141210] transition-colors flex flex-col justify-between"
            >
              <div>
                <FashionImage
                  src={port.cover_image_path}
                  alt={port.title}
                  aspectRatio="16:9"
                  category={port.specialization || 'Fashion'}
                  title={port.title}
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] uppercase text-[#78716A]">
                      Theme: {port.theme.replace('-', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        port.publication_status === 'published'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {port.publication_status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#141210] truncate">
                      {port.title}
                    </h3>
                    <p className="text-xs font-mono text-[#78716A] truncate">
                      /portfolio/{port.slug}
                    </p>
                  </div>

                  {port.subtitle && (
                    <p className="text-xs text-[#57524A] line-clamp-2">{port.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/dashboard/portfolios/${port.id}/edit`}
                    className="p-1.5 hover:bg-[#E7E2D6] rounded text-[#141210]"
                    title="Edit in Portfolio Builder"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/portfolio/${port.slug}`}
                    className="p-1.5 hover:bg-[#E7E2D6] rounded text-[#141210]"
                    title="View Public / Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(port)}
                    className="p-1.5 hover:bg-[#E7E2D6] rounded text-[#57524A]"
                    title="Duplicate Portfolio"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(port)}
                    className="p-1.5 hover:bg-red-50 rounded text-red-600"
                    title="Delete Portfolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleTogglePublish(port)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    port.publication_status === 'published'
                      ? 'border border-[#DCD7CD] hover:bg-[#F2EFE9] text-[#57524A]'
                      : 'bg-[#141210] text-white hover:bg-[#2A2723]'
                  }`}
                >
                  {port.publication_status === 'published' ? 'Unpublish' : 'Publish'}
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
              <h3 className="font-serif text-xl font-bold text-[#141210]">Delete Portfolio?</h3>
            </div>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#141210]">{deleteTarget.title}</strong>? Its public URL will cease to function. Design projects associated with this portfolio will remain preserved in your workspace.
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
