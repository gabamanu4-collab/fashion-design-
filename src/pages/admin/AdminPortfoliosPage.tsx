import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchPortfoliosAdmin,
  moderatePortfolio,
  toggleFeaturePortfolio,
} from '../../services/adminService';
import { Portfolio } from '../../types/database';
import { Eye, Star, CheckCircle, XCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AdminPortfoliosPage: React.FC = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadPortfolios = () => {
    setLoading(true);
    fetchPortfoliosAdmin().then((data) => {
      setPortfolios(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handleModerate = async (port: Portfolio, newStatus: 'approved' | 'rejected') => {
    if (!user?.id) return;
    setActionLoading(true);
    const { success, error } = await moderatePortfolio(
      user.id,
      port.id,
      newStatus,
      `Portfolio moderation status set to ${newStatus}`
    );
    setActionLoading(false);

    if (success) {
      setNotification(`Moderation updated to ${newStatus} for "${port.title}"`);
      loadPortfolios();
      setTimeout(() => setNotification(null), 3000);
    } else if (error) {
      alert(error.message);
    }
  };

  const handleToggleFeature = async (port: Portfolio) => {
    if (!user?.id) return;
    setActionLoading(true);
    const nextFeatured = !port.featured;
    const { success, error } = await toggleFeaturePortfolio(user.id, port.id, nextFeatured);
    setActionLoading(false);

    if (success) {
      setNotification(
        nextFeatured
          ? `Featured "${port.title}" on editorial showcase`
          : `Removed "${port.title}" from featured showcase`
      );
      loadPortfolios();
      setTimeout(() => setNotification(null), 3000);
    } else if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#141210]">Portfolio Content Moderation</h1>
        <p className="text-xs text-[#57524A] mt-0.5">
          Approve or reject fashion collections, feature standout portfolios, and enforce publishing standards.
        </p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">Loading platform portfolios...</div>
        ) : portfolios.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78716A]">No portfolios found on platform.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E2D6] text-[#78716A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Portfolio Title</th>
                  <th className="py-3 px-4">Designer</th>
                  <th className="py-3 px-4">Publication</th>
                  <th className="py-3 px-4">Moderation</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {portfolios.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-[#141210]">{p.title}</p>
                        <p className="text-[11px] font-mono text-[#78716A]">/{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#57524A]">{p.owner?.display_name || 'Designer'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                          p.publication_status === 'published'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {p.publication_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                          p.moderation_status === 'approved'
                            ? 'bg-blue-50 text-blue-800'
                            : p.moderation_status === 'rejected'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {p.moderation_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeature(p)}
                        disabled={actionLoading}
                        className={`p-1 rounded transition-colors ${
                          p.featured ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-300 hover:text-neutral-500'
                        }`}
                        title={p.featured ? 'Unfeature' : 'Feature on Showcase'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/portfolio/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#DCD7CD] hover:border-[#141210] rounded text-[11px] font-medium"
                      >
                        <span>Preview</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>

                      {p.moderation_status !== 'approved' && (
                        <button
                          onClick={() => handleModerate(p, 'approved')}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded text-[11px] font-medium"
                        >
                          Approve
                        </button>
                      )}

                      {p.moderation_status !== 'rejected' && (
                        <button
                          onClick={() => handleModerate(p, 'rejected')}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[11px] font-medium"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
