import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set all Supabase auth cookies properly
          cookiesToSet.forEach(({ name, value, options }) => {
            // Skip if cookie is too large
            if (value && value.length > 4000) {
              console.warn(`Skipping large cookie: ${name} (${value.length} bytes)`)
              return
            }
            
            // Set cookie with proper options
            const cookieOptions = {
              ...options,
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/',
              maxAge: options?.maxAge || 60 * 60 * 24 * 7, // 7 days default
            }
            
            response.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  // Get user (this will refresh session if needed)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If no user, redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      // Only set auth-error if it's a real auth error (not just missing session)
      if (authError && authError.message && !authError.message.includes('JWT expired') && !authError.message.includes('session')) {
        loginUrl.searchParams.set('error', 'auth-error')
      }
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has admin record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    if (adminError) {
      console.error('Admin check error in middleware:', adminError.message)
      // If it's a "no rows" error, user doesn't have admin access
      if (adminError.code === 'PGRST116' || adminError.message.includes('No rows')) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/login?error=no-access', request.url))
      }
      // Other errors - still redirect but with different error
      return NextResponse.redirect(new URL('/login?error=auth-error', request.url))
    }

    if (!adminUser) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=no-access', request.url))
    }
  }

  // Redirect authenticated admin users away from login page
  if (request.nextUrl.pathname === '/login' && user) {
    // Check admin record before redirecting
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    // Only redirect if user has admin access
    if (adminUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // If user exists but no admin record, sign them out and show error
    if (!adminError || adminError.code === 'PGRST116') {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=no-access', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}

