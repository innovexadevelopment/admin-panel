import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTimelineDialog } from "@/components/shared/create-timeline-dialog"
import { TimelineActions } from "./timeline-actions"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function CompanyTimelinePage() {
  const adminUser = await requireAuth()

  const { data: timelineItems, error } = await fetchDataBySite(
    "timeline_items",
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
                <h1 className="text-3xl font-bold">Company Timeline</h1>
                <p className="text-muted-foreground mt-2">
                  Manage timeline items for the company website
                </p>
              </div>
              <CreateTimelineDialog
                site="company"
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

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading timeline items: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Timeline Items */}
            <div className="space-y-4">
              {timelineItems && timelineItems.length > 0 ? (
                timelineItems.map((item, index) => (
                  <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                            {item.is_current && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                            {item.type && (
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                            )}
                          </div>
                          {item.subtitle && (
                            <CardDescription className="text-base mb-3">{item.subtitle}</CardDescription>
                          )}
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            {item.start_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(item.start_date).toLocaleDateString()}
                                  {item.end_date && !item.is_current && (
                                    <> - {new Date(item.end_date).toLocaleDateString()}</>
                                  )}
                                  {item.is_current && " - Present"}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Order: {item.order_index}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TimelineActions item={item} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load timeline items" : "No timeline items yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first timeline item to get started."}
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
