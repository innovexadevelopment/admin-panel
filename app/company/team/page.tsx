import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTeamDialog } from "@/components/shared/create-team-dialog"
import { TeamActions } from "./team-actions"
import { Users, User } from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function CompanyTeamPage() {
  const adminUser = await requireAuth()

  const { data: teamMembers, error } = await fetchDataBySite(
    "team_members",
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
                <h1 className="text-3xl font-bold">Company Team</h1>
                <p className="text-muted-foreground mt-2">
                  Manage team members for the company website
                </p>
              </div>
              <CreateTeamDialog
                site="company"
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

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading team members: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Team Members Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <Card key={member.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        {member.avatar_image_path ? (
                          <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${member.avatar_image_path}`}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                            <User className="h-12 w-12 text-primary" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-base font-medium text-primary">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mb-4 text-center line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      <div className="flex justify-center">
                        <TeamActions member={member} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load team members" : "No team members yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first team member to get started."}
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
