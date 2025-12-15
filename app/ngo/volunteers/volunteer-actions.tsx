"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  volunteer: {
    id: string
    status: string
  }
}

export function VolunteerActions({ volunteer }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [status, setStatus] = useState(volunteer.status)
  const router = useRouter()
  const { toast } = useToast()

  async function handleStatusChange(newStatus: string) {
    try {
      const { error } = await supabaseBrowser
        .from("volunteers")
        .update({ status: newStatus })
        .eq("id", volunteer.id)

      if (error) throw error

      setStatus(newStatus)
      toast({
        title: "Success",
        description: "Volunteer status updated",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  async function handleDelete() {
    try {
      const { error } = await supabaseBrowser
        .from("volunteers")
        .delete()
        .eq("id", volunteer.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Volunteer application deleted",
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
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
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
        title="Delete Volunteer Application"
        description="Are you sure you want to delete this volunteer application? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

