'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { UserRole } from '../types-separate'

interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: UserRole
  is_active: boolean
}

export function useAdminUser() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminUser()
  }, [])

  async function loadAdminUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAdminUser(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        setAdminUser(null)
      } else {
        setAdminUser({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          is_active: data.is_active,
        })
      }
    } catch (error) {
      console.error('Error loading admin user:', error)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  return { adminUser, loading, refetch: loadAdminUser }
}

