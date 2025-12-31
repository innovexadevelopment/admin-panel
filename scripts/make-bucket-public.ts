import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function makeBucketPublic() {
  console.log('Making media bucket public...')

  // Update bucket to be public
  const { data, error } = await supabase.storage.updateBucket('media', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
  })

  if (error) {
    console.error('Error updating bucket:', error)
    console.log('\n💡 You may need to make it public manually in Supabase Dashboard:')
    console.log('   1. Go to Storage → media bucket')
    console.log('   2. Click Settings')
    console.log('   3. Toggle "Public bucket" to ON')
    return
  }

  console.log('✅ Media bucket is now public!')
  console.log('✅ Images can now be accessed without authentication')
}

makeBucketPublic().catch(console.error)

