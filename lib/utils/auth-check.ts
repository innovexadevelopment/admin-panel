import { supabase } from '../supabase/client'

export async function checkAuth(): Promise<{ authenticated: boolean; isAdmin: boolean; error?: string }> {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { authenticated: false, isAdmin: false, error: 'Not authenticated' }
    }

    // Check if user has admin record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      return { authenticated: true, isAdmin: false, error: 'No admin access' }
    }

    return { authenticated: true, isAdmin: true }
  } catch (error) {
    console.error('Auth check error:', error)
    return { authenticated: false, isAdmin: false, error: 'Auth check failed' }
  }
}

