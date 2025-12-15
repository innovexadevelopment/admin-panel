import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateImpactDialog } from "@/components/shared/create-impact-dialog"
import { ImpactActions } from "./impact-actions"

export const dynamic = 'force-dynamic'

export default async function NGOImpactPage() {
  const adminUser = await requireAuth()

  const { data: impactStats, error } = await fetchDataBySite(
    "impact_stats",
    "ngo",
    "order_index",
    true
  )

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">NGO Impact Stats</h1>
                <p className="text-muted-foreground mt-2">
                  Manage impact statistics for the NGO website
                </p>
              </div>
              <CreateImpactDialog
                site="ngo"
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {impactStats && impactStats.length > 0 ? (
                impactStats.map((stat) => (
                  <Card key={stat.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {stat.icon && <span>{stat.icon}</span>}
                        {stat.label}
                      </CardTitle>
                      <CardDescription>
                        {stat.value !== null && (
                          <span className="text-2xl font-bold">
                            {stat.value}
                            {stat.suffix}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stat.description && (
                        <p className="text-sm text-muted-foreground mb-4">{stat.description}</p>
                      )}
                      <ImpactActions stat={stat} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No impact stats yet. Create one to get started.</p>
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
