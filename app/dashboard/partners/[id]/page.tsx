'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { FormInput, FormTextarea, FormCheckbox, FormButton } from '../../../../components/form-input'
import type { Partner } from '../../../../lib/types-separate'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditPartnerPage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    category: '',
    logo_id: '',
    is_visible: true,
  })

  useEffect(() => {
    loadPartner()
  }, [params.id, currentWebsite])

  async function loadPartner() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'partners')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setPartner(data)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        website_url: data.website_url || '',
        category: data.category || '',
        logo_id: data.logo_id || '',
        is_visible: data.is_visible ?? true,
      })
    } catch (error) {
      console.error('Error loading partner:', error)
      alert('Failed to load partner')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const tableName = getTableName(currentWebsite, 'partners')
      const { error } = await supabase
        .from(tableName)
        .update({
          name: formData.name,
          description: formData.description || null,
          website_url: formData.website_url || null,
          category: formData.category || null,
          logo_id: formData.logo_id || null,
          is_visible: formData.is_visible,
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/partners')
    } catch (error: any) {
      alert(`Failed to update partner: ${error.message}`)
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
  
  if (!partner) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Partner not found</p>
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
        <Link href="/dashboard/partners" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group">
          <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          Back to Partners
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Edit Partner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Update partner information below
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
          placeholder="Partner name"
          required
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Partner description"
          rows={4}
        />

        <ImageUpload
          value={formData.logo_id}
          onChange={(id) => setFormData({ ...formData, logo_id: id || '' })}
          folder="partners"
          label="Logo"
          altText={formData.name || 'Partner logo'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Website URL"
            name="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://example.com"
          />

          <FormInput
            label="Category"
            name="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Sponsor, Partner"
          />
        </div>

        <FormCheckbox
          label="Visible"
          name="is_visible"
          checked={formData.is_visible}
          onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
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
            onClick={() => router.push('/dashboard/partners')}
            className="px-8"
          >
            Cancel
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

