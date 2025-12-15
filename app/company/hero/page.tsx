import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDataBySite } from "@/lib/data-fetch"
import { CreateHeroDialog } from "@/components/shared/create-hero-dialog"
import { HeroActions } from "./hero-actions"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, CheckCircle2, XCircle, Sparkles, ArrowRight, Eye, Settings } from "lucide-react"
import Image from "next/image"
import { supabaseServer } from "@/lib/supabase-server"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const dynamic = 'force-dynamic'

export default async function CompanyHeroPage() {
  const adminUser = await requireAuth()

  const { data: finalHeroSections, error } = await fetchDataBySite(
    "hero_sections",
    "company",
    "order_index",
    true
  )

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/5">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Hero Sections
                    </h1>
                    <p className="text-base text-muted-foreground mt-1.5 font-medium">
                      Manage hero sections for the company website
                    </p>
                  </div>
                </div>
                {finalHeroSections && finalHeroSections.length > 0 && (
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">
                        {finalHeroSections.length} {finalHeroSections.length === 1 ? 'section' : 'sections'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {finalHeroSections.filter(h => h.is_active).length} active
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <CreateHeroDialog
                site="company"
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
            {finalHeroSections && finalHeroSections.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {finalHeroSections.map((hero) => (
                  <Card 
                    key={hero.id} 
                    className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  >
                    {/* Image Section */}
                    {hero.background_image_path ? (
                      <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${hero.background_image_path}`}
                          alt={hero.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <Badge 
                            variant={hero.is_active ? "default" : "secondary"}
                            className="shadow-lg backdrop-blur-sm"
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
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg line-clamp-1">
                            {hero.title}
                          </h3>
                          {hero.subtitle && (
                            <p className="text-white/90 text-sm line-clamp-2 drop-shadow">
                              {hero.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-56 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <div className="text-center p-4">
                          <ImageIcon className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">{hero.title}</p>
                          {hero.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{hero.subtitle}</p>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge 
                            variant={hero.is_active ? "default" : "secondary"}
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
                      </div>
                    )}

                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* CTAs */}
                        {(hero.primary_cta_label || hero.secondary_cta_label) && (
                          <div className="flex flex-wrap gap-2">
                            {hero.primary_cta_label && (
                              <Badge variant="outline" className="text-xs font-medium">
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {hero.primary_cta_label}
                              </Badge>
                            )}
                            {hero.secondary_cta_label && (
                              <Badge variant="outline" className="text-xs font-medium">
                                {hero.secondary_cta_label}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              Order: {hero.order_index}
                            </span>
                            <span>Opacity: {Number(hero.overlay_opacity || 0.4).toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                          <HeroActions hero={hero} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="p-5 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <ImageIcon className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {error ? "Failed to load hero sections" : "No hero sections yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {error 
                          ? "Please check your database connection and try again." 
                          : "Get started by creating your first hero section to showcase your company."}
                      </p>
                      {!error && (
                        <CreateHeroDialog
                          site="company"
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
                      )}
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
