-- ==============================================================================
-- FD DESIGN PORTFOLIO BUILDER — COMPLETE SUPABASE POSTGRESQL SCHEMA & RLS
-- Migration: 20261013000000_fd_portfolio_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
-- Updated-At timestamp updater
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_path TEXT,
  professional_title TEXT,
  bio TEXT,
  user_type TEXT CHECK (user_type IN ('student', 'graduate', 'professional')) DEFAULT 'student',
  institution TEXT,
  graduation_year INTEGER,
  specialties TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  location TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  account_status TEXT CHECK (account_status IN ('active', 'suspended')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin verification function with SECURITY DEFINER and isolated search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT role INTO v_role FROM public.profiles WHERE id = user_id;
  RETURN (v_role = 'admin');
END;
$$;

-- Revoke default execute and grant to authenticated only
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- Trigger to prevent regular users from elevating role or account_status directly
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If updating own profile and not an admin, disallow modifying role or account_status
  IF auth.uid() = OLD.id AND NOT public.is_admin(auth.uid()) THEN
    NEW.role = OLD.role;
    NEW.account_status = OLD.account_status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_profile_fields ON public.profiles;
CREATE TRIGGER tr_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. PORTFOLIOS TABLE
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  introduction TEXT,
  cover_image_path TEXT,
  specialization TEXT,
  theme TEXT DEFAULT 'minimal-editorial',
  theme_config JSONB DEFAULT '{
    "accentColor": "#1A1A1A",
    "backgroundColor": "#FAF9F6",
    "textColor": "#1A1A1A",
    "typographyPreset": "editorial-serif",
    "gridDensity": "comfortable",
    "imageAspectRatio": "3:4",
    "heroLayout": "split-screen",
    "showContactBar": true,
    "showBioSection": true,
    "showSocialLinks": true
  }'::jsonb,
  section_config JSONB DEFAULT '[
    {"id": "hero-1", "type": "hero", "title": "Introduction", "enabled": true, "order": 0},
    {"id": "about-1", "type": "about", "title": "Designer Statement", "enabled": true, "order": 1},
    {"id": "feat-1", "type": "featured_projects", "title": "Selected Collections", "enabled": true, "order": 2},
    {"id": "contact-1", "type": "contact", "title": "Atelier Contact", "enabled": true, "order": 3}
  ]'::jsonb,
  visibility TEXT CHECK (visibility IN ('public', 'unlisted', 'private')) DEFAULT 'public',
  publication_status TEXT CHECK (publication_status IN ('draft', 'published')) DEFAULT 'draft',
  moderation_status TEXT CHECK (moderation_status IN ('approved', 'pending', 'rejected')) DEFAULT 'approved',
  featured BOOLEAN DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER tr_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_owner ON public.portfolios(owner_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_discovery ON public.portfolios(visibility, publication_status, moderation_status);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image_path TEXT,
  project_date DATE,
  tools TEXT[] DEFAULT '{}',
  inspiration TEXT,
  creative_process TEXT,
  outcome TEXT,
  credits JSONB DEFAULT '{}'::jsonb,
  publication_status TEXT CHECK (publication_status IN ('draft', 'published')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);

-- 7. PORTFOLIO_PROJECTS JUNCTION
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (portfolio_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_ordering ON public.portfolio_projects(portfolio_id, display_order);

-- 8. PROJECT_IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id, display_order);

-- 9. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT CHECK (target_type IN ('portfolio', 'project', 'profile')) NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- 10. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.admin_audit_logs(created_at DESC);

-- 11. PORTFOLIO VIEWS (Privacy-conscious analytics)
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  view_date DATE DEFAULT CURRENT_DATE,
  referrer_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_views_portfolio_date ON public.portfolio_views(portfolio_id, view_date);

-- 12. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 13. CONTACT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUTH USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    user_type,
    role,
    account_status,
    onboarding_completed
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    'user',
    'active',
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (account_status = 'active');

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()));

-- CATEGORIES POLICIES
CREATE POLICY "Enabled categories readable by everyone"
  ON public.categories FOR SELECT
  USING (enabled = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin(auth.uid()));

-- PORTFOLIOS POLICIES
CREATE POLICY "Public portfolios readable by everyone"
  ON public.portfolios FOR SELECT
  USING (
    (publication_status = 'published' AND visibility = 'public' AND moderation_status = 'approved')
    OR (auth.uid() = owner_id)
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Owners can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = owner_id OR public.is_admin(auth.uid()));

