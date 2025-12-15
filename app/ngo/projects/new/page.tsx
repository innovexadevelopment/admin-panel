import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectForm } from "@/components/forms/project-form"
import { supabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function NewNGOProjectPage() {
  const adminUser = await requireAuth()

  async function handleSubmit(data: any) {
    "use server"
    const { error } = await supabaseServer
      .from("projects")
      .insert(data)
    if (error) throw error
    redirect("/ngo/projects")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">New Project</h1>
              <p className="text-muted-foreground mt-2">
                Create a new project for the NGO website
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectForm site="ngo" onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

