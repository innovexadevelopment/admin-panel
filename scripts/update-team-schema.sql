-- Update company_team and ngo_team tables to ensure photo_id column exists with proper foreign key
-- Run this in Supabase SQL Editor

-- ============================================
-- Company Team Table Updates
-- ============================================

-- Add photo_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_team' AND column_name = 'photo_id'
  ) THEN
    ALTER TABLE company_team ADD COLUMN photo_id UUID;
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'company_team_photo_id_fkey'
  ) THEN
    ALTER TABLE company_team 
    ADD CONSTRAINT company_team_photo_id_fkey 
    FOREIGN KEY (photo_id) 
    REFERENCES company_media(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_company_team_photo_id ON company_team(photo_id);

-- ============================================
-- NGO Team Table Updates
-- ============================================

-- Add photo_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ngo_team' AND column_name = 'photo_id'
  ) THEN
    ALTER TABLE ngo_team ADD COLUMN photo_id UUID;
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ngo_team_photo_id_fkey'
  ) THEN
    ALTER TABLE ngo_team 
    ADD CONSTRAINT ngo_team_photo_id_fkey 
    FOREIGN KEY (photo_id) 
    REFERENCES ngo_media(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_ngo_team_photo_id ON ngo_team(photo_id);

-- ============================================
-- Update RLS Policies for Team Tables
-- ============================================

-- Company Team - Public can view visible team members
DROP POLICY IF EXISTS "Public can view visible company team" ON company_team;
CREATE POLICY "Public can view visible company team"
  ON company_team FOR SELECT
  TO public
  USING (is_visible = true);

-- NGO Team - Public can view visible team members (if not already exists)
DROP POLICY IF EXISTS "Public can view visible ngo team" ON ngo_team;
CREATE POLICY "Public can view visible ngo team"
  ON ngo_team FOR SELECT
  TO public
  USING (is_visible = true);

-- ============================================
-- Grant Permissions
-- ============================================

-- Grant permissions to service_role
GRANT ALL ON TABLE company_team TO service_role;
GRANT ALL ON TABLE ngo_team TO service_role;

-- ============================================
-- Verification
-- ============================================

-- Verify the changes
SELECT 
  'company_team' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'company_team' AND column_name = 'photo_id'
UNION ALL
SELECT 
  'ngo_team' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ngo_team' AND column_name = 'photo_id';

