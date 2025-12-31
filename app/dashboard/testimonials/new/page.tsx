'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTestimonialPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    photo_id: '',
    is_featured: false,
    is_visible: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const tableName = getTableName(currentWebsite, 'testimonials')
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          name: formData.name,
          role: formData.role || null,
          company: formData.company || null,
          content: formData.content,
          rating: formData.rating,
          photo_id: formData.photo_id || null,
          is_featured: formData.is_featured,
          is_visible: formData.is_visible,
          order_index: 0,
        })
        .select()
        .single()

      if (error) {
        alert(`Error: ${error.message}`)
        return
      }

      router.push('/dashboard/testimonials')
    } catch (error: any) {
      alert(`Failed to create testimonial: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/testimonials" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Testimonials
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Testimonial</h1>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={6}
            required
          />
        </div>

        <ImageUpload
          value={formData.photo_id}
          onChange={(id) => setFormData({ ...formData, photo_id: id || '' })}
          folder="testimonials"
          label="Photo"
          altText={formData.name || 'Testimonial photo'}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
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
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Testimonial'}
          </button>
          <Link href="/dashboard/testimonials" className="px-6 py-2 border rounded-lg hover:bg-muted">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

