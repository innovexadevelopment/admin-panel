"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogPostSchema, type BlogPostFormData } from "@/lib/validators"
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
  onSubmit: (data: BlogPostFormData) => Promise<void>
}

export function BlogForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      site,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image_path: null,
      author_name: "",
      category: "",
      tags: [],
      is_published: false,
      published_at: null,
    },
  })

  const featuredImagePath = watch("featured_image_path")
  const isPublished = watch("is_published")

  async function onFormSubmit(data: BlogPostFormData) {
    try {
      const submitData = {
        ...data,
        published_at: data.is_published && !initialData?.published_at
          ? new Date().toISOString()
          : data.published_at || null,
      }
      await onSubmit(submitData)
      toast({
        title: "Success",
        description: initialData ? "Blog post updated" : "Blog post created",
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
            placeholder="Blog post title"
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
            placeholder="blog-post-slug"
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          {...register("excerpt")}
          placeholder="Short excerpt for preview"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Full blog post content"
          rows={10}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="author_name">Author Name</Label>
          <Input
            id="author_name"
            {...register("author_name")}
            placeholder="Author name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...register("category")}
            placeholder="Category"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="tag1, tag2, tag3"
          defaultValue={watch("tags")?.join(", ") || ""}
          onChange={(e) => {
            const tags = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
            setValue("tags", tags.length > 0 ? tags : null)
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        <ImageUploader
          currentImagePath={featuredImagePath}
          onImageUploaded={(path) => setValue("featured_image_path", path)}
          onImageRemoved={() => setValue("featured_image_path", null)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setValue("is_published", checked)}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}

