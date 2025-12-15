import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeCard } from "@/components/shared/theme-card"
import { SiteThemeWrapper } from "@/components/shared/site-theme-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { Settings, Building2, Heart, ToggleLeft, ToggleRight } from "lucide-react"
import { WebsiteSettingsForm } from "@/components/settings/website-settings-form"

async function getWebsiteSettings() {
  const { data: companySettings } = await supabaseServer
    .from('website_settings')
    .select('*')
    .eq('site', 'company')

  const { data: ngoSettings } = await supabaseServer
    .from('website_settings')
    .select('*')
    .eq('site', 'ngo')

  return {
    company: companySettings || [],
    ngo: ngoSettings || [],
  }
}

export default async function SettingsPage() {
  // Auth disabled
  const adminUser = { email: 'admin@example.com', role: 'superadmin' as const }
  const settings = await getWebsiteSettings()

  // Helper to get setting value
  const getSetting = (siteSettings: any[], key: string, defaultValue: boolean = false) => {
    const setting = siteSettings.find(s => s.setting_key === key)
    return setting ? (setting.setting_value as any)?.value ?? defaultValue : defaultValue
  }

  return (
    <SiteThemeWrapper className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Website Settings</h1>
              <p className="text-muted-foreground">Configure website toggles and preferences</p>
            </div>

            {/* INNOVEXA Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-bold">INNOVEXA (Company)</CardTitle>
                </div>
                <CardDescription>Manage company website settings and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteSettingsForm site="company" settings={settings.company} />
              </CardContent>
            </Card>

            {/* DUAF Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <Heart className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-bold">DUAF (NGO)</CardTitle>
                </div>
                <CardDescription>Manage NGO website settings and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteSettingsForm site="ngo" settings={settings.ngo} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SiteThemeWrapper>
  )
}

