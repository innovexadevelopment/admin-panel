-- Grant permissions to service_role for all tables
-- Run this in Supabase SQL Editor

-- Grant USAGE on schema
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SCHEMA public TO service_role;

-- Grant permissions on all company tables
GRANT ALL ON TABLE company_media TO service_role;
GRANT ALL ON TABLE company_pages TO service_role;
GRANT ALL ON TABLE company_sections TO service_role;
GRANT ALL ON TABLE company_content_blocks TO service_role;
GRANT ALL ON TABLE company_blogs TO service_role;
GRANT ALL ON TABLE company_team TO service_role;
GRANT ALL ON TABLE company_testimonials TO service_role;
GRANT ALL ON TABLE company_partners TO service_role;
GRANT ALL ON TABLE company_services TO service_role;
GRANT ALL ON TABLE company_projects TO service_role;
GRANT ALL ON TABLE company_contact_submissions TO service_role;
GRANT ALL ON TABLE company_seo TO service_role;

-- Grant permissions on all NGO tables
GRANT ALL ON TABLE ngo_media TO service_role;
GRANT ALL ON TABLE ngo_pages TO service_role;
GRANT ALL ON TABLE ngo_sections TO service_role;
GRANT ALL ON TABLE ngo_content_blocks TO service_role;
GRANT ALL ON TABLE ngo_blogs TO service_role;
GRANT ALL ON TABLE ngo_team TO service_role;
GRANT ALL ON TABLE ngo_testimonials TO service_role;
GRANT ALL ON TABLE ngo_partners TO service_role;
GRANT ALL ON TABLE ngo_programs TO service_role;
GRANT ALL ON TABLE ngo_impact_stats TO service_role;
GRANT ALL ON TABLE ngo_case_studies TO service_role;
GRANT ALL ON TABLE ngo_reports TO service_role;
GRANT ALL ON TABLE ngo_contact_submissions TO service_role;
GRANT ALL ON TABLE ngo_seo TO service_role;

-- Grant permissions on shared tables
GRANT ALL ON TABLE websites TO service_role;
GRANT ALL ON TABLE admin_users TO service_role;
GRANT ALL ON TABLE audit_logs TO service_role;

-- Also grant on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Allow service_role to bypass RLS (if needed)
ALTER TABLE company_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_media ENABLE ROW LEVEL SECURITY;
-- Note: service_role should bypass RLS automatically, but if not, you may need to:
-- CREATE POLICY "Service role bypass" ON company_media FOR ALL TO service_role USING (true) WITH CHECK (true);

