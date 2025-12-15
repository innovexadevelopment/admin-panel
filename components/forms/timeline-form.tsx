"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { timelineItemSchema, type TimelineItemFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: TimelineItemFormData) => Promise<void>
}

export function TimelineForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TimelineItemFormData>({
    resolver: zodResolver(timelineItemSchema),
    defaultValues: initialData || {
      site,
      title: "",
      subtitle: "",
      location: "",
      description: "",
      start_date: null,
      end_date: null,
      is_current: false,
      type: "",
      order_index: 0,
    },
  })

  const isCurrent = watch("is_current")

  async function onFormSubmit(data: TimelineItemFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Timeline item saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save timeline item",
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
          placeholder="Timeline Title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          {...register("subtitle")}
          placeholder="Subtitle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location")}
          placeholder="Location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description"
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
            disabled={isCurrent}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            {...register("type")}
            placeholder="e.g., experience, milestone"
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

      <div className="flex items-center space-x-2">
        <Switch
          id="is_current"
          checked={isCurrent}
          onCheckedChange={(checked) => setValue("is_current", checked)}
        />
        <Label htmlFor="is_current">Current/Ongoing</Label>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

