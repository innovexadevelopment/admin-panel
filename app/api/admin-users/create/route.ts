import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    // Verify current user is super_admin using server client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // Cookies are handled by middleware
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser || adminUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service role to create user
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    // Create auth user
    const { data: authData, error: createAuthError } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    })

    if (createAuthError) {
      return NextResponse.json({ error: createAuthError.message }, { status: 400 })
    }

    // Create admin_users record
    const { error: createAdminError } = await adminClient
      .from('admin_users')
      .insert({
        auth_user_id: authData.user.id,
        email: body.email,
        full_name: body.full_name || null,
        role: body.role || 'editor',
        is_active: true,
      })

    if (createAdminError) {
      // Rollback: delete auth user if admin_users insert fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: createAdminError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create admin user' }, { status: 500 })
  }
}

