// ==============================================================================
// FD DESIGN PORTFOLIO BUILDER — COMPLETE SUPABASE POSTGRESQL SCHEMA SCRIPT
// ==============================================================================

export const FULL_SQL_MIGRATION = `-- ==============================================================================
-- FD DESIGN PORTFOLIO BUILDER — COMPLETE SUPABASE POSTGRESQL SCHEMA & RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
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
  email TEXT,
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

-- Ensure email column exists if table was created in an earlier migration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Admin verification function with Super Administrator check
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS $$
DECLARE
  v_role TEXT;
  v_email TEXT;
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Master Admin check by auth email
  SELECT email INTO v_email FROM auth.users WHERE id = user_id;
  IF LOWER(COALESCE(v_email, '')) = 'gabamanu4@gmail.com' THEN
    RETURN TRUE;
  END IF;

  -- Profile role check
  SELECT role INTO v_role FROM public.profiles WHERE id = user_id;
  RETURN (v_role = 'admin');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- Universal trigger to automatically create or sync profile whenever a user signs up or logs in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS $$
DECLARE
  v_is_super BOOLEAN;
  v_name TEXT;
  v_user_type TEXT;
  v_role TEXT;
BEGIN
  v_is_super := LOWER(COALESCE(NEW.email, '')) = 'gabamanu4@gmail.com';
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(COALESCE(NEW.email, 'Designer'), '@', 1)
  );
  v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'student');
  v_role := CASE WHEN v_is_super THEN 'admin' ELSE 'user' END;

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    user_type,
    role,
    account_status,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_user_type,
    v_role,
    'active',
    v_is_super,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    role = CASE WHEN v_is_super THEN 'admin' ELSE public.profiles.role END,
    account_status = COALESCE(public.profiles.account_status, 'active');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_super_admin_assignment ON auth.users;
DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Immediate backfill: Populate profiles for ALL existing auth.users who do not yet have a profile row
INSERT INTO public.profiles (
  id,
  email,
  display_name,
  user_type,
  role,
  account_status,
  onboarding_completed,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'display_name',
    u.raw_user_meta_data->>'name',
    SPLIT_PART(COALESCE(u.email, 'Fashion Designer'), '@', 1)
  ),
  COALESCE(u.raw_user_meta_data->>'user_type', 'student'),
  CASE WHEN LOWER(COALESCE(u.email, '')) = 'gabamanu4@gmail.com' THEN 'admin' ELSE 'user' END,
  'active',
  (LOWER(COALESCE(u.email, '')) = 'gabamanu4@gmail.com'),
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Populate email on any existing profiles that have NULL email
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Immediately elevate gabamanu4@gmail.com if already exists
UPDATE public.profiles
SET role = 'admin', account_status = 'active'
WHERE id IN (SELECT id FROM auth.users WHERE LOWER(email) = 'gabamanu4@gmail.com');

-- Protect privileged profile fields
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
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
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(owner_id, slug);

-- 7. PORTFOLIO_PROJECTS JUNCTION
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (portfolio_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_pf_proj_portfolio ON public.portfolio_projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_pf_proj_project ON public.portfolio_projects(project_id);

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

CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id);

-- 9. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ADMIN_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PORTFOLIO_VIEWS ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  view_date DATE DEFAULT CURRENT_DATE,
  referrer_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pf_views_portfolio_date ON public.portfolio_views(portfolio_id, view_date);

-- 12. PLATFORM_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- 13. CONTACT_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ROW LEVEL SECURITY (RLS)
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

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (account_status = 'active' OR auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins full manage profiles" ON public.profiles;
CREATE POLICY "Admins full manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Portfolios Policies
DROP POLICY IF EXISTS "Public portfolios viewable by everyone" ON public.portfolios;
CREATE POLICY "Public portfolios viewable by everyone"
  ON public.portfolios FOR SELECT
  USING (
    (publication_status = 'published' AND visibility = 'public' AND moderation_status = 'approved')
    OR (auth.uid() = owner_id)
    OR (public.is_admin(auth.uid()))
  );

DROP POLICY IF EXISTS "Users can create own portfolios" ON public.portfolios;
CREATE POLICY "Users can create own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
CREATE POLICY "Users can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;
CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins manage all portfolios" ON public.portfolios;
CREATE POLICY "Admins manage all portfolios"
  ON public.portfolios FOR ALL
  USING (public.is_admin(auth.uid()));

-- Projects Policies
DROP POLICY IF EXISTS "Projects viewable by owner, public portfolios, or admin" ON public.projects;
CREATE POLICY "Projects viewable by owner, public portfolios, or admin"
  ON public.projects FOR SELECT
  USING (
    (publication_status = 'published')
    OR (auth.uid() = owner_id)
    OR (public.is_admin(auth.uid()))
  );

DROP POLICY IF EXISTS "Users can create own projects" ON public.projects;
CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins manage all projects" ON public.projects;
CREATE POLICY "Admins manage all projects"
  ON public.projects FOR ALL
  USING (public.is_admin(auth.uid()));

-- Junction & Image Policies
DROP POLICY IF EXISTS "Portfolio projects viewable by all" ON public.portfolio_projects;
CREATE POLICY "Portfolio projects viewable by all"
  ON public.portfolio_projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners manage portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Owners manage portfolio projects"
  ON public.portfolio_projects FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND owner_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Project images viewable by all" ON public.project_images;
CREATE POLICY "Project images viewable by all"
  ON public.project_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners manage project images" ON public.project_images;
CREATE POLICY "Owners manage project images"
  ON public.project_images FOR ALL
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- Categories Policies
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
CREATE POLICY "Categories viewable by everyone"
  ON public.categories FOR SELECT
  USING (enabled = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin(auth.uid()));

-- Analytics & Submissions Policies
DROP POLICY IF EXISTS "Anyone can record portfolio view" ON public.portfolio_views;
CREATE POLICY "Anyone can record portfolio view"
  ON public.portfolio_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners and admins view analytics" ON public.portfolio_views;
CREATE POLICY "Owners and admins view analytics"
  ON public.portfolio_views FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND owner_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Platform settings viewable by everyone" ON public.platform_settings;
CREATE POLICY "Platform settings viewable by everyone"
  ON public.platform_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage platform settings" ON public.platform_settings;
CREATE POLICY "Admins manage platform settings"
  ON public.platform_settings FOR ALL
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can insert contact submission" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submission"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins read and manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Only admins read and manage contact submissions"
  ON public.contact_submissions FOR ALL
  USING (public.is_admin(auth.uid()));

-- 15. STORAGE BUCKET & POLICIES SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view portfolio media" ON storage.objects;
CREATE POLICY "Public can view portfolio media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Authenticated users can upload to own namespace" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own namespace"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 16. INITIAL SEED DATA
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
`;

