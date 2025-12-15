import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { ServicesTable } from "./services-table"
import { CreateServiceDialog } from "@/components/shared/create-service-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CompanyServicesPage() {
  const adminUser = await requireAuth()

  const { data: services, error } = await fetchDataBySite(
    "services",
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
                <h1 className="text-3xl font-bold">Company Services</h1>
                <p className="text-muted-foreground mt-2">
                  Manage services for the company website
                </p>
              </div>
              <CreateServiceDialog
                site="company"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("services")
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
                  <p className="text-red-600 font-medium">Error loading services: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Services Table */}
            {services && services.length > 0 ? (
              <Card className="border-0 shadow-sm">
                <ServicesTable services={services} />
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {error ? "Failed to load services" : "No services yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error 
                          ? "Please check your database connection." 
                          : "Create your first service to get started."}
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
