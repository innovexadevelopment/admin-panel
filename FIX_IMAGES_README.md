# Fix Images Not Showing on DUAF Website

## Problem
Images are not showing on the DUAF website, including the hero image.

## Solution

### Step 1: Make Storage Bucket Public ✅ (Already Done)
The storage bucket has been made public using:
```bash
npm run make-bucket-public
```

### Step 2: Fix RLS Policies for Public Access

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `admin-panel/scripts/fix-public-access.sql`
4. Click **Run**

This will create RLS policies that allow public read access to:
- `ngo_pages` (published only)
- `ngo_sections` (visible only)
- `ngo_content_blocks` (visible only)
- `ngo_media` (all)
- `ngo_blogs` (published only)
- `ngo_programs` (published only)
- `ngo_team` (visible only)
- `ngo_testimonials` (visible only)
- `ngo_partners` (visible only)
- `ngo_impact_stats` (visible only)
- And all company tables as well

### Step 3: Verify

1. Refresh the DUAF website
2. Check browser console for any errors
3. The hero image should now appear
4. All other images (programs, blogs, partners) should also load

## What Was Fixed

1. ✅ Storage bucket is now public
2. ✅ Homepage now loads hero section from database
3. ✅ Added error handling and logging
4. ⏳ RLS policies need to be applied (Step 2 above)

## Troubleshooting

**If images still don't show:**

1. Check browser console for errors
2. Verify the image URLs in the database:
   ```sql
   SELECT file_url FROM ngo_media LIMIT 5;
   ```
3. Try accessing an image URL directly in the browser
4. Verify RLS policies were applied:
   ```sql
   SELECT * FROM pg_policies WHERE tablename LIKE 'ngo_%';
   ```

