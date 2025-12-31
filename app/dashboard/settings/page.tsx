'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { FormInput, FormTextarea, FormButton } from '../../../components/form-input'
import type { Website } from '../../../lib/types-separate'
import { Save, Settings } from 'lucide-react'
import { useToast } from '../../../lib/hooks/use-toast'

export default function SettingsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [website, setWebsite] = useState<Website | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    primary_color: '',
    secondary_color: '',
    upi_id: '',
  })

  useEffect(() => {
    loadWebsite()
  }, [currentWebsite])

  async function loadWebsite() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .eq('type', currentWebsite)
        .single()

      if (error) {
        console.error('Error loading website:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      if (data) {
        setWebsite(data)
        const settings = data.settings || {}
        setFormData({
          name: data.name || '',
          domain: data.domain || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
          primary_color: data.primary_color || '',
          secondary_color: data.secondary_color || '',
          upi_id: settings.upi_id || '',
        })
      }
    } catch (error: any) {
      console.error('Error loading website:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load website settings',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const settings = { ...(website?.settings || {}), upi_id: formData.upi_id || null }
      
      const { error } = await supabase
        .from('websites')
        .update({
          name: formData.name,
          domain: formData.domain || null,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          address: formData.address || null,
          primary_color: formData.primary_color || null,
          secondary_color: formData.secondary_color || null,
          settings: settings,
        })
        .eq('type', currentWebsite)

      if (error) {
        console.error('Error saving settings:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Settings saved successfully!',
      })
      loadWebsite()
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to save settings',
      })
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

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4"
        >
          <Settings className="h-6 w-6 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground"
        >
          Configure settings for <strong className="text-foreground">{currentWebsite === 'company' ? 'Innovexa' : 'DUAF'}</strong>
        </motion.p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSave}
        className="bg-card border rounded-2xl p-8 shadow-lg space-y-6"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground">General Information</h2>
            <div className="space-y-6">
              <FormInput
                label="Website Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Website name"
                required
              />

              <FormInput
                label="Domain"
                name="domain"
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
                helperText="Your website domain (without https://)"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Contact Email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@example.com"
              />

              <FormInput
                label="Contact Phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="mt-6">
              <FormTextarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, State, ZIP Code"
                rows={3}
              />
            </div>
          </div>

          {currentWebsite === 'ngo' && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Payment Settings</h2>
              <FormInput
                label="UPI ID"
                name="upi_id"
                type="text"
                value={formData.upi_id}
                onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                placeholder="yourname@upi"
                helperText="Enter your UPI ID for donations (e.g., duaf@paytm)"
              />
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Brand Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">
                  Primary Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.primary_color || '#000000'}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-20 h-12 border-2 border-border rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">
                  Secondary Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.secondary_color || '#000000'}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-20 h-12 border-2 border-border rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <FormButton
            type="submit"
            disabled={saving}
            loading={saving}
            icon={<Save className="h-5 w-5" />}
            className="min-w-[160px]"
          >
            Save Settings
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

