"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = {
  campaign: any
}

export function CampaignActions({ campaign }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      if (campaign.banner_image_path) {
        await supabaseBrowser.storage
          .from("public-assets")
          .remove([campaign.banner_image_path])
      }

      const { error } = await supabaseBrowser
        .from("campaigns")
        .delete()
        .eq("id", campaign.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Campaign deleted",
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
        <Link href={`/ngo/campaigns/${campaign.id}`}>
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
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}

