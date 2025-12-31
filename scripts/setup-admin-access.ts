#!/usr/bin/env ts-node

/**
 * Setup Admin Access Script
 * 
 * This script creates an admin user in Supabase Auth and the admin_users table.
 * 
 * Usage:
 *   npm run setup-admin -- --email your@email.com --password yourpassword --role admin
 * 
 * Or set environment variables:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   ADMIN_EMAIL=...
 *   ADMIN_PASSWORD=...
 *   ADMIN_ROLE=super_admin|admin|editor
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

async function createAdminUser(
  email: string,
  password: string,
  role: 'super_admin' | 'admin' | 'editor' = 'admin',
  fullName?: string
) {
  console.log(`\n🔐 Creating admin user...`)
  console.log(`   Email: ${email}`)
  console.log(`   Role: ${role}`)

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists in Auth, fetching existing user...')
        const { data: existingUser } = await supabase.auth.admin.listUsers()
        const user = existingUser?.users.find(u => u.email === email)
        if (!user) {
          throw new Error('User exists but could not be found')
        }
        await createAdminUserRecord(user.id, email, role, fullName)
        return
      }
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user in Auth')
    }

    console.log('✅ User created in Supabase Auth')

    // 2. Create record in admin_users table
    await createAdminUserRecord(authData.user.id, email, role, fullName)

    console.log('\n✅ Admin user created successfully!')
    console.log(`\n📝 You can now login at: http://localhost:3000/login`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error: any) {
    console.error('\n❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

async function createAdminUserRecord(
  userId: string,
  email: string,
  role: 'super_admin' | 'admin' | 'editor',
  fullName?: string
) {
  const { error } = await supabase
    .from('admin_users')
    .upsert({
      id: userId,
      email,
      role,
      full_name: fullName,
      is_active: true,
    }, {
      onConflict: 'email',
    })

  if (error) {
    if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
      console.log('⚠️  Admin user record already exists, updating...')
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ role, is_active: true })
        .eq('email', email)

      if (updateError) throw updateError
      console.log('✅ Admin user record updated')
      return
    }
    throw error
  }

  console.log('✅ Admin user record created in database')
}

// Parse command line arguments
const args = process.argv.slice(2)
let email = process.env.ADMIN_EMAIL
let password = process.env.ADMIN_PASSWORD
let role = (process.env.ADMIN_ROLE || 'admin') as 'super_admin' | 'admin' | 'editor'
let fullName = process.env.ADMIN_FULL_NAME

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1]
    i++
  } else if (args[i] === '--password' && args[i + 1]) {
    password = args[i + 1]
    i++
  } else if (args[i] === '--role' && args[i + 1]) {
    role = args[i + 1] as 'super_admin' | 'admin' | 'editor'
    i++
  } else if (args[i] === '--name' && args[i + 1]) {
    fullName = args[i + 1]
    i++
  }
}

if (!email || !password) {
  console.error('❌ Missing required parameters')
  console.error('\nUsage:')
  console.error('  npm run setup-admin -- --email your@email.com --password yourpassword --role admin')
  console.error('\nOr set environment variables:')
  console.error('  ADMIN_EMAIL=your@email.com')
  console.error('  ADMIN_PASSWORD=yourpassword')
  console.error('  ADMIN_ROLE=admin')
  process.exit(1)
}

// Validate role
if (!['super_admin', 'admin', 'editor'].includes(role)) {
  console.error(`❌ Invalid role: ${role}. Must be one of: super_admin, admin, editor`)
  process.exit(1)
}

// Run
createAdminUser(email, password, role, fullName)
  .then(() => {
    console.log('\n✨ Setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  })

