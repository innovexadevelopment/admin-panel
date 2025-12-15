'use client'

import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface WebsiteSettingsFormProps {
  site: 'company' | 'ngo'
  settings: any[]
}

const defaultSettings = [
  { key: 'website_enabled', label: 'Website Enabled', description: 'Enable or disable the website', defaultValue: true },
  { key: 'blog_enabled', label: 'Blog Enabled', description: 'Show blog section', defaultValue: true },
  { key: 'contact_form_enabled', label: 'Contact Form Enabled', description: 'Enable contact form submissions', defaultValue: true },
  { key: 'maintenance_mode', label: 'Maintenance Mode', description: 'Put website in maintenance mode', defaultValue: false },
]

export function WebsiteSettingsForm({ site, settings }: WebsiteSettingsFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [localSettings, setLocalSettings] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const initialSettings: Record<string, boolean> = {}
    defaultSettings.forEach(setting => {
      const existing = settings.find(s => s.setting_key === setting.key)
      initialSettings[setting.key] = existing 
        ? (existing.setting_value as any)?.value ?? setting.defaultValue
        : setting.defaultValue
    })
    setLocalSettings(initialSettings)
  }, [settings])

  const handleToggle = async (key: string, value: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    setLoading(true)

    try {
      const { error } = await supabaseBrowser
        .from('website_settings')
        .upsert({
          site,
          setting_key: key,
          setting_value: { value },
        }, {
          onConflict: 'site,setting_key'
        })

      if (error) throw error

      toast({
        title: "Settings updated",
        description: "Website settings have been saved successfully.",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setLocalSettings(prev => ({ ...prev, [key]: !value }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {defaultSettings.map((setting) => (
        <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="space-y-0.5 flex-1">
            <Label htmlFor={setting.key} className="text-base font-semibold cursor-pointer">
              {setting.label}
            </Label>
            <p className="text-sm text-muted-foreground">{setting.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                id={setting.key}
                checked={localSettings[setting.key] ?? setting.defaultValue}
                onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                disabled={loading}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

