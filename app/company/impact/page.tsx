import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateImpactDialog } from "@/components/shared/create-impact-dialog"
import { ImpactActions } from "./impact-actions"
import { Award, TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CompanyImpactPage() {
  const adminUser = await requireAuth()

  const { data: impactStats, error } = await fetchDataBySite(
    "impact_stats",
    "company",
    "order_index",
    true
  )

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Company Impact Stats</h1>
                <p className="text-muted-foreground mt-2">
                  Manage impact statistics for the company website
                </p>
              </div>
              <CreateImpactDialog
                site="company"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("impact_stats")
                    .insert(data)
                  
                  if (error) {
                    throw new Error(error.message)
                  }
                }}
              />
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading impact stats: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Impact Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {impactStats && impactStats.length > 0 ? (
                impactStats.map((stat) => (
                  <Card key={stat.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/20">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {stat.icon && (
                            <div className="text-3xl">{stat.icon}</div>
                          )}
                          <CardTitle className="text-lg">{stat.label}</CardTitle>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      {stat.value !== null && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">
                            {stat.value.toLocaleString()}
                          </span>
                          {stat.suffix && (
                            <span className="text-xl text-muted-foreground">{stat.suffix}</span>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {stat.description && (
                        <CardDescription className="text-sm mb-4">
                          {stat.description}
                        </CardDescription>
                      )}
                      <ImpactActions stat={stat} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <Award className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load impact stats" : "No impact stats yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first impact stat to get started."}
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
    </PageWrapper>
  )
}
