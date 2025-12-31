# Fix Database Permissions

## Problem
The populate script is getting "permission denied for schema public" errors even when using the service role key.

## Solution

### Step 1: Run the Permission Fix SQL

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `scripts/fix-permissions.sql`
4. Click **Run**

This will grant the `service_role` all necessary permissions on all tables.

### Step 2: Verify Permissions

Run the check script:
```bash
npm run check-schema
```

All tables should show ✅ instead of ⚠️.

### Step 3: Run Population Script

Once permissions are fixed:
```bash
npm run populate-data
```

## Why This Happens

Even though the `service_role` should bypass RLS automatically, Supabase sometimes requires explicit grants for:
- Schema usage (`USAGE ON SCHEMA`)
- Table permissions (`ALL ON TABLE`)
- Sequence permissions (for auto-increment IDs)

## Alternative: Disable RLS (Not Recommended)

If you want to disable RLS entirely (not recommended for production):

```sql
ALTER TABLE company_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_media DISABLE ROW LEVEL SECURITY;
-- Repeat for all tables
```

But it's better to grant permissions to service_role and keep RLS enabled for security.

