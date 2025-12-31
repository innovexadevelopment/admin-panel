import { supabase } from '../supabase/client'

export async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { authenticated: false, user: null }
  }

  // Check if user has admin record
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  return {
    authenticated: !!adminUser,
    user: adminUser ? user : null,
    adminUser,
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return false
  }
  return true
}

