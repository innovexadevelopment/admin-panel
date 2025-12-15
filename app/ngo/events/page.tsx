import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { EventsTable } from "./events-table"

export const dynamic = "force-dynamic"

export default async function NgoEventsPage() {
  const adminUser = await requireAuth()

  const { data: events, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("site", "ngo")
    .order("start_date", { ascending: true })

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">NGO Events</h1>
                <p className="text-muted-foreground mt-2">Manage events for the NGO site</p>
              </div>
              <Link href="/ngo/events/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Event
                </Button>
              </Link>
            </div>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-4 text-red-600">
                  Error loading events: {error.message}
                </CardContent>
              </Card>
            )}

            {events && events.length > 0 ? (
              <Card className="border-0 shadow-sm">
                <EventsTable events={events} />
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {error ? "Failed to load events" : "No events yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error 
                          ? "Please check your database connection." 
                          : "Create your first event to get started."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

