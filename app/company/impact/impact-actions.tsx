"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ImpactForm } from "@/components/forms/impact-form"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = {
  stat: any
}

export function ImpactActions({ stat }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleUpdate(data: any) {
    try {
      const { error } = await supabaseBrowser
        .from("impact_stats")
        .update(data)
        .eq("id", stat.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Impact stat updated",
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
      const { error } = await supabaseBrowser
        .from("impact_stats")
        .delete()
        .eq("id", stat.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Impact stat deleted",
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
              <DialogTitle>Edit Impact Stat</DialogTitle>
            </DialogHeader>
            <ImpactForm
              site={stat.site}
              initialData={stat}
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
        title="Delete Impact Stat"
        description="Are you sure you want to delete this impact stat? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

