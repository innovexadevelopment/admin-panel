'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { ImageUpload } from '../../../../components/image-upload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    client_name: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image_id: '',
    is_featured: false,
  })

  if (currentWebsite !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Projects are only available for Company website.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('company_projects')
        .insert({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description || null,
          content: formData.content || null,
          client_name: formData.client_name || null,
          category: formData.category || null,
          status: formData.status,
          featured_image_id: formData.featured_image_id || null,
          is_featured: formData.is_featured,
          order_index: 0,
          metadata: {},
          results_metrics: {},
        })
        .select()
        .single()

      if (error) {
        alert(`Error: ${error.message}`)
        return
      }

      router.push('/dashboard/projects')
    } catch (error: any) {
      alert(`Failed to create project: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={8}
          />
        </div>

        <ImageUpload
          value={formData.featured_image_id}
          onChange={(id) => setFormData({ ...formData, featured_image_id: id || '' })}
          folder="projects"
          label="Featured Image"
          altText={formData.title || 'Project featured image'}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Client Name</label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <Link href="/dashboard/projects" className="px-6 py-2 border rounded-lg hover:bg-muted">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

