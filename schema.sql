-- ============================================================================
-- MULTI-WEBSITE ECOSYSTEM DATABASE SCHEMA
-- Initial schema for fresh database setup
-- ============================================================================

-- Enable useful extensions (many are already enabled in Supabase)
create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
-- Drop types if they exist (for re-running schema)

drop type if exists contact_status cascade;
drop type if exists site_type cascade;

create type site_type as enum ('company', 'ngo');
create type contact_status as enum ('new', 'seen', 'replied', 'archived');

-- ---------- GENERIC UPDATED_AT TRIGGER FUNCTION ----------

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------- HERO / BANNER SECTIONS (Home top section) ----------

create table public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  subtitle text,
  primary_cta_label text,
  primary_cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  background_image_path text,
  overlay_opacity numeric(3,2) default 0.4,
  order_index int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hero_sections_site_idx on public.hero_sections(site);
create index if not exists hero_sections_active_idx on public.hero_sections(is_active);

create trigger hero_sections_updated_at
before update on public.hero_sections
for each row execute procedure handle_updated_at();

-- ---------- ABOUT SECTIONS ----------

create table public.about_sections (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  subtitle text,
  body text,
  image_path text,
  stats jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists about_sections_site_idx on public.about_sections(site);

create trigger about_sections_updated_at
before update on public.about_sections
for each row execute procedure handle_updated_at();

-- ---------- SERVICES / WHAT WE DO ----------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  short_description text,
  long_description text,
  icon text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_site_idx on public.services(site);
create index if not exists services_order_idx on public.services(order_index);

create trigger services_updated_at
before update on public.services
for each row execute procedure handle_updated_at();

-- ---------- PROJECTS / WORK DONE (for both company & NGO) ----------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  slug text not null,
  short_description text,
  long_description text,
  category text,
  start_date date,
  end_date date,
  is_ongoing boolean default false,
  highlight boolean default false,
  cover_image_path text,
  gallery_image_paths text[],
  external_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_site_unique unique (site, slug)
);

create index if not exists projects_site_idx on public.projects(site);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists projects_category_idx on public.projects(category);
create index if not exists projects_highlight_idx on public.projects(highlight);

create trigger projects_updated_at
before update on public.projects
for each row execute procedure handle_updated_at();

-- ---------- TIMELINE / WORK EXPERIENCE / MILESTONES ----------

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  subtitle text,
  location text,
  description text,
  start_date date,
  end_date date,
  is_current boolean default false,
  type text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timeline_items_site_idx on public.timeline_items(site);
create index if not exists timeline_items_order_idx on public.timeline_items(order_index);

create trigger timeline_items_updated_at
before update on public.timeline_items
for each row execute procedure handle_updated_at();

-- ---------- TEAM MEMBERS ----------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  name text not null,
  role text not null,
  bio text,
  avatar_image_path text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_site_idx on public.team_members(site);
create index if not exists team_members_order_idx on public.team_members(order_index);

create trigger team_members_updated_at
before update on public.team_members
for each row execute procedure handle_updated_at();

-- ---------- TESTIMONIALS ----------

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  name text not null,
  role text,
  organization text,
  quote text not null,
  avatar_image_path text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_site_idx on public.testimonials(site);
create index if not exists testimonials_order_idx on public.testimonials(order_index);

create trigger testimonials_updated_at
before update on public.testimonials
for each row execute procedure handle_updated_at();

-- ---------- IMPACT STATS (mainly NGO but also usable by company) ----------

create table public.impact_stats (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  label text not null,
  value numeric,
  suffix text,
  description text,
  icon text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists impact_stats_site_idx on public.impact_stats(site);
create index if not exists impact_stats_order_idx on public.impact_stats(order_index);

create trigger impact_stats_updated_at
before update on public.impact_stats
for each row execute procedure handle_updated_at();

-- ---------- GALLERY IMAGES (esp. NGO) ----------

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text,
  description text,
  image_path text not null,
  taken_at date,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_site_idx on public.gallery_images(site);
create index if not exists gallery_images_order_idx on public.gallery_images(order_index);

create trigger gallery_images_updated_at
before update on public.gallery_images
for each row execute procedure handle_updated_at();

-- ---------- CONTACT INFO (for displaying on websites) ----------

create table public.contact_info (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  email text,
  phone text,
  address text,
  map_embed_url text,
  socials jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_info_site_idx on public.contact_info(site);

create trigger contact_info_updated_at
before update on public.contact_info
for each row execute procedure handle_updated_at();

-- ---------- CONTACT MESSAGES (from forms) ----------

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status contact_status not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_site_idx on public.contact_messages(site);
create index if not exists contact_messages_status_idx on public.contact_messages(status);
create index if not exists contact_messages_created_idx on public.contact_messages(created_at);

-- ---------- CAMPAIGNS (NGO specific) ----------

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  site site_type not null default 'ngo',
  title text not null,
  slug text not null,
  short_description text,
  long_description text,
  goal_amount numeric,
  raised_amount numeric default 0,
  banner_image_path text,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_slug_site_unique unique (site, slug)
);

create index if not exists campaigns_site_idx on public.campaigns(site);
create index if not exists campaigns_slug_idx on public.campaigns(slug);
create index if not exists campaigns_active_idx on public.campaigns(is_active);

create trigger campaigns_updated_at
before update on public.campaigns
for each row execute procedure handle_updated_at();

-- ---------- BLOG POSTS ----------

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  featured_image_path text,
  author_name text,
  category text,
  tags text[],
  is_published boolean default false,
  published_at timestamptz,
  views_count int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_site_unique unique (site, slug)
);

