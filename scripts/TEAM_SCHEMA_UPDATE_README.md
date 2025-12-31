# Team Schema Update and Placeholder Image Upload

This guide will help you update the database schema for team member photos and upload placeholder images.

## Step 1: Update Database Schema

Run the SQL migration to ensure the `photo_id` column exists in both `company_team` and `ngo_team` tables with proper foreign key constraints.

### How to Run:

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `update-team-schema.sql`
4. Click **Run** to execute the migration

This will:
- ✅ Add `photo_id` column if it doesn't exist
- ✅ Add foreign key constraints to `company_media` and `ngo_media` tables
- ✅ Create indexes for better query performance
- ✅ Update RLS policies for public access
- ✅ Grant necessary permissions

## Step 2: Upload Placeholder Images

Upload default placeholder avatar images that can be used for team members.

### Prerequisites:

Make sure you have the required dependencies installed:

```bash
npm install sharp
# or
yarn add sharp
```

### How to Run:

1. Make sure your `.env.local` file has the required Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the upload script:
   ```bash
   cd admin-panel
   npx tsx scripts/upload-team-placeholder-image.ts
   ```

   Or if you have tsx installed globally:
   ```bash
   tsx scripts/upload-team-placeholder-image.ts
   ```

### What it does:

- ✅ Creates a placeholder avatar image (blue gradient with initial letter)
- ✅ Uploads to Supabase storage in `company/team/` and `ngo/team/` folders
- ✅ Creates media records in `company_media` and `ngo_media` tables
- ✅ Returns the photo_id that you can use for team members

### Output:

The script will output:
- The photo_id for company team placeholder
- The photo_id for NGO team placeholder
- The public URL of the uploaded images

You can use these photo_ids when creating team member records.

## Step 3: Update Existing Team Members (Optional)

If you have existing team members without photos, you can update them:

```sql
-- Update company team members without photos
UPDATE company_team 
SET photo_id = 'your-placeholder-photo-id-here'
WHERE photo_id IS NULL;

-- Update NGO team members without photos
UPDATE ngo_team 
SET photo_id = 'your-placeholder-photo-id-here'
WHERE photo_id IS NULL;
```

Replace `'your-placeholder-photo-id-here'` with the actual photo_id from the upload script output.

## Verification

After running both scripts, verify the changes:

```sql
-- Check company_team table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'company_team' AND column_name = 'photo_id';

-- Check NGO team table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ngo_team' AND column_name = 'photo_id';

-- Check if placeholder images were uploaded
SELECT id, file_name, file_url, folder_path
FROM company_media
WHERE folder_path = 'team' AND file_name LIKE 'team-placeholder%';

SELECT id, file_name, file_url, folder_path
FROM ngo_media
WHERE folder_path = 'team' AND file_name LIKE 'team-placeholder%';
```

## Troubleshooting

### Schema Update Issues:

- **Column already exists**: The script uses `IF NOT EXISTS` checks, so it's safe to run multiple times
- **Permission denied**: Make sure you're using the service role key or have proper permissions
- **Foreign key error**: Ensure `company_media` and `ngo_media` tables exist first

### Image Upload Issues:

- **Missing credentials**: Check your `.env.local` file
- **Storage bucket doesn't exist**: Run `setup-storage.ts` first
- **Sharp not found**: Install sharp with `npm install sharp`
- **Upload permission error**: Check storage bucket permissions and RLS policies

## Notes

- The placeholder image is a 400x400px blue gradient avatar with a letter "T"
- Images are uploaded as WebP format for better compression
- The placeholder can be replaced with actual photos later through the admin panel
- Foreign key constraints ensure data integrity (ON DELETE SET NULL)

