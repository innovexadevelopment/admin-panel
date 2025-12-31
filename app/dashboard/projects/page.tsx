'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { SearchInput } from '../../../components/search-input'
import type { CompanyProject, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface ProjectWithImage extends CompanyProject {
  featured_image?: Media
}

export default function ProjectsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (currentWebsite === 'company') {
      loadProjects()
    }
  }, [currentWebsite])

  async function loadProjects() {
    if (currentWebsite !== 'company') return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('company_projects')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading projects:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      // Fetch images for projects
      const projectsWithImages = await Promise.all((data || []).map(async (project) => {
        if (project.featured_image_id) {
          const { data: imageData } = await supabase
            .from('company_media')
            .select('id, file_url, file_name, alt_text')
            .eq('id', project.featured_image_id)
            .single()
          
          return { ...project, featured_image: imageData || undefined }
        }
        return { ...project, featured_image: undefined }
      }))

      setProjects(projectsWithImages)
    } catch (error: any) {
      console.error('Error loading projects:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load projects',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects
    const query = searchQuery.toLowerCase()
    return projects.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.client_name?.toLowerCase().includes(query) ||
      project.category?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    )
  }, [projects, searchQuery])

  async function toggleVisibility(projectId: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    const { error } = await supabase
      .from('company_projects')
      .update({ status: newStatus })
      .eq('id', projectId)

    if (error) {
      console.error('Error updating project:', error)
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
      description: 'Project updated successfully!',
    })
    loadProjects()
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return

    const { error } = await supabase
      .from('company_projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
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
      description: 'Project deleted successfully!',
    })
    loadProjects()
  }

  if (currentWebsite !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Projects are only available for Company website.</p>
      </div>
    )
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
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage portfolio projects and case studies</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Project
        </Link>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search projects by title, client, category..."
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
                <th className="text-left p-4 font-medium">Client</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Featured</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'No projects found matching your search.' : 'No projects yet. Add your first project!'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {project.featured_image?.file_url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={project.featured_image.file_url}
                            alt={project.featured_image.alt_text || project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{project.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{project.client_name || '-'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{project.category || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {project.is_featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">✓ Featured</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(project.id, project.status)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {project.status === 'published' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
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

