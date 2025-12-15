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
  project: {
    id: string
    cover_image_path?: string | null
    gallery_image_paths?: string[] | null
  }
}

export function ProjectActions({ project }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      // Get project with image paths
      const { data: projectData } = await supabaseBrowser
        .from("projects")
        .select("cover_image_path, gallery_image_paths")
        .eq("id", project.id)
        .single()

      // Delete images
      const paths = [
        projectData?.cover_image_path,
        ...(projectData?.gallery_image_paths ?? []),
      ].filter(Boolean) as string[]

      if (paths.length > 0) {
        await supabaseBrowser.storage
          .from("public-assets")
          .remove(paths)
      }

      // Delete project
      const { error } = await supabaseBrowser
        .from("projects")
        .delete()
        .eq("id", project.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Project deleted",
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
        <Link href={`/company/projects/${project.id}`}>
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
        title="Delete Project"
        description="Are you sure you want to delete this project? All associated images will also be deleted. This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

