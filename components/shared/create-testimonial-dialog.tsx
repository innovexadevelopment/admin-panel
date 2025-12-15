"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TestimonialForm } from "@/components/forms/testimonial-form"
import { TestimonialFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: TestimonialFormData) => Promise<void>
}

export function CreateTestimonialDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: TestimonialFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in TestimonialForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Testimonial</DialogTitle>
        </DialogHeader>
        <TestimonialForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

