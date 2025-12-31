'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { useAdminUser } from '../../../lib/hooks/use-admin-user'
import type { UserRole } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Shield, UserX, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: UserRole
  is_active: boolean
  last_login?: string
  created_at: string
}

export default function AdminUsersPage() {
  const { adminUser: currentUser } = useAdminUser()
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (currentUser?.role === 'super_admin') {
      loadUsers()
    }
  }, [currentUser])

  async function loadUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }
      setUsers(data || [])
    } catch (error: any) {
      console.error('Error loading users:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load users',
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(userId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: !currentStatus })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message,
      })
      return
    }

    toast({
      variant: 'success',
      title: 'Success',
      description: 'User updated successfully!',
    })
    loadUsers()
  }

  async function deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this admin user? This action cannot be undone.')) return

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Error deleting user:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message,
      })
      return
    }

    toast({
      variant: 'success',
      title: 'Success',
      description: 'User deleted successfully!',
    })
    loadUsers()
  }

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only super admins can manage admin users.</p>
      </div>
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin access and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Add Admin User
        </button>
      </div>

      {showCreateModal && (
        <CreateAdminUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            loadUsers()
          }}
        />
      )}

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Last Login</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No admin users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-muted/50">
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4 text-muted-foreground">{user.full_name || '-'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.id !== currentUser?.id && (
                        <>
                          <button
                            onClick={() => toggleActive(user.id, user.is_active)}
                            className="p-2 hover:bg-muted rounded"
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CreateAdminUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin' as UserRole,
  })
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin-users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create admin user')
        setLoading(false)
        return
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create admin user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Admin User</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

