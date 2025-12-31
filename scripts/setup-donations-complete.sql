-- Complete setup script for ngo_donations table
-- Run this script in your Supabase SQL editor to set up the donations table

-- Create donations table for NGO
CREATE TABLE IF NOT EXISTS public.ngo_donations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  payment_method text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'failed'::text, 'cancelled'::text])),
  payment_reference text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  confirmed_by uuid,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ngo_donations_pkey PRIMARY KEY (id),
  CONSTRAINT ngo_donations_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.admin_users(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ngo_donations_status ON public.ngo_donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_ngo_donations_created_at ON public.ngo_donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ngo_donations_email ON public.ngo_donations(donor_email);

-- Enable RLS
ALTER TABLE public.ngo_donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert for donations" ON public.ngo_donations;
DROP POLICY IF EXISTS "Allow authenticated users to read donations" ON public.ngo_donations;
DROP POLICY IF EXISTS "Allow authenticated users to update donations" ON public.ngo_donations;
DROP POLICY IF EXISTS "Allow public to read donations" ON public.ngo_donations;

-- Allow public (anon) to insert donations
CREATE POLICY "Allow public insert for donations" ON public.ngo_donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to read donations (for confirmation if needed)
CREATE POLICY "Allow public to read donations" ON public.ngo_donations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users (admins) to read all donations
CREATE POLICY "Allow authenticated users to read donations" ON public.ngo_donations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to update donations
CREATE POLICY "Allow authenticated users to update donations" ON public.ngo_donations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.ngo_donations IS 'Stores donation information for NGO website';

-- Verify table was created
SELECT 'ngo_donations table created successfully!' as status;

