import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserPortfolios } from '../../services/portfolioService';
import { fetchUserProjects } from '../../services/projectService';
import { Portfolio, Project } from '../../types/database';
import { FashionImage } from '../../components/common/FashionImage';
import { SAMPLE_PORTFOLIOS } from '../../data/samplePortfolios';
import {
  FolderGit2,
  Scissors,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    Promise.all([fetchUserPortfolios(user.id), fetchUserProjects(user.id)]).then(
      ([portsRes, projsRes]) => {
        setPortfolios(portsRes.data);
        setProjects(projsRes.data);
        setLoading(false);
      }
    );
  }, [user?.id]);

  const publishedCount = portfolios.filter((p) => p.publication_status === 'published').length;
  const draftCount = portfolios.filter((p) => p.publication_status === 'draft').length;

  // Calculate profile completion score
  const calculateProfileCompletion = () => {
    let score = 20; // registered
    if (profile?.display_name) score += 15;
    if (profile?.bio) score += 15;
    if (profile?.institution) score += 15;
    if (profile?.specialties && profile.specialties.length > 0) score += 15;
    if (profile?.skills && profile.skills.length > 0) score += 10;
    if (profile?.social_links?.email || profile?.website_url) score += 10;
    return Math.min(score, 100);
  };

  const completionPct = calculateProfileCompletion();

  return (
    <div className="space-y-10">
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D6]">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
            Atelier Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141210]">
            Welcome back, {profile?.display_name || 'Designer'}
          </h1>
          <p className="text-xs text-[#57524A] mt-1">
            Manage your fashion runway portfolios, pattern specifications, and media library.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/portfolios/new"
            className="px-4 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Portfolio</span>
          </Link>
          <Link
            to="/dashboard/projects/new"
            className="px-4 py-2.5 border border-[#DCD7CD] bg-white text-[#141210] hover:border-[#141210] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Calculated from Supabase */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <span className="text-xs font-mono text-[#78716A] uppercase">Total Portfolios</span>
          <p className="text-3xl font-serif font-bold text-[#141210]">{portfolios.length}</p>
          <span className="text-[11px] text-[#78716A] block">
            {publishedCount} Published · {draftCount} Drafts
          </span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <span className="text-xs font-mono text-[#78716A] uppercase">Design Projects</span>
          <p className="text-3xl font-serif font-bold text-[#141210]">{projects.length}</p>
          <span className="text-[11px] text-[#78716A] block">Active collections &amp; flats</span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <span className="text-xs font-mono text-[#78716A] uppercase">Profile Readiness</span>
          <p className="text-3xl font-serif font-bold text-[#141210]">{completionPct}%</p>
          <span className="text-[11px] text-[#78716A] block">
            {completionPct === 100 ? 'Fully Completed' : 'Profile in Progress'}
          </span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <span className="text-xs font-mono text-[#78716A] uppercase">Account Status</span>
          <p className="text-xl font-serif font-bold text-emerald-700 capitalize mt-2">
            {profile?.account_status || 'Active'}
          </p>
          <span className="text-[11px] font-mono text-[#78716A] block uppercase">
            {profile?.role === 'admin' ? 'Administrator' : profile?.user_type || 'Student'}
          </span>
        </div>
      </div>

      {/* Portfolios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#141210]">Your Runway Portfolios</h2>
          <Link
            to="/dashboard/portfolios"
            className="text-xs font-semibold text-[#141210] hover:underline flex items-center gap-1 font-mono uppercase"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 border border-[#E7E2D6] rounded-xl bg-white text-center text-xs text-[#78716A]">
            Loading your portfolios...
          </div>
        ) : portfolios.length === 0 ? (
          <div className="p-10 border border-dashed border-[#DCD7CD] rounded-2xl bg-white text-center space-y-3">
            <FolderGit2 className="w-8 h-8 text-[#A3998F] mx-auto" />
            <h3 className="font-serif text-lg font-semibold text-[#141210]">No Portfolios Created Yet</h3>
            <p className="text-xs text-[#57524A] max-w-sm mx-auto">
              Create your first fashion portfolio to select a theme, arrange sections, and publish your work.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard/portfolios/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141210] text-white text-xs font-semibold rounded-lg hover:bg-[#2A2723]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Portfolio</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolios.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="border border-[#E7E2D6] rounded-xl overflow-hidden bg-white hover:border-[#141210] transition-colors flex flex-col justify-between"
              >
                <div>
                  <FashionImage
                    src={item.cover_image_path}
                    alt={item.title}
                    aspectRatio="16:9"
                    category={item.specialization || 'Collection'}
                    title={item.title}
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] uppercase text-[#78716A]">
                        {item.theme.replace('-', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          item.publication_status === 'published'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {item.publication_status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#141210] truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#78716A] truncate">
                      /{item.slug}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between text-xs">
                  <Link
                    to={`/dashboard/portfolios/${item.id}/edit`}
                    className="font-semibold text-[#141210] hover:underline"
                  >
                    Edit Sections
                  </Link>
                  <Link
                    to={`/portfolio/${item.slug}`}
                    className="text-[#78716A] hover:text-[#141210] flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#141210]">Recent Design Projects</h2>
          <Link
            to="/dashboard/projects"
            className="text-xs font-semibold text-[#141210] hover:underline flex items-center gap-1 font-mono uppercase"
          >
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 border border-[#E7E2D6] rounded-xl bg-white text-center space-y-2">
            <p className="text-xs text-[#57524A]">No projects uploaded yet.</p>
            <Link
              to="/dashboard/projects/new"
              className="text-xs font-semibold text-[#141210] underline"
            >
              Add your first collection or flat sketch &rarr;
            </Link>
          </div>
        ) : (
          <div className="border border-[#E7E2D6] rounded-xl overflow-hidden bg-white divide-y divide-[#F0ECE1]">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E7E2D6] shrink-0">
                    <FashionImage
                      src={proj.cover_image_path}
                      alt={proj.title}
                      aspectRatio="1:1"
                      title={proj.title}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-sm text-[#141210] truncate">
                      {proj.title}
                    </h4>
                    <p className="text-[11px] text-[#78716A] truncate">
                      {proj.category?.name || 'Garment Construction'} · {proj.tags?.join(', ') || 'Couture'}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/dashboard/projects/${proj.id}/edit`}
                  className="px-3 py-1.5 border border-[#DCD7CD] hover:border-[#141210] rounded text-xs font-semibold text-[#141210] transition-colors shrink-0"
                >
                  Edit Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Curated Runway References Section */}
      <div className="space-y-4 pt-4 border-t border-[#E7E2D6]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#141210]">Curated Runway References &amp; Layouts</h2>
            <p className="text-xs text-[#78716A]">Explore architectural themes and collection structures for inspiration.</p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#141210] hover:underline flex items-center gap-1 font-mono uppercase"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_PORTFOLIOS.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              className="border border-[#E7E2D6] rounded-xl overflow-hidden bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <FashionImage
                  src={sample.cover_image_path}
                  alt={sample.title}
                  aspectRatio="16:9"
                  category={sample.specialization || 'Fashion'}
                  title={sample.title}
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
                    <span>{sample.specialization}</span>
                    <span className="uppercase text-[10px]">{sample.theme.replace('-', ' ')}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#141210] truncate">{sample.title}</h3>
                  <p className="text-xs text-[#57524A] line-clamp-2">{sample.introduction}</p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between text-xs">
                <span className="font-medium text-[#141210]">{sample.owner?.display_name}</span>
                <Link
                  to={`/portfolio/${sample.slug}`}
                  target="_blank"
                  className="font-semibold text-[#141210] hover:underline flex items-center gap-1"
                >
                  <span>Inspect Runway</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