export const USER_PROFILES_FIX_SQL = `-- ==============================================================================
-- SYNC & AUTO-CREATE USER PROFILES IN SUPABASE
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/dipdxptwolhrlwylawlh/sql/new
-- ==============================================================================

-- 1. Ensure email column exists on public.profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Create or replace trigger to auto-create profile on signup / login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS \$\$
DECLARE
  v_is_super BOOLEAN;
  v_name TEXT;
  v_user_type TEXT;
  v_role TEXT;
BEGIN
  v_is_super := LOWER(COALESCE(NEW.email, '')) = 'gabamanu4@gmail.com';
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(COALESCE(NEW.email, 'Designer'), '@', 1)
  );
  v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'student');
  v_role := CASE WHEN v_is_super THEN 'admin' ELSE 'user' END;

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    user_type,
    role,
    account_status,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_user_type,
    v_role,
    'active',
    v_is_super,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    role = CASE WHEN v_is_super THEN 'admin' ELSE public.profiles.role END,
    account_status = COALESCE(public.profiles.account_status, 'active');

  RETURN NEW;
END;
\$\$;

-- Re-bind trigger on auth.users
DROP TRIGGER IF EXISTS tr_super_admin_assignment ON auth.users;
DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Immediate backfill: Populate profiles for ALL existing auth.users who do not yet have a profile row
INSERT INTO public.profiles (
  id,
  email,
  display_name,
  user_type,
  role,
  account_status,
  onboarding_completed,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'display_name',
    u.raw_user_meta_data->>'name',
    SPLIT_PART(COALESCE(u.email, 'Fashion Designer'), '@', 1)
  ),
  COALESCE(u.raw_user_meta_data->>'user_type', 'student'),
  CASE WHEN LOWER(COALESCE(u.email, '')) = 'gabamanu4@gmail.com' THEN 'admin' ELSE 'user' END,
  'active',
  (LOWER(COALESCE(u.email, '')) = 'gabamanu4@gmail.com'),
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Update email on existing profiles if null
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- 5. Guarantee admin role for gabamanu4@gmail.com
UPDATE public.profiles
SET role = 'admin', account_status = 'active'
WHERE id IN (SELECT id FROM auth.users WHERE LOWER(email) = 'gabamanu4@gmail.com');
`;
