import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/auth"
import { UserPlus } from "lucide-react"
import { VolunteersTable } from "./volunteers-table"

export const dynamic = "force-dynamic"

export default async function NgoVolunteersPage() {
  const adminUser = await requireAuth()

  const { data: volunteers, error } = await supabaseServer
    .from("volunteers")
    .select("*")
    .eq("site", "ngo")
    .order("created_at", { ascending: false })

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Volunteers</h1>
              <p className="text-muted-foreground mt-2">Manage volunteer applications for the NGO site</p>
            </div>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-4 text-red-600">
                  Error loading volunteers: {error.message}
                </CardContent>
              </Card>
            )}

            {volunteers && volunteers.length > 0 ? (
              <Card className="border-0 shadow-sm">
                <VolunteersTable volunteers={volunteers} />
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <UserPlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {error ? "Failed to load volunteers" : "No volunteer applications yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error 
                          ? "Please check your database connection." 
                          : "Volunteer applications will appear here."}
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

