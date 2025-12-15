import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTeamDialog } from "@/components/shared/create-team-dialog"
import { TeamActions } from "./team-actions"

export const dynamic = 'force-dynamic'

export default async function NGOTeamPage() {
  const adminUser = await requireAuth()

  const { data: teamMembers, error } = await fetchDataBySite(
    "team_members",
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
                <h1 className="text-3xl font-bold">NGO Team</h1>
                <p className="text-muted-foreground mt-2">
                  Manage team members for the NGO website
                </p>
              </div>
              <CreateTeamDialog
                site="ngo"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("team_members")
                    .insert(data)
                  
                  if (error) {
                    throw new Error(error.message)
                  }
                }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeamActions member={member} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No team members yet. Create one to get started.</p>
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
