import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeCard } from "@/components/shared/theme-card"
import { Building2, Heart, MessageSquare, FileText, Users, Award, Camera, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getCountBySite, getTotalCount } from "@/lib/data-fetch-utils"
import { fetchAllData } from "@/lib/data-fetch-utils"
import { SiteThemeWrapper } from "@/components/shared/site-theme-wrapper"
import { WelcomeSection } from "@/components/shared/welcome-section"

export default async function DashboardPage() {
  // Auth disabled - admin panel accessible to all
  const adminUser = { email: 'admin@example.com', role: 'superadmin' as const }

  // Get counts for dashboard - using helper functions to ensure we get accurate counts
  const [
    companyHeroCount, 
    ngoHeroCount, 
    newMessagesCount, 
    projectsCount,
    servicesCount,
    teamMembersCount,
    testimonialsCount,
    campaignsCount,
    galleryImagesCount
  ] = await Promise.all([
    getCountBySite("hero_sections", "company"),
    getCountBySite("hero_sections", "ngo"),
    (async () => {
      // For messages, we need to filter by status AND site
      const { data: allMessages } = await fetchAllData("contact_messages")
      if (!allMessages) return 0
      return allMessages.filter((m: any) => 
        String(m.status || '').toLowerCase() === 'new'
      ).length
    })(),
    getTotalCount("projects"),
    getTotalCount("services"),
    getTotalCount("team_members"),
    getTotalCount("testimonials"),
    getTotalCount("campaigns"),
    getTotalCount("gallery_images"),
  ])

  const stats = [
    {
      title: "New Messages",
      value: newMessagesCount,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12.5%",
      changeType: "positive" as const,
      description: "Unread messages"
    },
    {
      title: "Total Projects",
      value: projectsCount,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+28.42%",
      changeType: "positive" as const,
      description: "All projects"
    },
    {
      title: "Team Members",
      value: teamMembersCount,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15.3%",
      changeType: "positive" as const,
      description: "Active team"
    },
    {
      title: "Campaigns",
      value: campaignsCount,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+8.2%",
      changeType: "positive" as const,
      description: "Active campaigns"
    },
  ]

  return (
    <SiteThemeWrapper className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <WelcomeSection adminUser={adminUser} />

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <ThemeCard 
                    key={stat.title} 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover group overflow-hidden relative"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                      <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </CardTitle>
                      <div className={`${stat.bgColor} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                          <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          stat.changeType === "positive" 
                            ? "text-green-700 bg-green-50 border border-green-200" 
                            : "text-red-700 bg-red-50 border border-red-200"
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                    </CardContent>
                  </ThemeCard>
                )
              })}
            </div>

            {/* Content Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">Company Content</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Manage company website content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 group/item hover:from-primary/10 hover:to-primary/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Hero Sections</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm">{companyHeroCount}</span>
                  </div>
                  <Link href="/company/services" className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover/item:bg-primary/10 transition-colors">
                        <FileText className="h-4 w-4 text-slate-600 group-hover/item:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium">Services</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-sm font-bold group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all">{servicesCount}</span>
                  </Link>
                  <Link href="/company/team" className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover/item:bg-primary/10 transition-colors">
                        <Users className="h-4 w-4 text-slate-600 group-hover/item:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium">Team Members</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-sm font-bold group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all">{teamMembersCount}</span>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover bg-gradient-to-br from-white to-red-50/30 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25">
                      <Heart className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">NGO Content</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Manage NGO website content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/5 to-red-500/10 border border-red-500/20 group/item hover:from-red-500/10 hover:to-red-500/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm font-medium">Hero Sections</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-bold shadow-sm">{ngoHeroCount}</span>
                  </div>
                  <Link href="/ngo/campaigns" className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 hover:from-red-500/5 hover:to-red-500/10 hover:border-red-500/20 transition-all duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover/item:bg-red-500/10 transition-colors">
                        <DollarSign className="h-4 w-4 text-slate-600 group-hover/item:text-red-500 transition-colors" />
                      </div>
                      <span className="text-sm font-medium">Campaigns</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-sm font-bold group-hover/item:bg-red-500 group-hover/item:text-white transition-all">{campaignsCount}</span>
                  </Link>
                  <Link href="/ngo/gallery" className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 hover:from-red-500/5 hover:to-red-500/10 hover:border-red-500/20 transition-all duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover/item:bg-red-500/10 transition-colors">
                        <Camera className="h-4 w-4 text-slate-600 group-hover/item:text-red-500 transition-colors" />
                      </div>
                      <span className="text-sm font-medium">Gallery Images</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-sm font-bold group-hover/item:bg-red-500 group-hover/item:text-white transition-all">{galleryImagesCount}</span>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25">
                      <FileText className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Common management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 relative z-10">
                  <Link href="/company/messages" className="block p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300 text-sm font-medium group/item">
                    <div className="flex items-center justify-between">
                      <span>View New Messages</span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold">{newMessagesCount}</span>
                    </div>
                  </Link>
                  <Link href="/company/projects/new" className="block p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all duration-300 text-sm font-medium">
                    Create New Project
                  </Link>
                  <Link href="/ngo/campaigns/new" className="block p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 transition-all duration-300 text-sm font-medium">
                    Create New Campaign
                  </Link>
                  <Link href="/company/testimonials" className="block p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-300 text-sm font-medium group/item">
                    <div className="flex items-center justify-between">
                      <span>Manage Testimonials</span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500 text-white text-xs font-bold">{testimonialsCount}</span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SiteThemeWrapper>
  )
}