CREATE POLICY "Owners and admins can delete portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- PROJECTS POLICIES
CREATE POLICY "Projects readable if public or owner"
  ON public.projects FOR SELECT
  USING (
    (publication_status = 'published')
    OR (auth.uid() = owner_id)
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Owners can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = owner_id OR public.is_admin(auth.uid()));

CREATE POLICY "Owners and admins can delete projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- PORTFOLIO_PROJECTS POLICIES
CREATE POLICY "Portfolio projects readable by everyone"
  ON public.portfolio_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = portfolio_id AND (
        (p.publication_status = 'published' AND p.visibility = 'public' AND p.moderation_status = 'approved')
        OR p.owner_id = auth.uid()
        OR public.is_admin(auth.uid())
      )
    )
  );

CREATE POLICY "Owners can manage portfolio projects"
  ON public.portfolio_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = portfolio_id AND p.owner_id = auth.uid()
    )
  );

-- PROJECT_IMAGES POLICIES
CREATE POLICY "Project images readable if parent project readable"
  ON public.project_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects pr
      WHERE pr.id = project_id AND (
        pr.publication_status = 'published'
        OR pr.owner_id = auth.uid()
        OR public.is_admin(auth.uid())
      )
    )
  );

CREATE POLICY "Owners can manage project images"
  ON public.project_images FOR ALL
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- REPORTS POLICIES
CREATE POLICY "Users can insert reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can view own reports, admins view all"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update reports"
  ON public.reports FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ADMIN AUDIT LOGS POLICIES
CREATE POLICY "Only admins read audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins or server functions insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- PORTFOLIO VIEWS POLICIES
CREATE POLICY "Anyone can record views"
  ON public.portfolio_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can view own analytics"
  ON public.portfolio_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = portfolio_id AND p.owner_id = auth.uid()
    ) OR public.is_admin(auth.uid())
  );

-- PLATFORM SETTINGS POLICIES
CREATE POLICY "Public settings readable by everyone"
  ON public.platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins update settings"
  ON public.platform_settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- CONTACT SUBMISSIONS POLICIES
CREATE POLICY "Anyone can insert contact submission"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins read and manage contact submissions"
  ON public.contact_submissions FOR ALL
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- 16. STORAGE BUCKET & POLICIES SETUP
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies
CREATE POLICY "Public can view portfolio media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can upload to own namespace"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ==============================================================================
-- 17. INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.categories (name, slug, description, enabled)
VALUES
  ('Haute Couture', 'haute-couture', 'Bespoke, high-fashion handmade garments with custom tailoring and embroidery.', true),
  ('Ready-to-Wear (RTW)', 'ready-to-wear', 'Contemporary seasonal collections produced for high-end luxury fashion retail.', true),
  ('Avant-Garde & Wearable Art', 'avant-garde', 'Conceptual fashion, experimental silhouettes, and artistic sculptural garments.', true),
  ('Sustainable & Circular Fashion', 'sustainable', 'Zero-waste cutting, natural botanical dyes, upcycled luxury, and circular design.', true),
  ('Knitwear & Textile Design', 'knitwear-textiles', 'Custom jacquards, engineered knitting, surface embellishments, and woven textiles.', true),
  ('Tailoring & Outerwear', 'tailoring-outerwear', 'Bespoke architectural suiting, coats, and precise structural outerwear.', true),
  ('Footwear & Accessories', 'accessories', 'Luxury leather goods, handcrafted footwear, bags, and sculptural accessories.', true),
  ('Costume & Theatrical', 'costume-theatrical', 'Narrative-driven costume design for cinema, opera, ballet, and stage productions.', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.platform_settings (key, value, description)
VALUES
  ('general', '{"platform_name": "FD Design Portfolio Builder", "tagline": "The Digital Atelier for Fashion Designers", "allow_registration": true}'::jsonb, 'General platform settings'),
  ('uploads', '{"max_file_size_mb": 10, "allowed_formats": ["image/jpeg", "image/png", "image/webp"]}'::jsonb, 'Media upload limits'),
  ('moderation', '{"auto_approve_portfolios": true, "require_email_verification": false}'::jsonb, 'Platform moderation rules')
ON CONFLICT (key) DO NOTHING;
