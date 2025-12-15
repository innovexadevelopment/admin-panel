"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectFormData } from "@/lib/validators"
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
  onSubmit: (data: ProjectFormData) => Promise<void>
}

export function ProjectForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      site,
      title: "",
      slug: "",
      short_description: "",
      long_description: "",
      category: "",
      start_date: null,
      end_date: null,
      is_ongoing: false,
      highlight: false,
      cover_image_path: null,
      gallery_image_paths: [],
      external_link: "",
    },
  })

  const coverImagePath = watch("cover_image_path")
  const isOngoing = watch("is_ongoing")
  const highlight = watch("highlight")

  async function onFormSubmit(data: ProjectFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Project saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
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
          placeholder="Project Title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="project-slug"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          URL-friendly identifier (lowercase, numbers, hyphens only)
        </p>
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

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          {...register("category")}
          placeholder="e.g. Web Development, Mobile App"
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
            disabled={isOngoing}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_ongoing"
          checked={isOngoing}
          onCheckedChange={(checked) => {
            setValue("is_ongoing", checked)
            if (checked) setValue("end_date", null)
          }}
        />
        <Label htmlFor="is_ongoing">Ongoing Project</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="highlight"
          checked={highlight}
          onCheckedChange={(checked) => setValue("highlight", checked)}
        />
        <Label htmlFor="highlight">Highlight</Label>
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUploader
          site={site}
          folder="projects"
          initialPath={coverImagePath}
          onChange={(path) => setValue("cover_image_path", path)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="external_link">External Link</Label>
        <Input
          id="external_link"
          type="url"
          {...register("external_link")}
          placeholder="https://example.com"
        />
        {errors.external_link && (
          <p className="text-sm text-destructive">{errors.external_link.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

