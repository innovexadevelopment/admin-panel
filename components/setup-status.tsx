'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export function SetupStatus() {
  const [checks, setChecks] = useState({
    supabaseConnected: false,
    websitesExist: false,
    authenticated: false,
    hasAdminRecord: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  async function checkSetup() {
    setLoading(true)
    const status = {
      supabaseConnected: false,
      websitesExist: false,
      authenticated: false,
      hasAdminRecord: false,
    }

    try {
      // Check Supabase connection
      const { error: testError } = await supabase.from('websites').select('id').limit(1)
      status.supabaseConnected = !testError || !testError.message.includes('Invalid API key')

      // Check if websites exist
      const { data: websites } = await supabase.from('websites').select('id')
      status.websitesExist = (websites?.length || 0) >= 2

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      status.authenticated = !!user

      // Check admin record
      if (user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()
        status.hasAdminRecord = !!adminUser
      }
    } catch (error) {
      console.error('Setup check error:', error)
    }

    setChecks(status)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">Checking setup status...</p>
      </div>
    )
  }

  const allGood = Object.values(checks).every(v => v)

  if (allGood) {
    return null
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-2">Setup Issues Detected</h3>
          <ul className="space-y-2 text-sm text-red-800">
            {!checks.supabaseConnected && (
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>Supabase connection failed. Check your .env.local file.</span>
              </li>
            )}
            {!checks.websitesExist && (
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>Websites table missing records. Run the schema.sql INSERT statements.</span>
              </li>
            )}
            {!checks.authenticated && (
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>Not authenticated. You need to log in via Supabase Auth.</span>
              </li>
            )}
            {checks.authenticated && !checks.hasAdminRecord && (
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>No admin_users record. Create one in the database.</span>
              </li>
            )}
          </ul>
          <div className="mt-4 text-xs text-red-700">
            <p>See SETUP.md for detailed instructions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

