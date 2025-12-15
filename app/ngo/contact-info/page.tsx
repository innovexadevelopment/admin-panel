import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchSingleBySite } from "@/lib/data-fetch"
import { ContactInfoEditor } from "./contact-info-editor"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function NGOContactInfoPage() {
  const adminUser = await requireAuth()

  const { data: contactInfo, error } = await fetchSingleBySite(
    "contact_info",
    "ngo"
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">NGO Contact Info</h1>
              <p className="text-muted-foreground mt-2">
                Manage contact information for the NGO website
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading contact info: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Info Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactInfo ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {contactInfo.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                          </div>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {contactInfo.address && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                        </div>
                      </div>
                    )}
                    {contactInfo.socials && Object.keys(contactInfo.socials).length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Social Media
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(contactInfo.socials).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <ContactInfoEditor
                      site="ngo"
                      initialData={contactInfo}
                      onSubmit={async (data) => {
                        "use server"
                        const { error } = await supabaseServer
                          .from("contact_info")
                          .update(data)
                          .eq("id", contactInfo.id)
                        
                        if (error) {
                          throw new Error(error.message)
                        }
                      }}
                    />
                  </div>
                ) : (
                  <ContactInfoEditor
                    site="ngo"
                    onSubmit={async (data) => {
                      "use server"
                      const { error } = await supabaseServer
                        .from("contact_info")
                        .insert(data)
                      
                      if (error) {
                        throw new Error(error.message)
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
