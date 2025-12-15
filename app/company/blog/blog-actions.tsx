"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import Link from "next/link"

type Props = {
  post: {
    id: string
    featured_image_path?: string | null
  }
}

export function BlogActions({ post }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      // Get post with image path
      const { data: postData } = await supabaseBrowser
        .from("blog_posts")
        .select("featured_image_path")
        .eq("id", post.id)
        .single()

      // Delete image if exists
      if (postData?.featured_image_path) {
        await supabaseBrowser.storage
          .from("public-assets")
          .remove([postData.featured_image_path])
      }

      // Delete post
      const { error } = await supabaseBrowser
        .from("blog_posts")
        .delete()
        .eq("id", post.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Blog post deleted",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link href={`/company/blog/${post.id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

