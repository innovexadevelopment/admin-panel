'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPartnerPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    category: '',
    logo_id: '',
    is_visible: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const tableName = getTableName(currentWebsite, 'partners')
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          name: formData.name,
          description: formData.description || null,
          website_url: formData.website_url || null,
          category: formData.category || null,
          logo_id: formData.logo_id || null,
          is_visible: formData.is_visible,
          order_index: 0,
        })
        .select()
        .single()

      if (error) {
        alert(`Error: ${error.message}`)
        return
      }

      router.push('/dashboard/partners')
    } catch (error: any) {
      alert(`Failed to create partner: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/partners" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Partners
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Partner</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
          />
        </div>

        <ImageUpload
          value={formData.logo_id}
          onChange={(id) => setFormData({ ...formData, logo_id: id || '' })}
          folder="partners"
          label="Logo"
          altText={formData.name || 'Partner logo'}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://..."
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_visible"
            checked={formData.is_visible}
            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="is_visible" className="text-sm font-medium">
            Visible
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Partner'}
          </button>
          <Link href="/dashboard/partners" className="px-6 py-2 border rounded-lg hover:bg-muted">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

