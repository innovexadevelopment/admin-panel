import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { supabaseServer } from "@/lib/supabase-server"
import { fetchDataBySite } from "@/lib/data-fetch"
import { MessagesTable } from "./messages-table"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CompanyMessagesPage() {
  const adminUser = await requireAuth()

  const { data: messages, error } = await fetchDataBySite(
    "contact_messages",
    "company",
    "created_at",
    false
  )

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Contact Messages</h1>
              <p className="text-muted-foreground mt-2">
                Manage messages from the company website
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6 text-center">
                  <p className="text-red-600 font-medium">Error loading messages: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Messages Table */}
            {messages && messages.length > 0 ? (
              <Card className="border-0 shadow-sm">
                <MessagesTable messages={messages} />
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {error ? "Failed to load messages" : "No messages yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error 
                          ? "Please check your database connection." 
                          : "Messages from your contact form will appear here."}
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
