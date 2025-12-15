import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CampaignActions } from "./campaign-actions"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function NGOCampaignsPage() {
  const adminUser = await requireAuth()

  const { data: campaigns, error } = await fetchDataBySite(
    "campaigns",
    "ngo",
    "created_at",
    false
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">NGO Campaigns</h1>
                <p className="text-muted-foreground mt-2">
                  Manage campaigns for the NGO website
                </p>
              </div>
              <Link href="/ngo/campaigns/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading campaigns: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Campaigns Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => {
                  const progress = campaign.goal_amount 
                    ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
                    : 0
                  
                  return (
                    <Card key={campaign.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {campaign.banner_image_path && (
                        <div className="relative h-48 w-full bg-muted">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${campaign.banner_image_path}`}
                            alt={campaign.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
                            <CardDescription className="text-sm">{campaign.short_description}</CardDescription>
                          </div>
                          <Badge 
                            variant={campaign.is_active ? "default" : "secondary"}
                            className="ml-4"
                          >
                            {campaign.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {campaign.goal_amount && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{progress.toFixed(1)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-semibold text-green-600">
                                    ${(campaign.raised_amount || 0).toLocaleString()}
                                  </span>
                                  <span className="text-muted-foreground">raised</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  of ${campaign.goal_amount.toLocaleString()} goal
                                </div>
                              </div>
                            </div>
                          )}
                          <CampaignActions campaign={campaign} />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card className="md:col-span-2 border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load campaigns" : "No campaigns yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first campaign to get started."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
