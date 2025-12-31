# Admin Panel - Unified CMS

A powerful, production-ready admin panel for managing multiple websites with a single source of truth.

## Features

✅ **Website Switcher** - Toggle between Company (Innovexa) and NGO (DUAF) instantly  
✅ **Full CRUD Control** - Manage pages, blogs, media, team, testimonials, partners, programs  
✅ **Dynamic Page Builder** - Create pages with sections and content blocks  
✅ **Smart Image Compression** - Automatic WebP conversion, <100KB compression  
✅ **Media Management** - Organized folders, automatic cleanup  
✅ **SEO Management** - Full SEO metadata control  
✅ **Role-Based Access** - Super admin, admin, editor roles  
✅ **Audit Logging** - Track all changes  

## Quick Start

1. **Setup Supabase**
   ```bash
   # Run schema.sql in Supabase SQL Editor
   # Create 'media' storage bucket
   ```

2. **Install & Configure**
   ```bash
   npm install
   # Create .env.local with Supabase credentials
   ```

3. **Run**
   ```bash
   npm run dev
   ```

See [SETUP.md](./SETUP.md) for detailed instructions.

## Project Structure

```
admin-panel/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Admin dashboard pages
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/                    # Utilities and hooks
│   ├── supabase/          # Supabase clients
│   ├── hooks/              # React hooks
│   └── utils/              # Helper functions
├── scripts/                # Setup scripts
└── schema.sql              # Database schema
```

## Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Architecture and API docs

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Supabase** - Database & storage
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

## License

MIT

