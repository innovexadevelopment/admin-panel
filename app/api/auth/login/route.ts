import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    
    // Store cookies that will be set by setAll
    const cookiesToSetInResponse: Array<{ name: string; value: string; options?: any }> = []
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            // Store cookies to set in response
            cookiesToSet.forEach(({ name, value, options }) => {
              cookiesToSetInResponse.push({ name, value, options })
              cookieStore.set(name, value, {
                ...options,
                httpOnly: options?.httpOnly ?? true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/',
              })
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data?.user || !data?.session) {
      return NextResponse.json({ error: 'Login failed - no session created' }, { status: 400 })
    }

    // Verify admin user exists
    const { data: adminUser, error: adminError } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .single()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'User is not an admin' }, { status: 403 })
    }

    // Use the session from signInWithPassword response
    const session = data.session

    // Create redirect response
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Set all cookies that were set by setAll callback
    cookiesToSetInResponse.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, {
        ...options,
        httpOnly: options?.httpOnly ?? true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: options?.maxAge || 60 * 60 * 24 * 7, // 7 days default
      })
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

