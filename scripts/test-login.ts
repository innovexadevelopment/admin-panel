import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, anonKey)

async function testLogin() {
  const email = 'alamowner123@gmail.com'
  const password = '112233'

  console.log('🔐 Testing login...')
  console.log(`   Email: ${email}`)
  console.log('')

  try {
    // Test 1: Check if user exists in Auth
    console.log('📝 Step 1: Checking user in Auth...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError && userError.message.includes('JWT')) {
      console.log('   ⚠️  Not authenticated (expected)')
    }

    // Test 2: Try to sign in
    console.log('\n📝 Step 2: Attempting sign in...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('❌ Sign in failed:')
      console.error(`   Error: ${authError.message}`)
      console.error(`   Status: ${authError.status}`)
      
      if (authError.message.includes('Invalid login credentials')) {
        console.error('\n💡 Possible issues:')
        console.error('   - Password is incorrect')
        console.error('   - User email is wrong')
        console.error('   - User might not be confirmed')
      }
      return
    }

    if (!authData.user) {
      console.error('❌ No user data returned')
      return
    }

    console.log('✅ Sign in successful!')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${authData.user.email}`)
    console.log(`   Confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`)

    // Test 3: Check admin_users record
    console.log('\n📝 Step 3: Checking admin_users record...')
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (adminError) {
      console.error('❌ Admin record check failed:')
      console.error(`   Error: ${adminError.message}`)
      console.error(`   Code: ${adminError.code}`)
      
      if (adminError.code === 'PGRST116') {
        console.error('\n💡 Admin record does not exist!')
        console.error('   Run the SQL in create-admin-user.sql')
      } else if (adminError.message.includes('permission denied') || adminError.message.includes('RLS')) {
        console.error('\n💡 RLS policy blocking access!')
        console.error('   Make sure GRANT statements have been run')
      }
      return
    }

    if (!adminUser) {
      console.error('❌ Admin record not found')
      console.error('   Run the SQL in create-admin-user.sql')
      return
    }

    console.log('✅ Admin record found!')
    console.log(`   Admin ID: ${adminUser.id}`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   Active: ${adminUser.is_active}`)

    if (!adminUser.is_active) {
      console.error('\n⚠️  Admin user is not active!')
      console.error('   Update is_active to true in database')
    }

    console.log('\n🎉 All checks passed! Login should work.')
  } catch (error: any) {
    console.error('\n❌ Unexpected error:')
    console.error(error.message)
  }
}

testLogin()

