"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { HeroForm } from "@/components/forms/hero-form"
import { HeroSectionFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: HeroSectionFormData) => Promise<void>
}

export function CreateHeroDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: HeroSectionFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in HeroForm
      // Just keep dialog open on error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm hover:shadow-md transition-shadow">
          <Plus className="mr-2 h-4 w-4" />
          New Hero Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Hero Section</DialogTitle>
        </DialogHeader>
        <HeroForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

