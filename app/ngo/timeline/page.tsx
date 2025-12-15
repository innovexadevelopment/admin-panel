import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTimelineDialog } from "@/components/shared/create-timeline-dialog"
import { TimelineActions } from "./timeline-actions"

export const dynamic = 'force-dynamic'

export default async function NGOTimelinePage() {
  const adminUser = await requireAuth()

  const { data: timelineItems, error } = await fetchDataBySite(
    "timeline_items",
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
                <h1 className="text-3xl font-bold">NGO Timeline</h1>
                <p className="text-muted-foreground mt-2">
                  Manage timeline items for the NGO website
                </p>
              </div>
              <CreateTimelineDialog
                site="ngo"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("timeline_items")
                    .insert(data)
                  
                  if (error) {
                    throw new Error(error.message)
                  }
                }}
              />
            </div>

            <div className="grid gap-4">
              {timelineItems && timelineItems.length > 0 ? (
                timelineItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TimelineActions item={item} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No timeline items yet. Create one to get started.</p>
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

