"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { galleryImageSchema, type GalleryImageFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/shared/image-uploader"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Props = {
  site: "company" | "ngo"
  initialData?: any
  onSubmit: (data: GalleryImageFormData) => Promise<void>
}

export function GalleryForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<GalleryImageFormData>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: initialData || {
      site,
      title: "",
      description: "",
      image_path: "",
      taken_at: null,
      order_index: 0,
    },
  })

  const imagePath = watch("image_path")

  async function onFormSubmit(data: GalleryImageFormData) {
    if (!data.image_path) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      })
      return
    }

    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Gallery image saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save gallery image",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Image Title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Image description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Image *</Label>
        <ImageUploader
          site={site}
          folder="gallery"
          initialPath={imagePath || undefined}
          onChange={(path) => setValue("image_path", path || "")}
        />
        {errors.image_path && (
          <p className="text-sm text-destructive">{errors.image_path.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="taken_at">Date Taken</Label>
          <Input
            id="taken_at"
            type="date"
            {...register("taken_at")}
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

