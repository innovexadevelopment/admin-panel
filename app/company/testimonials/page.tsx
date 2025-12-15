import { requireAuth } from "@/lib/auth"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateTestimonialDialog } from "@/components/shared/create-testimonial-dialog"
import { TestimonialActions } from "./testimonial-actions"
import { MessageSquare, Quote } from "lucide-react"
import Image from "next/image"
import { User } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CompanyTestimonialsPage() {
  const adminUser = await requireAuth()

  const { data: testimonials, error } = await fetchDataBySite(
    "testimonials",
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
                <h1 className="text-3xl font-bold">Company Testimonials</h1>
                <p className="text-muted-foreground mt-2">
                  Manage testimonials for the company website
                </p>
              </div>
              <CreateTestimonialDialog
                site="company"
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

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading testimonials: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Testimonials Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {testimonial.avatar_image_path ? (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-md">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${testimonial.avatar_image_path}`}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-background shadow-md">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{testimonial.name}</CardTitle>
                          <CardDescription>
                            {testimonial.role} {testimonial.organization && `at ${testimonial.organization}`}
                          </CardDescription>
                        </div>
                        <Quote className="h-6 w-6 text-primary/20 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <TestimonialActions testimonial={testimonial} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load testimonials" : "No testimonials yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first testimonial to get started."}
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
