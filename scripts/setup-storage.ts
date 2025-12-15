/**
 * Script to create the public-assets storage bucket in Supabase
 * 
 * Run this script with: npm run setup:storage
 * 
 * Make sure you have the following environment variables in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local (Next.js convention)
config({ path: resolve(process.cwd(), '.env.local') })
// Also try .env as fallback
config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables!')
  console.error('')
  console.error('Please make sure you have a .env.local file in the project root with:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.error('')
  console.error('Current values:')
  console.error(`   - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.error(`   - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? '✅ Set' : '❌ Missing'}`)
  console.error('')
  console.error('💡 Tip: Check if .env.local exists in the project root directory')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  const bucketName = 'public-assets'

  try {
    console.log(`📦 Checking if bucket "${bucketName}" exists...`)

    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw listError
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)

    if (bucketExists) {
      console.log(`✅ Bucket "${bucketName}" already exists!`)
      
      // Verify it's public
      const bucket = buckets.find(b => b.name === bucketName)
      if (bucket?.public) {
        console.log(`✅ Bucket is already public`)
      } else {
        console.log(`⚠️  Bucket exists but is not public. Please make it public in Supabase dashboard.`)
      }
      return
    }

    console.log(`📦 Creating bucket "${bucketName}"...`)

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    })

    if (error) {
      // If bucket creation fails, it might be a permissions issue
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log(`✅ Bucket "${bucketName}" already exists!`)
        return
      }
      throw error
    }

    console.log(`✅ Successfully created bucket "${bucketName}"!`)
    console.log(`✅ Bucket is configured as public`)
    console.log(`\n📝 Next steps:`)
    console.log(`   1. Go to your Supabase dashboard`)
    console.log(`   2. Navigate to Storage > ${bucketName}`)
    console.log(`   3. Verify the bucket is set to "Public bucket"`)
    console.log(`   4. Set up RLS policies if needed (bucket should be public)`)

  } catch (error: any) {
    console.error(`❌ Error setting up storage:`, error.message)
    console.error(`\n📝 Manual setup instructions:`)
    console.error(`   1. Go to your Supabase dashboard`)
    console.error(`   2. Navigate to Storage`)
    console.error(`   3. Click "New bucket"`)
    console.error(`   4. Name: ${bucketName}`)
    console.error(`   5. Make it a "Public bucket"`)
    console.error(`   6. Click "Create bucket"`)
    process.exit(1)
  }
}

setupStorage()

