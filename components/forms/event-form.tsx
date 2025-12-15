"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventSchema, type EventFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/shared/image-uploader"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: EventFormData) => Promise<void>
}

export function EventForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      site,
      title: "",
      slug: "",
      description: "",
      short_description: "",
      start_date: "",
      end_date: null,
      location: "",
      location_url: "",
      cover_image_path: null,
      registration_url: "",
      is_featured: false,
      is_active: true,
    },
  })

  const coverImagePath = watch("cover_image_path")
  const isFeatured = watch("is_featured")
  const isActive = watch("is_active")

  async function onFormSubmit(data: EventFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: initialData ? "Event updated" : "Event created",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Event title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="event-slug"
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea
          id="short_description"
          {...register("short_description")}
          placeholder="Brief description for preview"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Full event description"
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date & Time *</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...register("start_date")}
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date & Time</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...register("end_date")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Event location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_url">Location URL</Label>
          <Input
            id="location_url"
            {...register("location_url")}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registration_url">Registration URL</Label>
        <Input
          id="registration_url"
          {...register("registration_url")}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUploader
          currentImagePath={coverImagePath}
          onImageUploaded={(path) => setValue("cover_image_path", path)}
          onImageRemoved={() => setValue("cover_image_path", null)}
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={isFeatured}
            onCheckedChange={(checked) => setValue("is_featured", checked)}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked) => setValue("is_active", checked)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}

