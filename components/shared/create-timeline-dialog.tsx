"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TimelineForm } from "@/components/forms/timeline-form"
import { TimelineItemFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: TimelineItemFormData) => Promise<void>
}

export function CreateTimelineDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: TimelineItemFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in TimelineForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Timeline Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Timeline Item</DialogTitle>
        </DialogHeader>
        <TimelineForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

