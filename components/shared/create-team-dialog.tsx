"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeamForm } from "@/components/forms/team-form"
import { TeamMemberFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  onSubmit: (data: TeamMemberFormData) => Promise<void>
}

export function CreateTeamDialog({ site, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(data: TeamMemberFormData) {
    try {
      await onSubmit(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      // Error is already handled in TeamForm
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Team Member</DialogTitle>
        </DialogHeader>
        <TeamForm site={site} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

