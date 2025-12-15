"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { impactStatSchema, type ImpactStatFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: ImpactStatFormData) => Promise<void>
}

export function ImpactForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ImpactStatFormData>({
    resolver: zodResolver(impactStatSchema),
    defaultValues: initialData || {
      site,
      label: "",
      value: null,
      suffix: "",
      description: "",
      icon: "",
      order_index: 0,
    },
  })

  async function onFormSubmit(data: ImpactStatFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Impact stat saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save impact stat",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="label">Label *</Label>
        <Input
          id="label"
          {...register("label")}
          placeholder="e.g., Projects Completed"
        />
        {errors.label && (
          <p className="text-sm text-destructive">{errors.label.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            {...register("value", { valueAsNumber: true })}
            placeholder="123"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suffix">Suffix</Label>
          <Input
            id="suffix"
            {...register("suffix")}
            placeholder="e.g., +, %, K"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (emoji or name)</Label>
          <Input
            id="icon"
            {...register("icon")}
            placeholder="🎯 or target"
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

