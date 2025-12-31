'use client'

import { useEffect, useState } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import type { Page } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

export default function PagesPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPages()
  }, [currentWebsite])

  async function loadPages() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'pages')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading pages:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }
      setPages(data || [])
    } catch (error: any) {
      console.error('Error loading pages:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load pages',
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleVisibility(pageId: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const tableName = getTableName(currentWebsite, 'pages')
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating page:', error)
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
      description: 'Page updated successfully!',
    })
    loadPages()
  }

  async function deletePage(pageId: string) {
    if (!confirm('Are you sure you want to delete this page? This will also delete all sections and content blocks.')) return

    const tableName = getTableName(currentWebsite, 'pages')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', pageId)

    if (error) {
      console.error('Error deleting page:', error)
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
      description: 'Page deleted successfully!',
    })
    loadPages()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          New Page
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">Title</th>
              <th className="text-left p-4 font-medium">Slug</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Homepage</th>
              <th className="text-left p-4 font-medium">Updated</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No pages yet. Create your first page!
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="border-t hover:bg-muted/50">
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-muted-foreground">/{page.slug}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {page.is_homepage && (
                      <span className="text-xs text-muted-foreground">✓</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleVisibility(page.id, page.status)}
                        className="p-2 hover:bg-muted rounded"
                        title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {page.status === 'published' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/dashboard/pages/${page.id}`}
                        className="p-2 hover:bg-muted rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded"
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
  )
}

