export type UserRole = 'user' | 'admin';
export type UserType = 'student' | 'graduate' | 'professional';
export type AccountStatus = 'active' | 'suspended';

export type PortfolioVisibility = 'public' | 'unlisted' | 'private';
export type PublicationStatus = 'draft' | 'published';
export type ModerationStatus = 'approved' | 'pending' | 'rejected';

export interface Profile {
  id: string;
  display_name: string;
  username: string | null;
  avatar_path: string | null;
  professional_title: string | null;
  bio: string | null;
  user_type: UserType;
  institution: string | null;
  graduation_year: number | null;
  specialties: string[];
  skills: string[];
  location: string | null;
  website_url: string | null;
  social_links: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    pinterest?: string;
    vogue_runway?: string;
    email?: string;
  };
  onboarding_completed: boolean;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface PortfolioThemeConfig {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  typographyPreset: 'editorial-serif' | 'modern-sans' | 'monograph' | 'haute-couture';
  gridDensity: 'spacious' | 'comfortable' | 'compact';
  imageAspectRatio: '3:4' | '1:1' | '16:9' | 'natural';
  heroLayout: 'split-screen' | 'centered-editorial' | 'magazine-cover' | 'minimalist';
  showContactBar: boolean;
  showBioSection: boolean;
  showSocialLinks: boolean;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'featured_projects'
  | 'illustrations'
  | 'mood_boards'
  | 'textiles'
  | 'garment_construction'
  | 'technical_flats'
  | 'photography'
  | 'process'
  | 'education'
  | 'skills'
  | 'awards'
  | 'contact';

export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  content?: Record<string, any>;
}

export interface Portfolio {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  introduction: string | null;
  cover_image_path: string | null;
  specialization: string | null;
  theme: 'minimal-editorial' | 'luxury-fashion' | 'creative-studio' | 'modern-grid' | 'lookbook' | 'art-portfolio';
  theme_config: PortfolioThemeConfig;
  section_config: PortfolioSection[];
  visibility: PortfolioVisibility;
  publication_status: PublicationStatus;
  moderation_status: ModerationStatus;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields for exploration & public viewing
  owner?: Partial<Profile>;
  projects?: Project[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  owner_id: string;
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  tags: string[];
  cover_image_path: string | null;
  project_date: string | null;
  tools: string[];
  inspiration: string | null;
  creative_process: string | null;
  outcome: string | null;
  credits: {
    photographer?: string;
    model?: string;
    stylist?: string;
    textile_mill?: string;
    collaborators?: string;
  };
  publication_status: PublicationStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  images?: ProjectImage[];
}

export interface PortfolioProject {
  portfolio_id: string;
  project_id: string;
  display_order: number;
  featured: boolean;
  created_at: string;
  project?: Project;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'portfolio' | 'project' | 'profile';
  target_id: string;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  reporter?: Partial<Profile>;
}

export interface AdminAuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor?: Partial<Profile>;
}

export interface PortfolioView {
  id: string;
  portfolio_id: string;
  view_date: string;
  referrer_domain: string | null;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: any;
  description: string;
  updated_at: string;
  updated_by?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}
