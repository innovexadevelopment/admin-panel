# Demo Data Setup Guide

This guide will help you populate your Supabase database with demo data for testing and development.

## Quick Start

1. **Open Supabase SQL Editor**
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Navigate to **SQL Editor** in the left sidebar
   - Click **"New query"**

2. **Run the Demo Data Script**
   - Open the file `scripts/seed-demo-data.sql` in this project
   - Copy the **ENTIRE** contents
   - Paste it into the Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify Data**
   - Check your tables in the Supabase Table Editor
   - You should see demo data in all tables

## What's Included

The demo data script includes sample data for:

### Hero Sections
- 2 Company hero sections
- 2 NGO hero sections

### Services
- 4 Company services (Web Development, Digital Marketing, Cloud Solutions, Consulting)

### Projects
- 2 Company projects
- 2 NGO projects

### Timeline Items
- 4 Company timeline items
- 4 NGO timeline items

### Team Members
- 4 Company team members
- 4 NGO team members

### Testimonials
- 3 Company testimonials
- 3 NGO testimonials

### Impact Stats
- 4 Company impact stats
- 4 NGO impact stats

### Gallery Images (NGO)
- 4 Gallery images with descriptions

### Contact Info
- 1 Company contact info record
- 1 NGO contact info record

### Campaigns (NGO)
- 3 Active campaigns with goals and progress

### Contact Messages
- 3 Company messages
- 3 NGO messages

## Important Notes

1. **Image Paths**: The demo data includes image paths, but you'll need to upload actual images to the `public-assets` storage bucket for them to display.

2. **Clear Existing Data**: The script does NOT clear existing data by default. If you want to start fresh, uncomment the `TRUNCATE` statement at the top of the script.

3. **Foreign Keys**: Make sure your database schema is set up correctly before running the script.

4. **Storage Bucket**: Ensure the `public-assets` storage bucket exists before uploading images.

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've run the `schema.sql` file first to create all tables

### Error: "violates foreign key constraint"
- Check that all referenced tables exist and have the correct structure

### Images Not Displaying
- Verify the `public-assets` bucket exists and is public
- Check that image paths match the bucket structure
- Ensure storage RLS policies allow public reads

## Next Steps

After running the demo data:

1. **Test CRUD Operations**: Try creating, editing, and deleting items
2. **Upload Images**: Add real images to replace placeholder paths
3. **Customize Content**: Update the demo data with your actual content
4. **Test Features**: Verify all features work correctly with the demo data

## Customization

Feel free to modify the demo data script to match your specific needs:
- Change names, titles, and descriptions
- Adjust dates and numbers
- Add more or fewer records
- Customize social media links and contact information

