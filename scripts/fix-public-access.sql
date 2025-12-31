-- Fix RLS policies to allow public read access for website frontends
-- Run this in Supabase SQL Editor

-- ============================================
-- NGO Tables - Public Read Access
-- ============================================

-- Pages
DROP POLICY IF EXISTS "Public can view published ngo pages" ON ngo_pages;
CREATE POLICY "Public can view published ngo pages"
  ON ngo_pages FOR SELECT
  TO public
  USING (status = 'published');

-- Sections
DROP POLICY IF EXISTS "Public can view visible ngo sections" ON ngo_sections;
CREATE POLICY "Public can view visible ngo sections"
  ON ngo_sections FOR SELECT
  TO public
  USING (is_visible = true);

-- Content Blocks
DROP POLICY IF EXISTS "Public can view visible ngo content blocks" ON ngo_content_blocks;
CREATE POLICY "Public can view visible ngo content blocks"
  ON ngo_content_blocks FOR SELECT
  TO public
  USING (is_visible = true);

-- Media
DROP POLICY IF EXISTS "Public can view ngo media" ON ngo_media;
CREATE POLICY "Public can view ngo media"
  ON ngo_media FOR SELECT
  TO public
  USING (true);

-- Blogs
DROP POLICY IF EXISTS "Public can view published ngo blogs" ON ngo_blogs;
CREATE POLICY "Public can view published ngo blogs"
  ON ngo_blogs FOR SELECT
  TO public
  USING (status = 'published');

-- Programs
DROP POLICY IF EXISTS "Public can view published ngo programs" ON ngo_programs;
CREATE POLICY "Public can view published ngo programs"
  ON ngo_programs FOR SELECT
  TO public
  USING (status = 'published');

-- Team
DROP POLICY IF EXISTS "Public can view visible ngo team" ON ngo_team;
CREATE POLICY "Public can view visible ngo team"
  ON ngo_team FOR SELECT
  TO public
  USING (is_visible = true);

-- Testimonials
DROP POLICY IF EXISTS "Public can view visible ngo testimonials" ON ngo_testimonials;
CREATE POLICY "Public can view visible ngo testimonials"
  ON ngo_testimonials FOR SELECT
  TO public
  USING (is_visible = true);

-- Partners
DROP POLICY IF EXISTS "Public can view visible ngo partners" ON ngo_partners;
CREATE POLICY "Public can view visible ngo partners"
  ON ngo_partners FOR SELECT
  TO public
  USING (is_visible = true);

-- Impact Stats
DROP POLICY IF EXISTS "Public can view visible ngo impact stats" ON ngo_impact_stats;
CREATE POLICY "Public can view visible ngo impact stats"
  ON ngo_impact_stats FOR SELECT
  TO public
  USING (is_visible = true);

-- Case Studies
DROP POLICY IF EXISTS "Public can view published ngo case studies" ON ngo_case_studies;
CREATE POLICY "Public can view published ngo case studies"
  ON ngo_case_studies FOR SELECT
  TO public
  USING (status = 'published');

-- Reports
DROP POLICY IF EXISTS "Public can view published ngo reports" ON ngo_reports;
CREATE POLICY "Public can view published ngo reports"
  ON ngo_reports FOR SELECT
  TO public
  USING (status = 'published');

-- ============================================
-- Company Tables - Public Read Access
-- ============================================

-- Pages
DROP POLICY IF EXISTS "Public can view published company pages" ON company_pages;
CREATE POLICY "Public can view published company pages"
  ON company_pages FOR SELECT
  TO public
  USING (status = 'published');

-- Sections
DROP POLICY IF EXISTS "Public can view visible company sections" ON company_sections;
CREATE POLICY "Public can view visible company sections"
  ON company_sections FOR SELECT
  TO public
  USING (is_visible = true);

-- Content Blocks
DROP POLICY IF EXISTS "Public can view visible company content blocks" ON company_content_blocks;
CREATE POLICY "Public can view visible company content blocks"
  ON company_content_blocks FOR SELECT
  TO public
  USING (is_visible = true);

-- Media
DROP POLICY IF EXISTS "Public can view company media" ON company_media;
CREATE POLICY "Public can view company media"
  ON company_media FOR SELECT
  TO public
  USING (true);

-- Blogs
DROP POLICY IF EXISTS "Public can view published company blogs" ON company_blogs;
CREATE POLICY "Public can view published company blogs"
  ON company_blogs FOR SELECT
  TO public
  USING (status = 'published');

-- Services
DROP POLICY IF EXISTS "Public can view published company services" ON company_services;
CREATE POLICY "Public can view published company services"
  ON company_services FOR SELECT
  TO public
  USING (status = 'published');

-- Projects
DROP POLICY IF EXISTS "Public can view published company projects" ON company_projects;
CREATE POLICY "Public can view published company projects"
  ON company_projects FOR SELECT
  TO public
  USING (status = 'published');

-- Team
DROP POLICY IF EXISTS "Public can view visible company team" ON company_team;
CREATE POLICY "Public can view visible company team"
  ON company_team FOR SELECT
  TO public
  USING (is_visible = true);

-- Testimonials
DROP POLICY IF EXISTS "Public can view visible company testimonials" ON company_testimonials;
CREATE POLICY "Public can view visible company testimonials"
  ON company_testimonials FOR SELECT
  TO public
  USING (is_visible = true);

-- Partners
DROP POLICY IF EXISTS "Public can view visible company partners" ON company_partners;
CREATE POLICY "Public can view visible company partners"
  ON company_partners FOR SELECT
  TO public
  USING (is_visible = true);

-- ============================================
-- Shared Tables
-- ============================================

-- Websites
DROP POLICY IF EXISTS "Public can view websites" ON websites;
CREATE POLICY "Public can view websites"
  ON websites FOR SELECT
  TO public
  USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE ngo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_reports ENABLE ROW LEVEL SECURITY;

ALTER TABLE company_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_partners ENABLE ROW LEVEL SECURITY;

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

