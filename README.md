# Admin Panel

A comprehensive admin panel for managing both company and NGO websites, built with Next.js, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Dual Site Management**: Manage content for both company and NGO websites from a single interface
- **Authentication**: Secure admin authentication with role-based access control
- **Image Management**: Automatic image compression (~200KB) and storage management
- **CRUD Operations**: Full create, read, update, and delete functionality for all content types
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui components
- **Real-time Updates**: Instant feedback with toast notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form + Zod
- **Image Compression**: browser-image-compression

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

Run the SQL schema provided in the project documentation to set up your Supabase database. The schema includes:

- Admin users table
- Hero sections
- About sections
- Services
- Projects
- Timeline items
- Team members
- Testimonials
- Impact stats
- Gallery images
- Contact info
- Contact messages
- Campaigns (NGO)

### 4. Storage Bucket

The application requires a storage bucket named **`public-assets`** for image uploads.

#### Option A: Automatic Setup (Recommended)

If you have your environment variables set up, run:

```bash
npm run setup:storage
```

This will automatically create the bucket with the correct settings.

#### Option B: Manual Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create bucket"**
4. Configure the bucket:
   - **Name**: `public-assets` (exactly as shown)
   - **Public bucket**: ✅ Enable this (toggle it ON)
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif` (optional)
5. Click **"Create bucket"**

**Important**: The bucket name must be exactly `public-assets` (lowercase, with hyphen) as this is hardcoded in the application.

### 5. Create Admin User

1. Sign up a user in Supabase Auth
2. Insert a record in the `admin_users` table:

```sql
INSERT INTO admin_users (auth_user_id, email, role)
VALUES ('auth_user_id_from_supabase', 'admin@example.com', 'superadmin');
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and log in with your admin credentials.

## Project Structure

```
admin-panel/
├── app/
│   ├── auth/
│   │   └── login/          # Login page
│   ├── company/            # Company site management
│   │   ├── hero/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── timeline/
│   │   ├── team/
│   │   ├── testimonials/
│   │   ├── impact/
│   │   ├── contact-info/
│   │   └── messages/
│   ├── ngo/                # NGO site management
│   │   ├── hero/
│   │   ├── projects/
│   │   ├── campaigns/
│   │   ├── gallery/
│   │   ├── team/
│   │   ├── testimonials/
│   │   ├── impact/
│   │   ├── contact-info/
│   │   └── messages/
│   └── page.tsx            # Dashboard
├── components/
│   ├── forms/              # Form components
│   ├── layout/             # Sidebar, Topbar
│   ├── shared/             # Shared components
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── auth.ts             # Authentication helpers
    ├── supabase-server.ts  # Server-side Supabase client
    ├── supabase-browser.ts # Client-side Supabase client
    └── validators.ts       # Zod schemas
```

## Key Features

### Image Uploader

The `ImageUploader` component automatically:
- Compresses images to ~200KB
- Uploads to Supabase Storage
- Manages file paths
- Deletes old images when replaced
- Provides preview functionality

### Authentication

All routes except `/auth/login` are protected. The auth system:
- Checks for valid admin user session
- Redirects to login if not authenticated
- Supports role-based access (superadmin, editor)

### Data Management

Each content type has:
- List view with data table
- Create/Edit forms with validation
- Delete functionality with image cleanup
- Status management (active/inactive, etc.)

## Development

### Adding New Content Types

1. Add Zod schema to `lib/validators.ts`
2. Create form component in `components/forms/`
3. Create pages in appropriate `app/company/` or `app/ngo/` directory
4. Add menu item to `components/layout/sidebar.tsx`

### Styling

The project uses Tailwind CSS with shadcn/ui components. Customize colors and styles in:
- `tailwind.config.ts`
- `app/globals.css`

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment variables in your hosting platform
3. Deploy to Vercel, Netlify, or your preferred platform

## License

MIT

