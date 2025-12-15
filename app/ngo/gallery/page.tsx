import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Button } from "@/components/ui/button"
import { Plus, Camera } from "lucide-react"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { GalleryTable } from "./gallery-table"
import { Card, CardContent } from "@/components/ui/card"
import { CreateGalleryDialog } from "@/components/shared/create-gallery-dialog"

export const dynamic = 'force-dynamic'

export default async function NGOGalleryPage() {
  const adminUser = await requireAuth()

  const { data: images, error } = await fetchDataBySite(
    "gallery_images",
    "ngo",
    "order_index",
    true
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">NGO Gallery</h1>
                <p className="text-muted-foreground mt-2">
                  Manage gallery images for the NGO website
                </p>
              </div>
              <CreateGalleryDialog
                site="ngo"
                onSubmit={async (data) => {
                  "use server"
                  const { error } = await supabaseServer
                    .from("gallery_images")
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
                  <p className="text-red-600 font-medium">Error loading gallery images: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Gallery Table */}
            {images && images.length > 0 ? (
              <Card className="border-0 shadow-sm">
                <GalleryTable images={images} />
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {error ? "Failed to load gallery images" : "No gallery images yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error 
                          ? "Please check your database connection." 
                          : "Create your first gallery image to get started."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
