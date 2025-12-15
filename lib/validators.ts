import { z } from 'zod'

export const heroSectionSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  primary_cta_label: z.string().optional(),
  primary_cta_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  secondary_cta_label: z.string().optional(),
  secondary_cta_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  background_image_path: z.string().optional().nullable(),
  overlay_opacity: z.number().min(0).max(1).default(0.4),
  order_index: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export const aboutSectionSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  image_path: z.string().optional().nullable(),
  stats: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional().nullable(),
})

export const serviceSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  icon: z.string().optional(),
  order_index: z.number().int().default(0),
})

export const projectSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  category: z.string().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_ongoing: z.boolean().default(false),
  highlight: z.boolean().default(false),
  cover_image_path: z.string().optional().nullable(),
  gallery_image_paths: z.array(z.string()).optional().nullable(),
  external_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const timelineItemSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  type: z.string().optional(),
  order_index: z.number().int().default(0),
})

export const teamMemberSchema = z.object({
  site: z.enum(['company', 'ngo']),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  avatar_image_path: z.string().optional().nullable(),
  order_index: z.number().int().default(0),
})

export const testimonialSchema = z.object({
  site: z.enum(['company', 'ngo']),
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  organization: z.string().optional(),
  quote: z.string().min(1, 'Quote is required'),
  avatar_image_path: z.string().optional().nullable(),
  order_index: z.number().int().default(0),
})

export const impactStatSchema = z.object({
  site: z.enum(['company', 'ngo']),
  label: z.string().min(1, 'Label is required'),
  value: z.number().optional().nullable(),
  suffix: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order_index: z.number().int().default(0),
})

export const galleryImageSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().optional(),
  description: z.string().optional(),
  image_path: z.string().min(1, 'Image is required'),
  taken_at: z.string().optional().nullable(),
  order_index: z.number().int().default(0),
})

export const contactInfoSchema = z.object({
  site: z.enum(['company', 'ngo']),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  map_embed_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  socials: z.record(z.string()).optional().nullable(),
})

export const campaignSchema = z.object({
  site: z.enum(['company', 'ngo']).default('ngo'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  goal_amount: z.number().optional().nullable(),
  raised_amount: z.number().default(0),
  banner_image_path: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type HeroSectionFormData = z.infer<typeof heroSectionSchema>
export type AboutSectionFormData = z.infer<typeof aboutSectionSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type TimelineItemFormData = z.infer<typeof timelineItemSchema>
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>
export type TestimonialFormData = z.infer<typeof testimonialSchema>
export type ImpactStatFormData = z.infer<typeof impactStatSchema>
export type GalleryImageFormData = z.infer<typeof galleryImageSchema>
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>
export const blogPostSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featured_image_path: z.string().optional().nullable(),
  author_name: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().nullable(),
  is_published: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
})

export const eventSchema = z.object({
  site: z.enum(['company', 'ngo']),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  location: z.string().optional(),
  location_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  cover_image_path: z.string().optional().nullable(),
  registration_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export const careerSchema = z.object({
  site: z.enum(['company', 'ngo']).default('company'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  department: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).optional().nullable(),
  benefits: z.array(z.string()).optional().nullable(),
  salary_range: z.string().optional(),
  is_active: z.boolean().default(true),
  application_deadline: z.string().optional().nullable(),
})

export const volunteerSchema = z.object({
  site: z.enum(['company', 'ngo']).default('ngo'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional().nullable(),
  availability: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'active', 'inactive']).default('pending'),
})

export type CampaignFormData = z.infer<typeof campaignSchema>
export type BlogPostFormData = z.infer<typeof blogPostSchema>
export type EventFormData = z.infer<typeof eventSchema>
export type CareerFormData = z.infer<typeof careerSchema>
export type VolunteerFormData = z.infer<typeof volunteerSchema>

