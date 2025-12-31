-- Fix RLS policies for media tables to allow public read access AND authenticated admin operations
-- Run this in Supabase SQL Editor

-- ============================================
-- Company Media Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can insert company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can update company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can delete company media" ON company_media;

-- Create policy to allow public read access to media
CREATE POLICY "Public can view company media"
  ON company_media FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert media (for uploads)
CREATE POLICY "Authenticated users can insert company media"
  ON company_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update media
CREATE POLICY "Authenticated users can update company media"
  ON company_media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete company media"
  ON company_media FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- NGO Media Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can insert ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can update ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can delete ngo media" ON ngo_media;

-- Create policy to allow public read access to media
CREATE POLICY "Public can view ngo media"
  ON ngo_media FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert media (for uploads)
CREATE POLICY "Authenticated users can insert ngo media"
  ON ngo_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update media
CREATE POLICY "Authenticated users can update ngo media"
  ON ngo_media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete ngo media"
  ON ngo_media FOR DELETE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE company_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_media ENABLE ROW LEVEL SECURITY;
