import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupStorage() {
  console.log('Setting up Supabase storage...')

  // Create media bucket
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('Error listing buckets:', listError)
    return
  }

  const mediaBucketExists = buckets?.some(b => b.name === 'media')

  if (!mediaBucketExists) {
    const { data, error } = await supabase.storage.createBucket('media', {
      public: false, // Private bucket, accessed via signed URLs or service role
      fileSizeLimit: 10485760, // 10MB max file size
      allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
    })

    if (error) {
      console.error('Error creating bucket:', error)
      return
    }

    console.log('✅ Created media bucket')
  } else {
    console.log('✅ Media bucket already exists')
  }

  // Create folder structure (folders are created automatically on first upload)
  console.log('\n📁 Folder structure will be created automatically on first upload:')
  console.log('  /company/')
  console.log('    /pages/')
  console.log('    /blogs/')
  console.log('    /team/')
  console.log('    /testimonials/')
  console.log('    /partners/')
  console.log('    /programs/')
  console.log('  /ngo/')
  console.log('    /pages/')
  console.log('    /blogs/')
  console.log('    /team/')
  console.log('    /testimonials/')
  console.log('    /partners/')
  console.log('    /programs/')

  console.log('\n✅ Storage setup complete!')
}

setupStorage().catch(console.error)

