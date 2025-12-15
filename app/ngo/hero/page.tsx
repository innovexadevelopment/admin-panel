import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateHeroDialog } from "@/components/shared/create-hero-dialog"
import { HeroActions } from "@/app/company/hero/hero-actions"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function NGOHeroPage() {
  const adminUser = await requireAuth()

  const { data: heroSections, error } = await fetchDataBySite(
    "hero_sections",
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
                <h1 className="text-3xl font-bold">NGO Hero Sections</h1>
                <p className="text-muted-foreground mt-2">
                  Manage hero sections for the NGO website
                </p>
              </div>
              <CreateHeroDialog
                site="ngo"
                onSubmit={async (data) => {
                  "use server"
                  try {
                    const { data: result, error } = await supabaseServer
                      .from("hero_sections")
                      .insert(data)
                      .select()
                    
                    if (error) {
                      console.error('Supabase insert error:', error)
                      throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
                    }
                    
                    if (!result) {
                      throw new Error('No data returned from insert')
                    }
                  } catch (err: any) {
                    console.error('Server action error:', err)
                    throw err
                  }
                }}
              />
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading hero sections: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Hero Sections Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {heroSections && heroSections.length > 0 ? (
                heroSections.map((hero) => (
                  <Card key={hero.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {hero.background_image_path && (
                      <div className="relative h-48 w-full bg-muted">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${hero.background_image_path}`}
                          alt={hero.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{hero.title}</CardTitle>
                          <CardDescription className="text-sm">{hero.subtitle}</CardDescription>
                        </div>
                        <Badge 
                          variant={hero.is_active ? "default" : "secondary"}
                          className="ml-4"
                        >
                          {hero.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(hero.primary_cta_label || hero.secondary_cta_label) && (
                          <div className="flex flex-wrap gap-2">
                            {hero.primary_cta_label && (
                              <Badge variant="outline" className="text-xs">
                                Primary: {hero.primary_cta_label}
                              </Badge>
                            )}
                            {hero.secondary_cta_label && (
                              <Badge variant="outline" className="text-xs">
                                Secondary: {hero.secondary_cta_label}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Order: {hero.order_index}</span>
                          <span>Opacity: {hero.overlay_opacity}</span>
                        </div>
                        <HeroActions hero={hero} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-1">
                          {error ? "Failed to load hero sections" : "No hero sections yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error 
                            ? "Please check your database connection." 
                            : "Create your first hero section to get started."}
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
    </div>
  )
}
