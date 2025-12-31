'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { FormInput, FormTextarea, FormSelect, FormCheckbox, FormButton } from '../../../../components/form-input'
import type { Program } from '../../../../lib/types-separate'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditProgramPage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image_id: '',
    is_featured: false,
  })

  const programLabel = currentWebsite === 'company' ? 'Service' : 'Program'

  useEffect(() => {
    loadProgram()
  }, [params.id, currentWebsite])

  async function loadProgram() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'programs')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setProgram(data)
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        content: data.content || '',
        category: data.category || '',
        status: data.status || 'draft',
        featured_image_id: data.featured_image_id || '',
        is_featured: data.is_featured ?? false,
      })
    } catch (error) {
      console.error('Error loading program:', error)
      alert(`Failed to load ${programLabel.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const tableName = getTableName(currentWebsite, 'programs')
      const { error } = await supabase
        .from(tableName)
        .update({
          title: formData.title,
          slug: formData.slug,
          description: formData.description || null,
          content: formData.content || null,
          category: formData.category || null,
          status: formData.status,
          featured_image_id: formData.featured_image_id || null,
          is_featured: formData.is_featured,
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/programs')
    } catch (error: any) {
      alert(`Failed to update ${programLabel.toLowerCase()}: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }
  
  if (!program) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{programLabel} not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/dashboard/programs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group">
          <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          Back to {programLabel}s
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Edit {programLabel}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Update {programLabel.toLowerCase()} details below
        </motion.p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-card border rounded-2xl p-8 shadow-lg space-y-6"
      >
        <FormInput
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={`${programLabel} title`}
          required
        />

        <FormInput
          label="Slug"
          name="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="url-friendly-identifier"
          required
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={`${programLabel} description`}
          rows={3}
        />

        <ImageUpload
          value={formData.featured_image_id}
          onChange={(id) => setFormData({ ...formData, featured_image_id: id || '' })}
          folder="programs"
          label="Featured Image"
          altText={formData.title || `${programLabel} featured image`}
        />

        <FormTextarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={`${programLabel} content`}
          rows={8}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Category"
            name="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Category"
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        <FormCheckbox
          label="Featured"
          name="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
        />

        <div className="flex gap-4 pt-4">
          <FormButton
            type="submit"
            disabled={saving}
            loading={saving}
            icon={<Save className="h-4 w-4" />}
            className="flex-1"
          >
            Save Changes
          </FormButton>
          <FormButton
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/programs')}
            className="px-8"
          >
            Cancel
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

