import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CareerForm } from "@/components/forms/career-form"
import { supabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/shared/page-wrapper"

export default async function EditCareerPage({
  params,
}: {
  params: { id: string }
}) {
  const adminUser = await requireAuth()

  const { data: career } = await supabaseServer
    .from("careers")
    .select("*")
    .eq("id", params.id)
    .eq("site", "company")
    .single()

  if (!career) {
    notFound()
  }

  async function handleSubmit(data: any) {
    "use server"
    const { error } = await supabaseServer
      .from("careers")
      .update(data)
      .eq("id", params.id)
    if (error) throw error
    redirect("/company/careers")
  }

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Edit Job Posting</h1>
              <p className="text-muted-foreground mt-2">
                Update job posting details
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerForm site="company" initialData={career} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

