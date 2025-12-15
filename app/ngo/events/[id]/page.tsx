import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventForm } from "@/components/forms/event-form"
import { supabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/shared/page-wrapper"

export default async function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  const adminUser = await requireAuth()

  const { data: event } = await supabaseServer
    .from("events")
    .select("*")
    .eq("id", params.id)
    .eq("site", "ngo")
    .single()

  if (!event) {
    notFound()
  }

  async function handleSubmit(data: any) {
    "use server"
    const { error } = await supabaseServer
      .from("events")
      .update(data)
      .eq("id", params.id)
    if (error) throw error
    redirect("/ngo/events")
  }

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Edit Event</h1>
              <p className="text-muted-foreground mt-2">
                Update event details
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <EventForm site="ngo" initialData={event} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

