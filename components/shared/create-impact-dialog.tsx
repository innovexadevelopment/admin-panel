"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ImpactForm } from "@/components/forms/impact-form"
import { ImpactStatFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: ImpactStatFormData) => Promise<void>
}

export function CreateImpactDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: ImpactStatFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in ImpactForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Impact Stat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Impact Stat</DialogTitle>
        </DialogHeader>
        <ImpactForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

