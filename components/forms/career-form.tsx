"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { careerSchema, type CareerFormData } from "@/lib/validators"
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
  onSubmit: (data: CareerFormData) => Promise<void>
}

export function CareerForm({ site, initialData, onSubmit }: Props) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: initialData || {
      site,
      title: "",
      slug: "",
      department: "",
      location: "",
      employment_type: "",
      description: "",
      requirements: [],
      benefits: [],
      salary_range: "",
      is_active: true,
      application_deadline: null,
    },
  })

  const isActive = watch("is_active")

  async function onFormSubmit(data: CareerFormData) {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: initialData ? "Job posting updated" : "Job posting created",
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
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Senior Developer"
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
            placeholder="senior-developer"
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register("department")}
            placeholder="Engineering"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Remote / New York"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employment_type">Employment Type</Label>
          <Input
            id="employment_type"
            {...register("employment_type")}
            placeholder="Full-time"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Full job description"
          rows={8}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (one per line)</Label>
        <Textarea
          id="requirements"
          placeholder="5+ years experience&#10;Bachelor's degree&#10;..."
          rows={5}
          defaultValue={watch("requirements")?.join("\n") || ""}
          onChange={(e) => {
            const reqs = e.target.value
              .split("\n")
              .map((r) => r.trim())
              .filter(Boolean)
            setValue("requirements", reqs.length > 0 ? reqs : null)
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits (one per line)</Label>
        <Textarea
          id="benefits"
          placeholder="Health insurance&#10;401(k) matching&#10;..."
          rows={5}
          defaultValue={watch("benefits")?.join("\n") || ""}
          onChange={(e) => {
            const bens = e.target.value
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean)
            setValue("benefits", bens.length > 0 ? bens : null)
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salary_range">Salary Range</Label>
          <Input
            id="salary_range"
            {...register("salary_range")}
            placeholder="$80,000 - $120,000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="application_deadline">Application Deadline</Label>
          <Input
            id="application_deadline"
            type="date"
            {...register("application_deadline")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  )
}

