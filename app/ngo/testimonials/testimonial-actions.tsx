"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { TestimonialForm } from "@/components/forms/testimonial-form"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = {
  testimonial: any
}

export function TestimonialActions({ testimonial }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleUpdate(data: any) {
    try {
      const { error } = await supabaseBrowser
        .from("testimonials")
        .update(data)
        .eq("id", testimonial.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Testimonial updated",
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

  async function handleDelete() {
    try {
      if (testimonial.avatar_image_path) {
        await supabaseBrowser.storage
          .from("public-assets")
          .remove([testimonial.avatar_image_path])
      }

      const { error } = await supabaseBrowser
        .from("testimonials")
        .delete()
        .eq("id", testimonial.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Testimonial deleted",
      })

      setDeleteOpen(false)
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
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialForm
              site={testimonial.site}
              initialData={testimonial}
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
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

