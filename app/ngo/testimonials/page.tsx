import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTestimonialDialog } from "@/components/shared/create-testimonial-dialog"
import { TestimonialActions } from "./testimonial-actions"

export const dynamic = 'force-dynamic'

export default async function NGOTestimonialsPage() {
  const adminUser = await requireAuth()

  const { data: testimonials, error } = await fetchDataBySite(
    "testimonials",
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
                <h1 className="text-3xl font-bold">NGO Testimonials</h1>
                <p className="text-muted-foreground mt-2">
                  Manage testimonials for the NGO website
                </p>
              </div>
              <CreateTestimonialDialog
                site="ngo"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("testimonials")
                    .insert(data)
                  
                  if (error) {
                    throw new Error(error.message)
                  }
                }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardHeader>
                      <CardTitle>{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.role} {testimonial.organization && `at ${testimonial.organization}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">"{testimonial.quote}"</p>
                      <TestimonialActions testimonial={testimonial} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No testimonials yet. Create one to get started.</p>
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
