'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import { SearchInput } from '../../../components/search-input'
import type { TeamMember, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface TeamMemberWithImage extends TeamMember {
  photo?: Media
}

export default function TeamPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMemberWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMembers()
  }, [currentWebsite])

  async function loadMembers() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'team_members')
      const mediaTableName = getTableName(currentWebsite, 'media')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading team members:', error)
        alert(`Error: ${error.message}`)
        return
      }

      // Fetch images for members
      const membersWithImages = await Promise.all((data || []).map(async (member) => {
        if (member.photo_id) {
          const { data: imageData } = await supabase
            .from(mediaTableName)
            .select('id, file_url, file_name, alt_text')
            .eq('id', member.photo_id)
            .single()
          
          return { ...member, photo: imageData || undefined }
        }
        return { ...member, photo: undefined }
      }))

      setMembers(membersWithImages)
    } catch (error: any) {
      console.error('Error loading team members:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load team members',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members
    const query = searchQuery.toLowerCase()
    return members.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.role?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.bio?.toLowerCase().includes(query)
    )
  }, [members, searchQuery])

  async function toggleVisibility(memberId: string, currentStatus: boolean) {
    const tableName = getTableName(currentWebsite, 'team_members')
    const { error } = await supabase
      .from(tableName)
      .update({ is_visible: !currentStatus })
      .eq('id', memberId)

    if (error) {
      console.error('Error updating member:', error)
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
      description: 'Team member updated successfully!',
    })
    loadMembers()
  }

  async function deleteMember(id: string) {
    if (!confirm('Are you sure you want to delete this team member?')) return

    const tableName = getTableName(currentWebsite, 'team_members')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting member:', error)
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
      description: 'Team member deleted successfully!',
    })
    loadMembers()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Members</h1>
          <p className="text-muted-foreground">Manage team profiles</p>
        </div>
        <Link
          href="/dashboard/team/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Member
        </Link>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search team members by name, role, email..."
          className="max-w-md"
        />
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Photo</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Visible</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'No team members found matching your search.' : 'No team members yet. Add your first member!'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {member.photo?.file_url ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={member.photo.file_url}
                            alt={member.photo.alt_text || member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-muted-foreground">{member.role || '-'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{member.email || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          member.is_visible
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {member.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(member.id, member.is_visible)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={member.is_visible ? 'Hide' : 'Show'}
                        >
                          {member.is_visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/team/${member.id}`}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
