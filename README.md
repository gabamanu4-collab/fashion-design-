# FD Design Portfolio Builder
**Digital Atelier & Runway Portfolio Platform for Fashion Designers**

FD Design Portfolio Builder is a full-stack web application designed specifically for Fashion Design (FD) students, graduates, independent designers, and haute couture professionals to construct, customize, curate, and publish editorial-grade digital portfolios without writing code.

---

## 1. Architectural Highlights

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router, Lucide React, editorial luxury typography (`Playfair Display`, `Plus Jakarta Sans`, `Cinzel`).
- **Backend & Auth**: Supabase Auth (email/password, sessions, email verification).
- **Database**: PostgreSQL with strict Row Level Security (RLS) on all user tables.
- **Storage**: Supabase Storage (`portfolio-media` bucket) with user-namespaced paths (`{user_id}/{context_id}/{file_name}`) and file size/format validation.
- **Privileged Operations**: Supabase Edge Functions (`supabase/functions/admin-action`) for server-side role changes, account suspension, moderation, and secure account deletion.
- **Zero-Broken-Image Policy**: Haute couture vector fallbacks ensuring no broken media frames appear anywhere in the UI.

---

## 2. PostgreSQL Schema & Database Tables

The complete SQL migration script is located at:
`supabase/migrations/20261013000000_fd_portfolio_schema.sql`

| Table Name | Description | Key Fields & Security |
| :--- | :--- | :--- |
| `profiles` | Designer profile and credentials | References `auth.users(id)`. Protected trigger disallows non-admins from changing `role` or `account_status`. |
| `portfolios` | Multi-portfolio collections | `owner_id`, `slug` (UNIQUE), `theme`, `theme_config`, `section_config`, `visibility`, `publication_status`. |
| `projects` | Garments and design collections | `owner_id`, `title`, `slug`, `category_id`, `tags`, `tools`, `cover_image_path`, `inspiration`, `creative_process`. |
| `portfolio_projects` | Junction table for portfolios and projects | Composite primary key `(portfolio_id, project_id)`, display ordering. |
| `project_images` | Supplementary flats and gallery plates | `project_id`, `storage_path`, `alt_text`, `caption`, `display_order`. |
| `categories` | Fashion taxonomy categories | Pre-seeded with Haute Couture, Ready-to-Wear, Avant-Garde, Sustainable, Knitwear, Tailoring. |
| `reports` | Community abuse and copyright reports | Target type, reporter ID, status (`pending`, `reviewed`, `actioned`). |
| `admin_audit_logs` | Tamper-evident admin audit records | `actor_id`, `action`, `target_type`, `target_id`, `reason`, `metadata`. Insertable only by admins or trusted server functions. |
| `portfolio_views` | Privacy-conscious portfolio analytics | Records anonymized hit date and referrer domain. |
| `platform_settings` | Global administrative configurations | Key-value store for upload limits, registration toggles, and brand settings. |
| `contact_submissions` | Inquiry submissions from `/contact` | Name, email, subject, message, status. |

---

## 3. Row Level Security (RLS) Policies

Row Level Security is enabled on **every** table:

- **Profiles**: Public can read active profiles; users can update only their own profile; admins have full access.
- **Portfolios**: Public can view only published, public, approved portfolios; owners have full CRUD on their own portfolios.
- **Projects**: Public can view published projects; owners manage their own projects.
- **Project Images**: Readable if parent project is readable; owners manage their own images.
- **Storage (`portfolio-media`)**: Authenticated users can only upload, update, and delete files inside their own `{auth.uid()}/*` prefix.

---

## 4. Setup & Deployment Instructions

### Step 1: Configure Environment Variables

Create `.env` in the root directory:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-Side / Edge Functions only (never prefix with VITE_)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Step 2: Execute PostgreSQL Migration

1. Go to your **Supabase Project Dashboard** > **SQL Editor**.
2. Open `supabase/migrations/20261013000000_fd_portfolio_schema.sql`.
3. Paste the contents into the SQL Editor and click **Run**.
4. The tables, RLS policies, trigger functions, seed categories, and storage bucket `portfolio-media` will be provisioned.

### Step 3: Provision Platform Administrator

Register an account via `/register`. Then in the Supabase SQL Editor, promote your user to administrator:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@domain.com');
```

---

## 5. 6 Distinct Portfolio Themes

1. **Minimal Editorial**: Pristine whitespace, large serif titles, minimalist captions, single-column focus.
2. **Luxury Fashion**: Deep dark taupe & charcoal palette with cinematic high-contrast spreads.
3. **Creative Studio**: Asymmetrical editorial blocks with sharp structural borders and bold type.
4. **Modern Grid**: Clean architectural 3-column layout with balanced spacing and clarity.
5. **Lookbook**: High-fashion runway progression with vertical monograph plates.
6. **Art Portfolio**: Archival tactile frames, warm paper tone, and atelier craft notes.

---

## 6. Route Map

- **Public**: `/`, `/features`, `/how-it-works`, `/explore`, `/portfolio/:slug`, `/about`, `/contact`, `/privacy`, `/terms`
- **Auth**: `/register`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`
- **User Dashboard**: `/dashboard`, `/dashboard/onboarding`, `/dashboard/portfolios`, `/dashboard/portfolios/new`, `/dashboard/portfolios/:id/edit`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/:id/edit`, `/dashboard/media`, `/dashboard/profile`, `/dashboard/settings`
- **Administrator**: `/admin`, `/admin/users`, `/admin/portfolios`, `/admin/reports`, `/admin/categories`, `/admin/audit-logs`, `/admin/settings`, `/admin/sql-setup`
