import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('🔍 Checking database schema...\n')
  
  const tables = [
    'company_media',
    'ngo_media',
    'company_pages',
    'ngo_pages',
    'company_sections',
    'ngo_sections',
    'company_content_blocks',
    'ngo_content_blocks',
    'company_blogs',
    'ngo_blogs',
    'company_team',
    'ngo_team',
    'company_testimonials',
    'ngo_testimonials',
    'company_partners',
    'ngo_partners',
    'company_services',
    'ngo_programs',
    'company_services',
    'company_projects',
    'ngo_impact_stats',
    'ngo_case_studies',
    'ngo_reports',
    'websites',
    'admin_users'
  ]
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        console.log(`❌ ${table} - Table does not exist`)
      } else if (error.code === '42501') {
        console.log(`⚠️  ${table} - Permission denied (RLS or role issue)`)
      } else {
        console.log(`⚠️  ${table} - ${error.message}`)
      }
    } else {
      console.log(`✅ ${table} - OK`)
    }
  }
  
  console.log('\n💡 If tables are missing, apply the database schema in Supabase SQL Editor')
  console.log('💡 If permission denied, check RLS policies and service role key')
}

checkSchema().catch(console.error)

