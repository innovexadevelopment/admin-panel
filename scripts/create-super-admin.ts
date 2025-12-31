#!/usr/bin/env ts-node

/**
 * Create Super Admin User
 * 
 * Creates an admin user in Supabase Auth and the admin_users table.
 * 
 * Usage:
 *   npm run create-super-admin
 * 
 * Or with environment variables:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   ADMIN_EMAIL=alam01491625@gmail.com
 *   ADMIN_PASSWORD=11223344
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createSuperAdmin(
  email: string = 'alam01491625@gmail.com',
  password: string = '11223344',
  fullName?: string
) {
  console.log(`\n🔐 Creating super admin user...`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Role: super_admin`)

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        console.log('⚠️  User already exists in Auth, fetching existing user...')
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const user = existingUsers?.users.find(u => u.email === email)
        if (!user) {
          throw new Error('User exists but could not be found')
        }
        console.log(`✅ Found existing user in Auth: ${user.id}`)
        await createAdminUserRecord(user.id, email, 'super_admin', fullName)
        return
      }
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user in Auth')
    }

    console.log('✅ User created in Supabase Auth')

    // 2. Create record in admin_users table
    await createAdminUserRecord(authData.user.id, email, 'super_admin', fullName)

    console.log('\n✅ Super admin user created successfully!')
    console.log(`\n📝 You can now login at: http://localhost:3000/login`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error: any) {
    console.error('\n❌ Error creating super admin user:', error.message)
    process.exit(1)
  }
}

async function createAdminUserRecord(
  userId: string,
  email: string,
  role: 'super_admin' | 'admin' | 'editor',
  fullName?: string
) {
  // Check if admin_users table uses auth_user_id or id
  const { data: existingRecord } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (existingRecord) {
    console.log('⚠️  Admin user record already exists, updating to super_admin...')
    // Update existing record
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ 
        role: 'super_admin',
        is_active: true,
        full_name: fullName || existingRecord.full_name
      })
      .eq('email', email)

    if (updateError) throw updateError
    console.log('✅ Admin user record updated to super_admin')
    return
  }

  // Try to insert with auth_user_id (if that column exists)
  const { error: insertError1 } = await supabase
    .from('admin_users')
    .insert({
      auth_user_id: userId,
      email,
      role,
      full_name: fullName,
      is_active: true,
    })

  if (!insertError1) {
    console.log('✅ Admin user record created in database')
    return
  }

  // If that fails, try with id (if auth_user_id doesn't exist)
  if (insertError1.message.includes('auth_user_id') || insertError1.message.includes('column')) {
    const { error: insertError2 } = await supabase
      .from('admin_users')
      .insert({
        id: userId,
        email,
        role,
        full_name: fullName,
        is_active: true,
      })

    if (insertError2) throw insertError2
    console.log('✅ Admin user record created in database')
  } else {
    throw insertError1
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
let email = process.env.ADMIN_EMAIL || 'alam01491625@gmail.com'
let password = process.env.ADMIN_PASSWORD || '11223344'
let fullName = process.env.ADMIN_FULL_NAME

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1]
    i++
  } else if (args[i] === '--password' && args[i + 1]) {
    password = args[i + 1]
    i++
  } else if (args[i] === '--name' && args[i + 1]) {
    fullName = args[i + 1]
    i++
  }
}

// Run
createSuperAdmin(email, password, fullName)
  .then(() => {
    console.log('\n✨ Setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  })

