"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GalleryForm } from "@/components/forms/gallery-form"
import { GalleryImageFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: GalleryImageFormData) => Promise<void>
}

export function CreateGalleryDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: GalleryImageFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in GalleryForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Gallery Image</DialogTitle>
        </DialogHeader>
        <GalleryForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

