-- Complete fix for image upload permissions - fixes both database RLS and storage policies
-- Run this in Supabase SQL Editor
-- This script fixes the "new row violates row-level security policy" error

-- ============================================
-- PART 1: Database Table RLS Policies
-- ============================================

-- Company Media Table
DROP POLICY IF EXISTS "Public can view company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can insert company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can update company media" ON company_media;
DROP POLICY IF EXISTS "Authenticated users can delete company media" ON company_media;

CREATE POLICY "Public can view company media"
  ON company_media FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert company media"
  ON company_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update company media"
  ON company_media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete company media"
  ON company_media FOR DELETE
  TO authenticated
  USING (true);

-- NGO Media Table
DROP POLICY IF EXISTS "Public can view ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can insert ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can update ngo media" ON ngo_media;
DROP POLICY IF EXISTS "Authenticated users can delete ngo media" ON ngo_media;

CREATE POLICY "Public can view ngo media"
  ON ngo_media FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert ngo media"
  ON ngo_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ngo media"
  ON ngo_media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ngo media"
  ON ngo_media FOR DELETE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE company_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: Storage Bucket Policies
-- ============================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload to media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files in media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files in media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files in media bucket" ON storage.objects;

-- Allow authenticated users to INSERT (upload) files to the media bucket
CREATE POLICY "Authenticated users can upload to media bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to UPDATE files in the media bucket
CREATE POLICY "Authenticated users can update files in media bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to DELETE files from the media bucket
CREATE POLICY "Authenticated users can delete files in media bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Allow public to SELECT (view) files in the media bucket (for public URLs)
CREATE POLICY "Public can view files in media bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

