import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogForm } from "@/components/forms/blog-form"
import { supabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/shared/page-wrapper"

export default async function EditBlogPage({
  params,
}: {
  params: { id: string }
}) {
  const adminUser = await requireAuth()

  const { data: post } = await supabaseServer
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .eq("site", "ngo")
    .single()

  if (!post) {
    notFound()
  }

  async function handleSubmit(data: any) {
    "use server"
    const { error } = await supabaseServer
      .from("blog_posts")
      .update(data)
      .eq("id", params.id)
    if (error) throw error
    redirect("/ngo/blog")
  }

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={adminUser.email} role={adminUser.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Edit Blog Post</h1>
              <p className="text-muted-foreground mt-2">
                Update blog post details
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Blog Post Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogForm site="ngo" initialData={post} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

