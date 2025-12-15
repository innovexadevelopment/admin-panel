import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeCard } from "@/components/shared/theme-card"
import { SiteThemeWrapper } from "@/components/shared/site-theme-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { TrendingUp, Eye, MessageSquare, Users, Calendar, BarChart3 } from "lucide-react"

async function getAnalytics() {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Page views
  const { data: allPageViews } = await supabaseServer
    .from('page_views')
    .select('*')

  const { data: last30DaysViews } = await supabaseServer
    .from('page_views')
    .select('*')
    .gte('created_at', last30Days.toISOString())

  const { data: last7DaysViews } = await supabaseServer
    .from('page_views')
    .select('*')
    .gte('created_at', last7Days.toISOString())

  // Form submissions
  const { data: allSubmissions } = await supabaseServer
    .from('form_submissions')
    .select('*')

  const { data: last30DaysSubmissions } = await supabaseServer
    .from('form_submissions')
    .select('*')
    .gte('created_at', last30Days.toISOString())

  // Contact messages
  const { data: allMessages } = await supabaseServer
    .from('contact_messages')
    .select('*')

  const { data: newMessages } = await supabaseServer
    .from('contact_messages')
    .select('*')
    .eq('status', 'new')

  // Per-site stats
  const companyViews = allPageViews?.filter(v => v.site === 'company').length || 0
  const ngoViews = allPageViews?.filter(v => v.site === 'ngo').length || 0
  const companySubmissions = allSubmissions?.filter(s => s.site === 'company').length || 0
  const ngoSubmissions = allSubmissions?.filter(s => s.site === 'ngo').length || 0

  return {
    totalPageViews: allPageViews?.length || 0,
    last30DaysViews: last30DaysViews?.length || 0,
    last7DaysViews: last7DaysViews?.length || 0,
    totalSubmissions: allSubmissions?.length || 0,
    last30DaysSubmissions: last30DaysSubmissions?.length || 0,
    totalMessages: allMessages?.length || 0,
    newMessages: newMessages?.length || 0,
    companyViews,
    ngoViews,
    companySubmissions,
    ngoSubmissions,
  }
}

export default async function AnalyticsPage() {
  // Auth disabled
  const adminUser = { email: 'admin@example.com', role: 'superadmin' as const }
  const analytics = await getAnalytics()

  const stats = [
    {
      title: "Total Page Views",
      value: analytics.totalPageViews,
      change: analytics.last30DaysViews > 0 ? `+${analytics.last30DaysViews} (30d)` : "No data",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Form Submissions",
      value: analytics.totalSubmissions,
      change: analytics.last30DaysSubmissions > 0 ? `+${analytics.last30DaysSubmissions} (30d)` : "No data",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Contact Messages",
      value: analytics.totalMessages,
      change: analytics.newMessages > 0 ? `${analytics.newMessages} new` : "All read",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Last 7 Days Views",
      value: analytics.last7DaysViews,
      change: "Recent activity",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <SiteThemeWrapper className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Overview of website performance and engagement</p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <ThemeCard key={stat.title} className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </CardTitle>
                      <div className={`${stat.bgColor} p-3 rounded-xl`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                  </ThemeCard>
                )
              })}
            </div>

            {/* Per-Site Stats */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">INNOVEXA (Company)</CardTitle>
                  </div>
                  <CardDescription>Company website analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5">
                    <span className="font-medium">Page Views</span>
                    <span className="text-2xl font-bold text-primary">{analytics.companyViews}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5">
                    <span className="font-medium">Form Submissions</span>
                    <span className="text-2xl font-bold text-primary">{analytics.companySubmissions}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">DUAF (NGO)</CardTitle>
                  </div>
                  <CardDescription>NGO website analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-red-500/5">
                    <span className="font-medium">Page Views</span>
                    <span className="text-2xl font-bold text-red-500">{analytics.ngoViews}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-red-500/5">
                    <span className="font-medium">Form Submissions</span>
                    <span className="text-2xl font-bold text-red-500">{analytics.ngoSubmissions}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SiteThemeWrapper>
  )
}

