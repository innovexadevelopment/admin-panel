"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ContactInfoForm } from "@/components/forms/contact-info-form"
import { ContactInfoFormData } from "@/lib/validators"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: ContactInfoFormData) => Promise<void>
}

export function ContactInfoEditor({ site, initialData, onSubmit }: Props) {
  const router = useRouter()

  async function handleSubmit(data: ContactInfoFormData) {
    await onSubmit(data)
    router.refresh()
  }

  return <ContactInfoForm site={site} initialData={initialData} onSubmit={handleSubmit} />
}

