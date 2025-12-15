"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactInfoSchema, type ContactInfoFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: ContactInfoFormData) => Promise<void>
}

export function ContactInfoForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const [socials, setSocials] = useState<Record<string, string>>(
    initialData?.socials || {}
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData || {
      site,
      email: "",
      phone: "",
      address: "",
      map_embed_url: "",
      socials: {},
    },
  })

  function addSocial() {
    setSocials({ ...socials, "": "" })
  }

  function updateSocial(key: string, value: string) {
    const newSocials = { ...socials }
    if (value) {
      newSocials[key] = value
    } else {
      delete newSocials[key]
    }
    setSocials(newSocials)
    setValue("socials", newSocials)
  }

  async function onFormSubmit(data: ContactInfoFormData) {
    try {
      const submitData = { ...data, socials }
      await onSubmit(submitData)
      toast({
        title: "Success",
        description: "Contact info saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save contact info",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="contact@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="Street address"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="map_embed_url">Map Embed URL</Label>
        <Input
          id="map_embed_url"
          {...register("map_embed_url")}
          placeholder="https://www.google.com/maps/embed?..."
        />
      </div>

      <div className="space-y-2">
        <Label>Social Media Links</Label>
        {Object.entries(socials).map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Platform (e.g., twitter)"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value
                const newSocials = { ...socials }
                delete newSocials[key]
                if (newKey) newSocials[newKey] = value
                setSocials(newSocials)
                setValue("socials", newSocials)
              }}
            />
            <Input
              placeholder="URL"
              value={value}
              onChange={(e) => updateSocial(key, e.target.value)}
            />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addSocial} className="w-full">
          Add Social Link
        </Button>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

