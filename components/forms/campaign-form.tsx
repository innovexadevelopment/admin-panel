"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { campaignSchema, type CampaignFormData } from "@/lib/validators"
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
  onSubmit: (data: CampaignFormData) => Promise<void>
}

export function CampaignForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialData || {
      site: "ngo",
      title: "",
      slug: "",
      short_description: "",
      long_description: "",
      goal_amount: null,
      raised_amount: 0,
      banner_image_path: null,
      is_active: true,
    },
  })

  const bannerPath = watch("banner_image_path")
  const isActive = watch("is_active")

  async function onFormSubmit(data: CampaignFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: "Campaign saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save campaign",
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
          placeholder="Campaign Title"
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
          placeholder="campaign-slug"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
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
          <Label htmlFor="goal_amount">Goal Amount</Label>
          <Input
            id="goal_amount"
            type="number"
            step="0.01"
            {...register("goal_amount", { valueAsNumber: true })}
            placeholder="10000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="raised_amount">Raised Amount</Label>
          <Input
            id="raised_amount"
            type="number"
            step="0.01"
            {...register("raised_amount", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Banner Image</Label>
        <ImageUploader
          site="ngo"
          folder="campaigns"
          initialPath={bannerPath}
          onChange={(path) => setValue("banner_image_path", path)}
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

