'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import { SearchInput } from '../../../components/search-input'
import type { Program, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface ProgramWithImage extends Program {
  featured_image?: Media
}

export default function ProgramsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [programs, setPrograms] = useState<ProgramWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [currentWebsite])

  async function loadPrograms() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'programs')
      const mediaTableName = getTableName(currentWebsite, 'media')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading programs:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      // Fetch images for programs
      const programsWithImages = await Promise.all((data || []).map(async (program) => {
        if (program.featured_image_id) {
          const { data: imageData } = await supabase
            .from(mediaTableName)
            .select('id, file_url, file_name, alt_text')
            .eq('id', program.featured_image_id)
            .single()
          
          return { ...program, featured_image: imageData || undefined }
        }
        return { ...program, featured_image: undefined }
      }))

      setPrograms(programsWithImages)
    } catch (error: any) {
      console.error('Error loading programs:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load programs',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) return programs
    const query = searchQuery.toLowerCase()
    return programs.filter(program => 
      program.title.toLowerCase().includes(query) ||
      program.slug.toLowerCase().includes(query) ||
      program.category?.toLowerCase().includes(query) ||
      program.description?.toLowerCase().includes(query)
    )
  }, [programs, searchQuery])

  async function toggleVisibility(programId: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const tableName = getTableName(currentWebsite, 'programs')
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', programId)

    if (error) {
      console.error('Error updating program:', error)
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
      description: 'Program updated successfully!',
    })
    loadPrograms()
  }

  async function deleteProgram(id: string) {
    if (!confirm('Are you sure you want to delete this program/service?')) return

    const tableName = getTableName(currentWebsite, 'programs')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting program:', error)
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
      description: 'Program deleted successfully!',
    })
    loadPrograms()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const programLabel = currentWebsite === 'company' ? 'Services' : 'Programs'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{programLabel}</h1>
          <p className="text-muted-foreground">
            Manage {programLabel.toLowerCase()}
          </p>
        </div>
        <Link
          href="/dashboard/programs/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New {programLabel.slice(0, -1)}
        </Link>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${programLabel.toLowerCase()} by title, slug, category...`}
          className="max-w-md"
        />
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Image</th>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Featured</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? `No ${programLabel.toLowerCase()} found matching your search.` : `No ${programLabel.toLowerCase()} yet. Create your first one!`}
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr key={program.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {program.featured_image?.file_url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={program.featured_image.file_url}
                            alt={program.featured_image.alt_text || program.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{program.title}</td>
                    <td className="p-4 text-muted-foreground">/{program.slug}</td>
                    <td className="p-4 text-sm text-muted-foreground">{program.category || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          program.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {program.is_featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">✓ Featured</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(program.id, program.status)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={program.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {program.status === 'published' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/programs/${program.id}`}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteProgram(program.id)}
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
