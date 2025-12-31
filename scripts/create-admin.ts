import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure .env.local has:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdmin() {
  const email = 'alamowner123@gmail.com'
  const password = '112233'
  const fullName = 'Admin Owner'

  console.log('🔐 Creating admin user...')
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)

  try {
    // Step 1: Create or get user in Supabase Auth
    console.log('\n📝 Step 1: Creating/getting user in Supabase Auth...')
    let authUser
    
    // Try to create user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        console.log('⚠️  User already exists in Auth. Fetching existing user...')
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
        
        if (listError) {
          throw new Error(`Failed to list users: ${listError.message}`)
        }
        
        const existingUser = existingUsers?.users.find(u => u.email === email)
        
        if (!existingUser) {
          throw new Error('User exists but could not be found in user list')
        }
        
        authUser = existingUser
        console.log('✅ Found existing user')
        console.log(`   User ID: ${authUser.id}`)
      } else {
        throw authError
      }
    } else {
      authUser = authData.user
      console.log('✅ User created in Auth')
      console.log(`   User ID: ${authUser.id}`)
    }

    if (!authUser) {
      throw new Error('Failed to get user data')
    }

    // Step 2: Check if admin_users record exists
    console.log('\n📝 Step 2: Checking admin_users record...')
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single()

    if (existingAdmin) {
      console.log('⚠️  Admin record already exists')
      console.log(`   Admin ID: ${existingAdmin.id}`)
      console.log(`   Role: ${existingAdmin.role}`)
      console.log(`   Active: ${existingAdmin.is_active}`)
      
      // Update if needed
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          email,
          full_name: fullName,
          is_active: true,
        })
        .eq('id', existingAdmin.id)

      if (updateError) {
        throw updateError
      }
      console.log('✅ Admin record updated')
    } else {
      // Step 3: Create admin_users record using RPC or direct SQL
      console.log('\n📝 Step 3: Creating admin_users record...')
      
      // Try using the service role client which should bypass RLS
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .insert({
          auth_user_id: authUser.id,
          email,
          full_name: fullName,
          role: 'super_admin',
          is_active: true,
        })
        .select()
        .single()

      if (adminError) {
        // If RLS is blocking, provide manual SQL
        console.log('⚠️  Direct insert failed due to permissions.')
        console.log('\n💡 Run this SQL in Supabase SQL Editor:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`INSERT INTO admin_users (auth_user_id, email, full_name, role, is_active)`)
        console.log(`VALUES (`)
        console.log(`  '${authUser.id}',`)
        console.log(`  '${email}',`)
        console.log(`  '${fullName}',`)
        console.log(`  'super_admin',`)
        console.log(`  true`)
        console.log(`)`)
        console.log(`ON CONFLICT (auth_user_id) DO UPDATE SET`)
        console.log(`  email = EXCLUDED.email,`)
        console.log(`  full_name = EXCLUDED.full_name,`)
        console.log(`  role = EXCLUDED.role,`)
        console.log(`  is_active = EXCLUDED.is_active;`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        throw new Error(`Failed to create admin record: ${adminError.message}\n\nRun the SQL above in Supabase SQL Editor.`)
      }

      console.log('✅ Admin record created')
      console.log(`   Admin ID: ${adminUser.id}`)
      console.log(`   Role: ${adminUser.role}`)
    }

    console.log('\n🎉 Success! Admin user created/updated successfully!')
    console.log('\n📋 Login Details:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Role: super_admin`)
    console.log('\n🌐 You can now login at: http://localhost:3000/login')
  } catch (error: any) {
    console.error('\n❌ Error creating admin user:')
    console.error(error.message)
    
    if (error.message?.includes('duplicate key')) {
      console.error('\n💡 Tip: Admin record might already exist. Check the database.')
    }
    
    process.exit(1)
  }
}

createAdmin()

