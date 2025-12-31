-- Fix RLS policies for ngo_donations to allow public inserts
-- This ensures anonymous users can submit donations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert for donations" ON public.ngo_donations;
DROP POLICY IF EXISTS "Allow public to read own donations" ON public.ngo_donations;

-- Allow public (anon) to insert donations
CREATE POLICY "Allow public insert for donations" ON public.ngo_donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to read their own donations (optional, for confirmation)
-- This allows users to see their donation status if needed
CREATE POLICY "Allow public to read own donations" ON public.ngo_donations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.ngo_donations ENABLE ROW LEVEL SECURITY;

