// Types for separate tables architecture
export type WebsiteType = 'company' | 'ngo'

export type UserRole = 'super_admin' | 'admin' | 'editor'

export type ContentBlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'cta' 
  | 'image' 
  | 'video' 
  | 'gallery' 
  | 'testimonial' 
  | 'stats' 
  | 'timeline' 
  | 'accordion'

export type MediaType = 'image' | 'video' | 'document' | 'other'

export type VisibilityStatus = 'published' | 'draft' | 'archived'

export interface Website {
  id: string
  type: WebsiteType
  name: string
  domain?: string
  logo_url?: string
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  social_links?: Record<string, string>
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

// Base interfaces (no website_id)
export interface Page {
  id: string
  slug: string
  title: string
  status: VisibilityStatus
  is_homepage: boolean
  order_index: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface Section {
  id: string
  page_id: string
  title?: string
  type: string
  order_index: number
  is_visible: boolean
  background_color?: string
  background_image_url?: string
  padding_top: number
  padding_bottom: number
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ContentBlock {
  id: string
  section_id: string
  type: ContentBlockType
  order_index: number
  content: Record<string, any>
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  file_name: string
  file_path: string
  file_url: string
  file_size: number
  mime_type?: string
  type: MediaType
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  folder_path?: string
  metadata?: Record<string, any>
  created_at: string
  created_by?: string
  updated_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  featured_image_id?: string
  status: VisibilityStatus
  published_at?: string
  author_id?: string
  tags?: string[]
  category?: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  role?: string
  bio?: string
  email?: string
  phone?: string
  photo_id?: string
  social_links?: Record<string, string>
  order_index: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  photo_id?: string
  rating?: number
  is_featured: boolean
  is_visible: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  description?: string
  logo_id?: string
  website_url?: string
  category?: string
  is_visible: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  slug: string
  title: string
  description?: string
  content?: string
  featured_image_id?: string
  category?: string
  status: VisibilityStatus
  is_featured: boolean
  order_index: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// NGO-specific interfaces
export interface ImpactStat {
  id: string
  label: string
  value: string
  icon?: string
  year?: number
  category?: string
  order_index: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  description?: string
  content?: string
  featured_image_id?: string
  location?: string
  year?: number
  impact_metrics?: Record<string, any>
  status: VisibilityStatus
  order_index: number
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  title: string
  description?: string
  file_id?: string
  year?: number
  category?: string
  status: VisibilityStatus
  order_index: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  type?: 'volunteer' | 'donate' | 'partner' | 'general'
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name: string
  donor_email: string
  donor_phone?: string
  amount: number
  currency: string
  payment_method?: string
  payment_status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  payment_reference?: string
  notes?: string
  metadata?: any
  confirmed_by?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

// Company-specific interfaces
export interface CompanyProject {
  id: string
  slug: string
  title: string
  description?: string
  content?: string
  featured_image_id?: string
  client_name?: string
  category?: string
  status: VisibilityStatus
  is_featured: boolean
  order_index: number
  metadata?: Record<string, any>
  results_metrics?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CompanyContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  service_interest?: string
  budget_range?: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export interface SEOMetadata {
  id: string
  entity_type: string
  entity_id: string
  title?: string
  description?: string
  keywords?: string[]
  og_title?: string
  og_description?: string
  og_image_id?: string
  og_type?: string
  twitter_card?: string
  canonical_url?: string
  robots?: string
  created_at: string
  updated_at: string
}

// Helper function to get table names
export function getTableName(type: WebsiteType, entity: string): string {
  const prefix = type === 'company' ? 'company' : 'ngo'
  return `${prefix}_${entity}`
}

