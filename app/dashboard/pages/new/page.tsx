'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPagePage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    is_homepage: false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Get website ID
      const { data: website, error: websiteError } = await supabase
        .from('websites')
        .select('id')
        .eq('type', currentWebsite)
        .single()

      if (websiteError) {
        alert(`Error: ${websiteError.message}\n\nMake sure:\n1. Database schema is set up\n2. Websites table has records for 'company' and 'ngo'\n3. You are authenticated`)
        return
      }

      if (!website) {
        alert('Website not found. Please ensure the database has website records.')
        return
      }

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        alert(`Authentication error: ${authError.message}\n\nPlease log in first.`)
        return
      }

      // Get admin user ID
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .eq('is_active', true)
        .single()

      // Create page using correct table name
      const tableName = getTableName(currentWebsite, 'pages')
      const { data: page, error } = await supabase
        .from(tableName)
        .insert({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          is_homepage: formData.is_homepage,
          status: 'draft',
          created_by: adminUser?.id || null,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating page:', error)
        alert(`Error creating page: ${error.message}\n\nCommon issues:\n- Not authenticated\n- Missing admin_users record\n- RLS policy blocking access`)
        return
      }

      router.push(`/dashboard/pages/${page.id}`)
    } catch (error: any) {
      console.error('Error creating page:', error)
      alert(`Failed to create page: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/dashboard/pages"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pages
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Page</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="auto-generated from title"
          />
          <p className="text-sm text-muted-foreground mt-1">
            URL-friendly identifier (e.g., "about-us")
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_homepage"
            checked={formData.is_homepage}
            onChange={(e) => setFormData({ ...formData, is_homepage: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="is_homepage" className="text-sm font-medium">
            Set as homepage
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Page'}
          </button>
          <Link
            href="/dashboard/pages"
            className="px-6 py-2 border rounded-lg hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

