'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { FormInput, FormCheckbox, FormButton } from '../../../../components/form-input'
import type { ImpactStat } from '../../../../lib/types-separate'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditImpactStatPage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [stat, setStat] = useState<ImpactStat | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    loadStat()
  }, [params.id])

  async function loadStat() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ngo_impact_stats')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setStat(data)
      setFormData({
        label: data.label || '',
        value: data.value || '',
        icon: data.icon || '',
        category: data.category || '',
        year: data.year?.toString() || '',
        is_visible: data.is_visible ?? true,
      })
    } catch (error) {
      console.error('Error loading stat:', error)
      alert('Failed to load impact stat')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('ngo_impact_stats')
        .update({
          label: formData.label,
          value: formData.value,
          icon: formData.icon || null,
          category: formData.category || null,
          year: formData.year ? parseInt(formData.year) : null,
          is_visible: formData.is_visible,
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/impact-stats')
    } catch (error: any) {
      alert(`Failed to update impact stat: ${error.message}`)
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
  
  if (!stat) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impact stat not found</p>
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
        <Link href="/dashboard/impact-stats" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group">
          <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          Back to Impact Stats
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Edit Impact Stat
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Update impact statistic details below
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
          label="Label"
          name="label"
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g., Volunteers, Projects"
          required
        />

        <FormInput
          label="Value"
          name="value"
          type="text"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="e.g., 1000, 50+"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Icon"
            name="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Icon name or emoji"
          />

          <FormInput
            label="Category"
            name="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Category"
          />
        </div>

        <FormInput
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          placeholder="Year"
        />

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
            onClick={() => router.push('/dashboard/impact-stats')}
            className="px-8"
          >
            Cancel
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

