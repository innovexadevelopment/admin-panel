import type { WebsiteType } from '../types-separate'

/**
 * Get the table name based on website type and entity
 * Handles special cases where table names don't follow the standard pattern
 */
export function getTableName(type: WebsiteType, entity: string): string {
  const prefix = type === 'company' ? 'company' : 'ngo'
  
  // Special cases where table names differ from entity names
  const specialCases: Record<string, { company?: string; ngo?: string }> = {
    'blog_posts': { company: 'company_blogs', ngo: 'ngo_blogs' },
    'blogs': { company: 'company_blogs', ngo: 'ngo_blogs' },
    'programs': { company: 'company_services', ngo: 'ngo_programs' },
    'team_members': { company: 'company_team', ngo: 'ngo_team' },
    'team': { company: 'company_team', ngo: 'ngo_team' },
  }
  
  // Check if entity has a special case
  if (specialCases[entity]) {
    return type === 'company' 
      ? (specialCases[entity].company || `${prefix}_${entity}`)
      : (specialCases[entity].ngo || `${prefix}_${entity}`)
  }
  
  return `${prefix}_${entity}`
}

/**
 * Common table entities
 */
export const TABLE_ENTITIES = {
  pages: 'pages',
  blogs: 'blog_posts',
  media: 'media',
  team: 'team_members',
  testimonials: 'testimonials',
  partners: 'partners',
  programs: 'programs',
  sections: 'sections',
  content_blocks: 'content_blocks',
  seo_metadata: 'seo_metadata',
} as const

/**
 * NGO-specific tables
 */
export const NGO_TABLES = {
  impact_stats: 'ngo_impact_stats',
  case_studies: 'ngo_case_studies',
  reports: 'ngo_reports',
  contact_submissions: 'ngo_contact_submissions',
} as const

/**
 * Company-specific tables
 */
export const COMPANY_TABLES = {
  projects: 'company_projects',
  contact_submissions: 'company_contact_submissions',
} as const

