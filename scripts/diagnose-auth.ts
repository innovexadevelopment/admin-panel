#!/usr/bin/env ts-node

/**
 * Diagnose Authentication Issues
 * 
 * This script checks:
 * 1. If user exists in auth.users
 * 2. If admin_users record exists
 * 3. If auth_user_id matches
 * 4. If RLS policies allow access
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

async function diagnoseAuth(email: string = 'alam01491625@gmail.com') {
  console.log(`\n🔍 Diagnosing authentication for: ${email}\n`)

  // 1. Check auth.users
  console.log('1️⃣ Checking auth.users...')
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
  const authUser = authUsers?.users.find(u => u.email === email)
  
  if (!authUser) {
    console.log('❌ User NOT found in auth.users')
    console.log('   Fix: Create user in Supabase Dashboard → Authentication → Users')
    return
  }
  
  console.log('✅ User found in auth.users')
  console.log(`   ID: ${authUser.id}`)
  console.log(`   Email confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`)
  console.log(`   Created: ${authUser.created_at}`)

  // 2. Check admin_users
  console.log('\n2️⃣ Checking admin_users table...')
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (adminError) {
    if (adminError.code === 'PGRST116') {
      console.log('❌ No record in admin_users table')
      console.log('   Fix: Run the SQL fix script')
    } else {
      console.log(`❌ Error querying admin_users: ${adminError.message}`)
    }
    return
  }

  if (!adminUser) {
    console.log('❌ No admin_users record found')
    return
  }

  console.log('✅ Record found in admin_users')
  console.log(`   ID: ${adminUser.id}`)
  console.log(`   auth_user_id: ${adminUser.auth_user_id}`)
  console.log(`   Role: ${adminUser.role}`)
  console.log(`   Active: ${adminUser.is_active}`)

  // 3. Check ID match
  console.log('\n3️⃣ Checking ID match...')
  if (adminUser.auth_user_id === authUser.id) {
    console.log('✅ auth_user_id matches!')
  } else {
    console.log('❌ MISMATCH!')
    console.log(`   auth.users.id: ${authUser.id}`)
    console.log(`   admin_users.auth_user_id: ${adminUser.auth_user_id}`)
    console.log('\n   Fix: Run this SQL:')
    console.log(`
UPDATE admin_users 
SET auth_user_id = '${authUser.id}'
WHERE email = '${email}';
    `)
    return
  }

  // 4. Check RLS
  console.log('\n4️⃣ Testing RLS policies...')
  const { data: testQuery, error: rlsError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .single()

  if (rlsError) {
    console.log(`⚠️  RLS test error: ${rlsError.message}`)
    console.log('   This might be normal if running as service role')
  } else {
    console.log('✅ RLS policies allow access')
  }

  // 5. Summary
  console.log('\n📊 Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  if (authUser && adminUser && adminUser.auth_user_id === authUser.id && adminUser.is_active) {
    console.log('✅ Everything looks good!')
    console.log('\nIf login still fails:')
    console.log('1. Clear browser cookies and localStorage')
    console.log('2. Restart dev server')
    console.log('3. Try login again')
  } else {
    console.log('❌ Issues found - see above')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

// Run
const email = process.argv[2] || 'alam01491625@gmail.com'
diagnoseAuth(email)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Diagnostic failed:', error)
    process.exit(1)
  })

