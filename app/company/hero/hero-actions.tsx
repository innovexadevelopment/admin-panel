"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { HeroForm } from "@/components/forms/hero-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = {
  hero: any
}

export function HeroActions({ hero }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      // Delete image if exists
      if (hero.background_image_path) {
        await supabaseBrowser.storage
          .from("public-assets")
          .remove([hero.background_image_path])
      }

      const { error } = await supabaseBrowser
        .from("hero_sections")
        .delete()
        .eq("id", hero.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Hero section deleted",
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

  async function handleUpdate(data: any) {
    try {
      const { error } = await supabaseBrowser
        .from("hero_sections")
        .update(data)
        .eq("id", hero.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Hero section updated",
      })

      setEditOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hero Section</DialogTitle>
            </DialogHeader>
            <HeroForm
              site={hero.site}
              initialData={hero}
              onSubmit={handleUpdate}
            />
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
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
        title="Delete Hero Section"
        description="Are you sure you want to delete this hero section? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

