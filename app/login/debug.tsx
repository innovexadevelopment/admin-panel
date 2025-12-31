'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/client'

export function LoginDebug() {
  const [debug, setDebug] = useState<any>({})

  useEffect(() => {
    async function checkAuth() {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      // Check admin access
      let adminCheck = null
      if (user) {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('auth_user_id', user.id)
          .eq('is_active', true)
          .single()
        
        adminCheck = {
          hasAccess: !!adminUser,
          error: adminError?.message,
          role: adminUser?.role,
        }
      }

      setDebug({
        user: user ? { id: user.id, email: user.email } : null,
        session: session ? 'exists' : 'none',
        userError: userError?.message,
        sessionError: sessionError?.message,
        adminCheck,
        localStorage: typeof window !== 'undefined' ? Object.keys(localStorage).filter(k => k.includes('supabase')) : [],
        cookies: typeof document !== 'undefined' ? document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.split('=')[0].trim()) : [],
      })
    }

    checkAuth()
    const interval = setInterval(checkAuth, 3000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-4 rounded-lg max-w-md z-50">
      <div className="font-bold mb-2">🔍 Debug Info</div>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}

