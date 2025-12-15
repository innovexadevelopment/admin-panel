"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { heroSectionSchema, type HeroSectionFormData } from "@/lib/validators"
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
  onSubmit: (data: HeroSectionFormData) => Promise<void>
}

export function HeroForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<HeroSectionFormData>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: initialData || {
      site,
      title: "",
      subtitle: "",
      primary_cta_label: "",
      primary_cta_url: "",
      secondary_cta_label: "",
      secondary_cta_url: "",
      background_image_path: null,
      overlay_opacity: 0.4,
      order_index: 0,
      is_active: true,
    },
  })

  const backgroundImagePath = watch("background_image_path")
  const isActive = watch("is_active")
  const overlayOpacity = watch("overlay_opacity")

  async function onFormSubmit(data: HeroSectionFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Hero section saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save hero section",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Hero Title"
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
          placeholder="Hero Subtitle"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primary_cta_label">Primary CTA Label</Label>
          <Input
            id="primary_cta_label"
            {...register("primary_cta_label")}
            placeholder="Get Started"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary_cta_url">Primary CTA URL</Label>
          <Input
            id="primary_cta_url"
            type="url"
            {...register("primary_cta_url")}
            placeholder="https://example.com"
          />
          {errors.primary_cta_url && (
            <p className="text-sm text-destructive">{errors.primary_cta_url.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="secondary_cta_label">Secondary CTA Label</Label>
          <Input
            id="secondary_cta_label"
            {...register("secondary_cta_label")}
            placeholder="Learn More"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondary_cta_url">Secondary CTA URL</Label>
          <Input
            id="secondary_cta_url"
            type="url"
            {...register("secondary_cta_url")}
            placeholder="https://example.com"
          />
          {errors.secondary_cta_url && (
            <p className="text-sm text-destructive">{errors.secondary_cta_url.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background Image</Label>
        <ImageUploader
          site={site}
          folder="hero"
          initialPath={backgroundImagePath}
          onChange={(path) => setValue("background_image_path", path)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="overlay_opacity">Overlay Opacity (0-1)</Label>
        <Input
          id="overlay_opacity"
          type="number"
          step="0.1"
          min="0"
          max="1"
          {...register("overlay_opacity", { valueAsNumber: true })}
        />
        {errors.overlay_opacity && (
          <p className="text-sm text-destructive">{errors.overlay_opacity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="order_index">Order Index</Label>
        <Input
          id="order_index"
          type="number"
          {...register("order_index", { valueAsNumber: true })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

