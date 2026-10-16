import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchPortfolioById,
  createPortfolio,
  updatePortfolio,
  checkSlugAvailability,
  defaultThemeConfig,
  defaultSections,
} from '../../services/portfolioService';
import { fetchUserProjects } from '../../services/projectService';
import { Portfolio, PortfolioThemeConfig, PortfolioSection, Project } from '../../types/database';
import { SectionManager } from '../../components/builder/SectionManager';
import { ThemeCustomizer } from '../../components/builder/ThemeCustomizer';
import { ThemeRenderer } from '../../components/portfolio/ThemeRenderer';
import { uploadMediaFile } from '../../lib/supabase';
import {
  Save,
  Eye,
  Smartphone,
  Monitor,
  Globe,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Layers,
  Palette,
  Settings,
  ExternalLink,
} from 'lucide-react';

export const PortfolioEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'theme' | 'seo'>('content');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [specialization, setSpecialization] = useState('Haute Couture');
  const [theme, setTheme] = useState<Portfolio['theme']>('minimal-editorial');
  const [themeConfig, setThemeConfig] = useState<PortfolioThemeConfig>(defaultThemeConfig);
  const [sections, setSections] = useState<PortfolioSection[]>(defaultSections);
  const [visibility, setVisibility] = useState<Portfolio['visibility']>('public');
  const [publicationStatus, setPublicationStatus] = useState<Portfolio['publication_status']>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Save states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const isInitialLoad = useRef(true);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load User Projects
  useEffect(() => {
    if (user?.id) {
      fetchUserProjects(user.id).then(({ data }) => setUserProjects(data));
    }
  }, [user?.id]);

  // Load existing portfolio if editing
  useEffect(() => {
    if (isNew) {
      setTitle('Untitled Capsule Collection');
      const generatedSlug = `collection-${Date.now().toString().slice(-6)}`;
      setSlug(generatedSlug);
      setLoading(false);
      isInitialLoad.current = false;
      return;
    }

    if (id) {
      setLoading(true);
      fetchPortfolioById(id).then(({ data, error }) => {
        if (data) {
          setPortfolio(data);
          setTitle(data.title);
          setSlug(data.slug);
          setSubtitle(data.subtitle || '');
          setIntroduction(data.introduction || '');
          setCoverImagePath(data.cover_image_path);
          setSpecialization(data.specialization || 'Haute Couture');
          setTheme(data.theme);
          setThemeConfig(data.theme_config || defaultThemeConfig);
          setSections(data.section_config || defaultSections);
          setVisibility(data.visibility);
          setPublicationStatus(data.publication_status);
          setSeoTitle(data.seo_title || '');
          setSeoDescription(data.seo_description || '');
        }
        setLoading(false);
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 500);
      });
    }
  }, [id, isNew]);

  // Check Slug Uniqueness
  const handleSlugChange = async (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setSlug(clean);
    setSaveStatus('unsaved');

    const available = await checkSlugAvailability(clean, portfolio?.id);
    if (!available) {
      setSlugError('This runway URL slug is already taken. Please choose another.');
    } else {
      setSlugError(null);
    }
  };

  // Build the live portfolio object for immediate preview
  const livePortfolio: Portfolio = {
    id: portfolio?.id || 'preview-temp-id',
    owner_id: user?.id || 'preview-owner',
    title: title || 'Untitled Collection',
    slug: slug || 'preview',
    subtitle: subtitle || null,
    introduction: introduction || null,
    cover_image_path: coverImagePath,
    specialization,
    theme,
    theme_config: themeConfig,
    section_config: sections,
    visibility,
    publication_status: publicationStatus,
    moderation_status: 'approved',
    featured: false,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    published_at: portfolio?.published_at || null,
    created_at: portfolio?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: profile || undefined,
    projects: userProjects,
  };

  // Perform Save to Supabase PostgreSQL
  const performSave = useCallback(async () => {
    if (!user?.id) return;
    if (slugError) return;

    setSaveStatus('saving');

    if (isNew) {
      const { data, error } = await createPortfolio({
        owner_id: user.id,
        title,
        slug,
        specialization,
        theme,
      });

      if (data) {
        setPortfolio(data);
        setSaveStatus('saved');
        navigate(`/dashboard/portfolios/${data.id}/edit`, { replace: true });
      } else {
        setSaveStatus('unsaved');
      }
    } else if (portfolio?.id) {
      const { data, error } = await updatePortfolio(portfolio.id, {
        title,
        slug,
        subtitle: subtitle || null,
        introduction: introduction || null,
        cover_image_path: coverImagePath,
        specialization,
        theme,
        theme_config: themeConfig,
        section_config: sections,
        visibility,
        publication_status: publicationStatus,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
      });

      if (data) {
        setPortfolio(data);
        setSaveStatus('saved');
      } else {
        setSaveStatus('unsaved');
      }
    }
  }, [
    user?.id,
    isNew,
    portfolio?.id,
    title,
    slug,
    subtitle,
    introduction,
    coverImagePath,
    specialization,
    theme,
    themeConfig,
    sections,
    visibility,
    publicationStatus,
    seoTitle,
    seoDescription,
    slugError,
    navigate,
  ]);

  // Debounced Autosave on edits
  useEffect(() => {
    if (isInitialLoad.current || isNew) return;

    setSaveStatus('unsaved');

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
      performSave();
    }, 1500);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [
    title,
    slug,
    subtitle,
    introduction,
    coverImagePath,
    specialization,
    theme,
    themeConfig,
    sections,
    visibility,
    publicationStatus,
    seoTitle,
    seoDescription,
    performSave,
    isNew,
  ]);

  // Cover Image File Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploadingCover(true);
    const { path, error } = await uploadMediaFile(file, user.id, portfolio?.id || 'covers');
    setUploadingCover(false);

    if (error) {
      alert(error.message);
    } else {
      setCoverImagePath(path);
      setSaveStatus('unsaved');
    }
  };

  const handleTogglePublication = () => {
    const next = publicationStatus === 'published' ? 'draft' : 'published';
    setPublicationStatus(next);
    setSaveStatus('unsaved');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="font-serif italic text-sm text-[#78716A]">Opening Atelier Editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Builder Bar */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs sticky top-2 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/portfolios"
            className="p-1.5 hover:bg-[#FAF9F6] rounded-lg text-[#57524A]"
            title="Back to Portfolios"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg text-[#141210] truncate max-w-[260px] sm:max-w-md">
                {title || 'Untitled Portfolio'}
              </h1>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  publicationStatus === 'published'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-amber-50 text-amber-800'
                }`}
              >
                {publicationStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#78716A]">
              <span>
                {saveStatus === 'saving'
                  ? 'Saving to Supabase...'
                  : saveStatus === 'unsaved'
                  ? 'Unsaved edits'
                  : 'All changes saved to PostgreSQL'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Viewport toggle for live preview */}
          <div className="hidden lg:flex items-center border border-[#DCD7CD] rounded-lg p-0.5 bg-[#FAF9F6]">
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              className={`p-1.5 rounded transition-colors ${
                previewViewport === 'desktop' ? 'bg-white shadow-xs text-[#141210]' : 'text-[#78716A]'
              }`}
              title="Desktop 1440px View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={`p-1.5 rounded transition-colors ${
                previewViewport === 'mobile' ? 'bg-white shadow-xs text-[#141210]' : 'text-[#78716A]'
              }`}
              title="Mobile 375px View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-3 py-1.5 border border-[#DCD7CD] bg-white hover:border-[#141210] rounded-lg text-xs font-semibold text-[#141210] flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleTogglePublication}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              publicationStatus === 'published'
                ? 'border border-[#DCD7CD] bg-white text-[#57524A] hover:bg-[#FAF9F6]'
                : 'bg-emerald-800 text-white hover:bg-emerald-900'
            }`}
          >
            {publicationStatus === 'published' ? 'Unpublish' : 'Publish Runway'}
          </button>

          <button
            type="button"
            onClick={performSave}
            disabled={saveStatus === 'saving'}
            className="px-4 py-1.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Controls on Left, Live Responsive Preview on Right */}
      <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-6`}>
        {/* Editor Controls Pane */}
        <div className={`${showLivePreview ? 'lg:col-span-5' : 'w-full'} space-y-6`}>
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E7E2D6] text-xs font-semibold">
            {[
              { id: 'content', label: '1. Atelier Info' },
              { id: 'sections', label: '2. Sections' },
              { id: 'theme', label: '3. Theme' },
              { id: 'seo', label: '4. Visibility' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#141210] text-[#141210]'
                    : 'border-transparent text-[#78716A] hover:text-[#141210]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: CONTENT & INFO */}
          {activeTab === 'content' && (
            <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-5 shadow-xs">
              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Portfolio Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solfège Capsule Collection"
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">
                  Public URL Slug
                </label>
                <div className="flex items-center bg-[#FAF9F6] border border-[#DCD7CD] rounded-lg overflow-hidden text-xs">
                  <span className="px-3 text-[#78716A] font-mono border-r border-[#DCD7CD] select-none">
                    /portfolio/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="solfege-capsule"
                    className="w-full p-3 bg-transparent text-[#141210] focus:outline-hidden"
                  />
                </div>
                {slugError && <p className="text-[11px] text-red-600 mt-1">{slugError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                >
                  <option value="Haute Couture">Haute Couture</option>
                  <option value="Ready-to-Wear (RTW)">Ready-to-Wear (RTW)</option>
                  <option value="Avant-Garde & Wearable Art">Avant-Garde &amp; Wearable Art</option>
                  <option value="Sustainable & Circular Fashion">Sustainable &amp; Circular Fashion</option>
                  <option value="Knitwear & Textile Design">Knitwear &amp; Textile Design</option>
                  <option value="Tailoring & Outerwear">Tailoring &amp; Outerwear</option>
                  <option value="Costume & Theatrical">Costume &amp; Theatrical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Subtitle / Lineage</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Architectural Suiting & Drape Study"
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">
                  Introduction / Atelier Statement
                </label>
                <textarea
                  rows={4}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Present the concept, research coordinates, and architectural narrative of this collection..."
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-2">
                  Cover Photography / Runway Plate
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 border border-[#DCD7CD] hover:border-[#141210] rounded-lg text-xs font-semibold flex items-center gap-2 bg-[#FAF9F6] text-[#141210] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverUpload}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                  </label>
                  {coverImagePath && (
                    <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Custom Cover Set</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS ARCHITECTURE */}
          {activeTab === 'sections' && (
            <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 shadow-xs">
              <SectionManager sections={sections} onChange={(upd) => setSections(upd)} />
            </div>
          )}

          {/* TAB 3: THEME CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 shadow-xs">
              <ThemeCustomizer
                theme={theme}
                onThemeChange={(th) => setTheme(th)}
                config={themeConfig}
                onConfigChange={(cfg) => setThemeConfig(cfg)}
              />
            </div>
          )}

          {/* TAB 4: VISIBILITY & SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-5 shadow-xs">
              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Runway Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                >
                  <option value="public">Public (Discoverable in Portfolio Explorer)</option>
                  <option value="unlisted">Unlisted (Accessible only via direct URL)</option>
                  <option value="private">Private (Restricted to owner preview)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${title} — Fashion Portfolio`}
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Fashion design portfolio and collection research by..."
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Responsive Preview Pane */}
        {showLivePreview && (
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="border border-[#E7E2D6] rounded-2xl bg-white overflow-hidden shadow-md">
                <div className="bg-[#1C1917] px-4 py-2 flex items-center justify-between text-xs text-[#FAF8F5]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="font-mono text-[11px] text-[#A8A29E] ml-2">
                      Live Atelier Frame · {previewViewport === 'desktop' ? '1440px Desktop' : '375px Mobile'}
                    </span>
                  </div>
                  <Link
                    to={`/portfolio/${slug}`}
                    target="_blank"
                    className="text-[11px] font-mono text-[#D6D3D1] hover:text-white flex items-center gap-1"
                  >
                    <span>Full Window</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Preview Frame Container */}
                <div className="bg-[#FAF9F6] p-2 flex justify-center max-h-[75vh] overflow-y-auto">
                  <div
                    className={`transition-all duration-300 w-full ${
                      previewViewport === 'mobile'
                        ? 'max-w-[375px] border-x border-[#DCD7CD] shadow-lg rounded-xl overflow-hidden'
                        : 'w-full'
                    }`}
                  >
                    <ThemeRenderer portfolio={livePortfolio} previewMode />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
