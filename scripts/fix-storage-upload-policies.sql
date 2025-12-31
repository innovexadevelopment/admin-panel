-- Fix Storage Bucket Policies to allow authenticated users to upload files
-- This fixes the "new row violates row-level security policy" error when uploading images
-- Run this in Supabase SQL Editor

-- ============================================
-- Storage Bucket Policies for 'media' bucket
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

