"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { testimonialSchema, type TestimonialFormData } from "@/lib/validators"
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
  onSubmit: (data: TestimonialFormData) => Promise<void>
}

export function TestimonialForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData || {
      site,
      name: "",
      role: "",
      organization: "",
      quote: "",
      avatar_image_path: null,
      order_index: 0,
    },
  })

  const avatarPath = watch("avatar_image_path")

  async function onFormSubmit(data: TestimonialFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Testimonial saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save testimonial",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Person Name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            {...register("role")}
            placeholder="Job Title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            {...register("organization")}
            placeholder="Company/Organization"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote *</Label>
        <Textarea
          id="quote"
          {...register("quote")}
          placeholder="Testimonial quote"
          rows={4}
        />
        {errors.quote && (
          <p className="text-sm text-destructive">{errors.quote.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Avatar Image</Label>
        <ImageUploader
          site={site}
          folder="testimonials"
          initialPath={avatarPath}
          onChange={(path) => setValue("avatar_image_path", path)}
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

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

