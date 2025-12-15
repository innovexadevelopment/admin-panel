"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, type ServiceFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export function ServiceForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      site,
      title: "",
      short_description: "",
      long_description: "",
      icon: "",
      order_index: 0,
    },
  })

  async function onFormSubmit(data: ServiceFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Service saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save service",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Service Title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea
          id="short_description"
          {...register("short_description")}
          placeholder="Brief description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="long_description">Long Description</Label>
        <Textarea
          id="long_description"
          {...register("long_description")}
          placeholder="Detailed description"
          rows={6}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (emoji or name)</Label>
          <Input
            id="icon"
            {...register("icon")}
            placeholder="🚀 or rocket"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_index">Order Index</Label>
          <Input
            id="order_index"
            type="number"
            {...register("order_index", { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

