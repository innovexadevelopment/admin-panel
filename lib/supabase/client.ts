import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Use SSR browser client which handles cookies automatically
// Don't override storage - let it use cookies by default
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

