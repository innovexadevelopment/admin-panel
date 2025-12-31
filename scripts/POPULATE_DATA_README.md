# Populate Dummy Data Script

This script converts the provided images to WebP format, uploads them to Supabase storage, and populates all database tables with realistic, professional dummy data.

## Prerequisites

1. **Images Required:**
   - `admin-panel/aa/banner.avif` - Used for hero sections
   - `admin-panel/aa/square.jpg` - Used for all other images

2. **Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

3. **Dependencies:**
   - `sharp` - For image processing (installed via npm)

## What the Script Does

### Image Processing
1. **Converts images to WebP format** with automatic compression
2. **Ensures file size < 100KB** while maintaining high visual quality
3. **Uploads images to Supabase storage** in organized folders:
   - `company/pages/` - Hero images (banner)
   - `company/blogs/`, `company/team/`, etc. - Square images
   - `ngo/pages/` - Hero images (banner)
   - `ngo/blogs/`, `ngo/team/`, etc. - Square images

### Data Population

#### Company Website (Innovexa)
- **Pages**: Home, About, Services, Work, Contact
- **Services**: 8 different services with detailed descriptions
- **Projects**: 2 featured projects with metrics and results
- **Blog Posts**: 8 articles with comprehensive content
- **Team Members**: 6 team members with bios
- **Testimonials**: 3 client testimonials
- **Partners**: 6 partner organizations
- **Hero Sections**: Homepage hero with banner image

#### NGO Website (DUAF)
- **Pages**: Home, About, Programs, Impact, Get Involved
- **Programs**: 8 different programs with detailed descriptions
- **Impact Stats**: 4 key statistics
- **Blog Posts**: 8 articles with field stories
- **Team Members**: 6 team members with bios
- **Testimonials**: 3 partner testimonials
- **Partners**: 6 partner organizations
- **Hero Sections**: Homepage hero with banner image

## Running the Script

```bash
cd admin-panel
npm run populate-data
```

The script will:
1. Check for required images
2. Convert and compress images to WebP
3. Upload images to Supabase storage
4. Create media records in the database
5. Populate all tables with realistic data
6. Create hero sections with banner images
7. Provide progress updates throughout

## Image Usage

- **banner.avif** → Converted to WebP and used for:
  - Hero section backgrounds (homepage)
  - Any wide-format hero images

- **square.jpg** → Converted to WebP and used for:
  - Blog post featured images
  - Team member photos
  - Testimonial photos
  - Partner logos
  - Program/service images
  - Project images
  - All other image requirements

## Notes

- All images are automatically compressed to under 100KB
- Images maintain high visual quality through smart compression
- All content is realistic and professional (not placeholder text)
- Descriptions are detailed and meaningful
- Data is production-ready and authentic

## Troubleshooting

**Error: Images not found**
- Ensure `banner.avif` and `square.jpg` are in `admin-panel/aa/` directory

**Error: Missing Supabase credentials**
- Check `.env.local` file has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**Error: Storage bucket not found**
- Run `npm run setup:storage` first to create the media bucket

**Error: Permission denied**
- Ensure you're using the service role key (not anon key)
- Check RLS policies allow service role operations