create index if not exists blog_posts_site_idx on public.blog_posts(site);
create index if not exists blog_posts_slug_idx on public.blog_posts(slug);
create index if not exists blog_posts_published_idx on public.blog_posts(is_published, published_at);
create index if not exists blog_posts_category_idx on public.blog_posts(category);

create trigger blog_posts_updated_at
before update on public.blog_posts
for each row execute procedure handle_updated_at();

-- ---------- BLOG CATEGORIES ----------

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  name text not null,
  slug text not null,
  description text,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_categories_slug_site_unique unique (site, slug)
);

create index if not exists blog_categories_site_idx on public.blog_categories(site);
create index if not exists blog_categories_slug_idx on public.blog_categories(slug);

create trigger blog_categories_updated_at
before update on public.blog_categories
for each row execute procedure handle_updated_at();

-- ---------- EVENTS (NGO & Company) ----------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  title text not null,
  slug text not null,
  description text,
  short_description text,
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  location_url text,
  cover_image_path text,
  registration_url text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_slug_site_unique unique (site, slug)
);

create index if not exists events_site_idx on public.events(site);
create index if not exists events_slug_idx on public.events(slug);
create index if not exists events_dates_idx on public.events(start_date, end_date);
create index if not exists events_active_idx on public.events(is_active);
create index if not exists events_featured_idx on public.events(is_featured);

create trigger events_updated_at
before update on public.events
for each row execute procedure handle_updated_at();

-- ---------- VOLUNTEERS (NGO specific) ----------

create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  site site_type not null default 'ngo',
  name text not null,
  email text not null,
  phone text,
  skills text[],
  availability text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists volunteers_site_idx on public.volunteers(site);
create index if not exists volunteers_status_idx on public.volunteers(status);
create index if not exists volunteers_email_idx on public.volunteers(email);

create trigger volunteers_updated_at
before update on public.volunteers
for each row execute procedure handle_updated_at();

-- ---------- CAREERS / JOB POSTINGS (Company specific) ----------

create table public.careers (
  id uuid primary key default gen_random_uuid(),
  site site_type not null default 'company',
  title text not null,
  slug text not null,
  department text,
  location text,
  employment_type text,
  description text not null,
  requirements text[],
  benefits text[],
  salary_range text,
  is_active boolean default true,
  application_deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint careers_slug_site_unique unique (site, slug)
);

create index if not exists careers_site_idx on public.careers(site);
create index if not exists careers_slug_idx on public.careers(slug);
create index if not exists careers_active_idx on public.careers(is_active);
create index if not exists careers_department_idx on public.careers(department);

create trigger careers_updated_at
before update on public.careers
for each row execute procedure handle_updated_at();

-- ---------- JOB APPLICATIONS ----------

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  career_id uuid references public.careers(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  resume_path text,
  cover_letter text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'interview', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_applications_career_idx on public.job_applications(career_id);
create index if not exists job_applications_status_idx on public.job_applications(status);
create index if not exists job_applications_email_idx on public.job_applications(email);
create index if not exists job_applications_created_idx on public.job_applications(created_at);

create trigger job_applications_updated_at
before update on public.job_applications
for each row execute procedure handle_updated_at();

-- ---------- WEBSITE SETTINGS / CONFIGURATION ----------

create table public.website_settings (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  setting_key text not null,
  setting_value jsonb not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_settings_key_site_unique unique (site, setting_key)
);

create index if not exists website_settings_site_idx on public.website_settings(site);
create index if not exists website_settings_key_idx on public.website_settings(setting_key);

create trigger website_settings_updated_at
before update on public.website_settings
for each row execute procedure handle_updated_at();

-- ---------- ANALYTICS / PAGE VIEWS ----------

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  page_path text not null,
  page_type text,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_site_idx on public.page_views(site);
create index if not exists page_views_created_idx on public.page_views(created_at);
create index if not exists page_views_page_type_idx on public.page_views(page_type);
create index if not exists page_views_page_path_idx on public.page_views(page_path);

-- ---------- ANALYTICS / FORM SUBMISSIONS TRACKING ----------

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  form_type text not null,
  form_data jsonb not null,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_site_idx on public.form_submissions(site);
create index if not exists form_submissions_type_idx on public.form_submissions(form_type);
create index if not exists form_submissions_created_idx on public.form_submissions(created_at);

-- ---------- NEWSLETTER SUBSCRIPTIONS ----------

create table public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  site site_type not null,
  email text not null,
  name text,
  is_active boolean default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint newsletter_subscriptions_email_site_unique unique (site, email)
);

create index if not exists newsletter_subscriptions_site_idx on public.newsletter_subscriptions(site);
create index if not exists newsletter_subscriptions_active_idx on public.newsletter_subscriptions(is_active);
create index if not exists newsletter_subscriptions_email_idx on public.newsletter_subscriptions(email);

-- ============================================================================
-- SCHEMA COMPLETE
-- Note: Storage bucket 'public-assets' must be created separately via:
-- 1. Supabase Dashboard > Storage > Create bucket
-- 2. Or run: npm run setup:storage (in admin-panel directory)
-- ============================================================================
