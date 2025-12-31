'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { FormInput, FormTextarea, FormCheckbox, FormButton } from '../../../../components/form-input'
import type { Testimonial } from '../../../../lib/types-separate'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditTestimonialPage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    loadTestimonial()
  }, [params.id, currentWebsite])

  async function loadTestimonial() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'testimonials')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setTestimonial(data)
      setFormData({
        name: data.name || '',
        role: data.role || '',
        company: data.company || '',
        content: data.content || '',
        rating: data.rating || 5,
        photo_id: data.photo_id || '',
        is_featured: data.is_featured ?? false,
        is_visible: data.is_visible ?? true,
      })
    } catch (error) {
      console.error('Error loading testimonial:', error)
      alert('Failed to load testimonial')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const tableName = getTableName(currentWebsite, 'testimonials')
      const { error } = await supabase
        .from(tableName)
        .update({
          name: formData.name,
          role: formData.role || null,
          company: formData.company || null,
          content: formData.content,
          rating: formData.rating,
          photo_id: formData.photo_id || null,
          is_featured: formData.is_featured,
          is_visible: formData.is_visible,
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/testimonials')
    } catch (error: any) {
      alert(`Failed to update testimonial: ${error.message}`)
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
  
  if (!testimonial) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Testimonial not found</p>
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
        <Link href="/dashboard/testimonials" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group">
          <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          Back to Testimonials
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Edit Testimonial
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Update testimonial details below
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
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Full name"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Role"
            name="role"
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., CEO, Manager"
          />

          <FormInput
            label="Company"
            name="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
          />
        </div>

        <FormTextarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Testimonial content"
          rows={6}
          required
        />

        <ImageUpload
          value={formData.photo_id}
          onChange={(id) => setFormData({ ...formData, photo_id: id || '' })}
          folder="testimonials"
          label="Photo"
          altText={formData.name || 'Testimonial photo'}
        />

        <FormInput
          label="Rating (1-5)"
          name="rating"
          type="number"
          value={formData.rating.toString()}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
          placeholder="1-5"
        />

        <div className="flex items-center gap-6">
          <FormCheckbox
            label="Featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />

          <FormCheckbox
            label="Visible"
            name="is_visible"
            checked={formData.is_visible}
            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
          />
        </div>

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
            onClick={() => router.push('/dashboard/testimonials')}
            className="px-8"
          >
            Cancel
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

