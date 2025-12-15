"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ServiceForm } from "@/components/forms/service-form"
import { ServiceFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export function CreateServiceDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: ServiceFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in ServiceForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Service</DialogTitle>
        </DialogHeader>
        <ServiceForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

