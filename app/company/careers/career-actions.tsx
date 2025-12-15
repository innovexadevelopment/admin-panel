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
  career: {
    id: string
  }
}

export function CareerActions({ career }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      const { error } = await supabaseBrowser
        .from("careers")
        .delete()
        .eq("id", career.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Job posting deleted",
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
        <Link href={`/company/careers/${career.id}`}>
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
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

