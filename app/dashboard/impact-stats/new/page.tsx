'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewImpactStatPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: '',
    category: '',
    year: '',
    is_visible: true,
  })

  if (currentWebsite !== 'ngo') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impact Stats are only available for NGO website.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('ngo_impact_stats')
        .insert({
          label: formData.label,
          value: formData.value,
          icon: formData.icon || null,
          category: formData.category || null,
          year: formData.year ? parseInt(formData.year) : null,
          is_visible: formData.is_visible,
          order_index: 0,
        })
        .select()
        .single()

      if (error) {
        alert(`Error: ${error.message}`)
        return
      }

      router.push('/dashboard/impact-stats')
    } catch (error: any) {
      alert(`Failed to create impact stat: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/impact-stats" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Impact Stats
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Impact Stat</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Label *</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Value *</label>
          <input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
            placeholder="e.g., 1000, 50K, 1M"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Icon name or emoji"
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

        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., 2024"
          />
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
            {loading ? 'Creating...' : 'Create Impact Stat'}
          </button>
          <Link href="/dashboard/impact-stats" className="px-6 py-2 border rounded-lg hover:bg-muted">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

