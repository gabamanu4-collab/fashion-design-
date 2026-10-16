import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPortfolioBySlug } from '../../services/portfolioService';
import { Portfolio } from '../../types/database';
import { ThemeRenderer } from '../../components/portfolio/ThemeRenderer';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, AlertCircle, Lock } from 'lucide-react';

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(false);
    fetchPortfolioBySlug(slug).then(({ data, error: fetchErr }) => {
      if (fetchErr || !data) {
        setError('Portfolio not found or unavailable');
        setPortfolio(null);
      } else {
        // Enforce publication policy: if draft/private and not the owner or admin
        const isOwner = user?.id && data.owner_id === user.id;
        const isPublished = data.publication_status === 'published' && data.visibility !== 'private';

        if (!isPublished && !isOwner) {
          setError('This portfolio is currently in private draft mode.');
          setPortfolio(null);
        } else {
          setPortfolio(data);
          setError(null);
        }
      }
      setLoading(false);
    });
  }, [slug, user?.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif italic text-sm text-[#78716A]">Opening Atelier Archive...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#F5F2EB] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#78716A]">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#141210]">Archive Unavailable</h2>
        <p className="text-sm text-[#57524A] max-w-md mx-auto leading-relaxed">
          {error || 'The requested portfolio could not be found or has not yet been published to the runway.'}
        </p>
        <div className="pt-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio Explorer</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnerPreview = user?.id && portfolio.owner_id === user.id && portfolio.publication_status === 'draft';

  return (
    <div>
      {isOwnerPreview && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              <strong>Owner Preview Mode:</strong> This portfolio is currently in Draft status and is only visible to you.
            </span>
            <Link
              to={`/dashboard/portfolios/${portfolio.id}/edit`}
              className="ml-auto underline font-semibold text-amber-950"
            >
              Open Editor &amp; Publish
            </Link>
          </div>
        </div>
      )}

      <ThemeRenderer portfolio={portfolio} previewMode={Boolean(isOwnerPreview)} />
    </div>
  );
};
