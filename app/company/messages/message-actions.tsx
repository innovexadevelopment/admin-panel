"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Archive, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabaseBrowser } from "@/lib/supabase-browser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  message: {
    id: string
    name: string
    email: string
    subject: string | null
    message: string
    status: "new" | "seen" | "replied" | "archived"
  }
}

export function MessageActions({ message }: Props) {
  const [viewOpen, setViewOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function updateStatus(status: "seen" | "replied" | "archived") {
    try {
      const { error } = await supabaseBrowser
        .from("contact_messages")
        .update({ status })
        .eq("id", message.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Message marked as ${status}`,
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

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setViewOpen(true)
            if (message.status === "new") {
              updateStatus("seen")
            }
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        {message.status !== "replied" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStatus("replied")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Mark Replied
          </Button>
        )}
        {message.status !== "archived" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStatus("archived")}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        )}
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">From:</p>
              <p className="text-sm">{message.name} ({message.email})</p>
            </div>
            {message.subject && (
              <div>
                <p className="text-sm font-medium">Subject:</p>
                <p className="text-sm">{message.subject}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Message:</p>
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <p className="text-sm capitalize">{message.status}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

