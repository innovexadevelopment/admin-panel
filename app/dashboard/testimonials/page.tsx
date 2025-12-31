'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import { SearchInput } from '../../../components/search-input'
import type { Testimonial, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image as ImageIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface TestimonialWithImage extends Testimonial {
  photo?: Media
}

export default function TestimonialsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<TestimonialWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTestimonials()
  }, [currentWebsite])

  async function loadTestimonials() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'testimonials')
      const mediaTableName = getTableName(currentWebsite, 'media')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading testimonials:', error)
        alert(`Error: ${error.message}`)
        return
      }

      // Fetch photos for testimonials
      const testimonialsWithImages = await Promise.all((data || []).map(async (testimonial) => {
        if (testimonial.photo_id) {
          const { data: imageData } = await supabase
            .from(mediaTableName)
            .select('id, file_url, file_name, alt_text')
            .eq('id', testimonial.photo_id)
            .single()
          
          return { ...testimonial, photo: imageData || undefined }
        }
        return { ...testimonial, photo: undefined }
      }))

      setTestimonials(testimonialsWithImages)
    } catch (error: any) {
      console.error('Error loading testimonials:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load testimonials',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTestimonials = useMemo(() => {
    if (!searchQuery.trim()) return testimonials
    const query = searchQuery.toLowerCase()
    return testimonials.filter(testimonial => 
      testimonial.name.toLowerCase().includes(query) ||
      testimonial.role?.toLowerCase().includes(query) ||
      testimonial.company?.toLowerCase().includes(query) ||
      testimonial.content?.toLowerCase().includes(query)
    )
  }, [testimonials, searchQuery])

  async function toggleVisibility(testimonialId: string, currentStatus: boolean) {
    const tableName = getTableName(currentWebsite, 'testimonials')
    const { error } = await supabase
      .from(tableName)
      .update({ is_visible: !currentStatus })
      .eq('id', testimonialId)

    if (error) {
      console.error('Error updating testimonial:', error)
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
      description: 'Testimonial updated successfully!',
    })
    loadTestimonials()
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    const tableName = getTableName(currentWebsite, 'testimonials')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting testimonial:', error)
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
      description: 'Testimonial deleted successfully!',
    })
    loadTestimonials()
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
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials</p>
        </div>
        <Link
          href="/dashboard/testimonials/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Testimonial
        </Link>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search testimonials by name, role, company, content..."
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
                <th className="text-left p-4 font-medium">Role/Company</th>
                <th className="text-left p-4 font-medium">Rating</th>
                <th className="text-left p-4 font-medium">Featured</th>
                <th className="text-left p-4 font-medium">Visible</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'No testimonials found matching your search.' : 'No testimonials yet. Add your first testimonial!'}
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {testimonial.photo?.file_url ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={testimonial.photo.file_url}
                            alt={testimonial.photo.alt_text || testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{testimonial.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {testimonial.role || ''} {testimonial.company ? `at ${testimonial.company}` : ''}
                    </td>
                    <td className="p-4">
                      {testimonial.rating ? (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4">
                      {testimonial.is_featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">✓ Featured</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          testimonial.is_visible
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {testimonial.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(testimonial.id, testimonial.is_visible)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={testimonial.is_visible ? 'Hide' : 'Show'}
                        >
                          {testimonial.is_visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/testimonials/${testimonial.id}`}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
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
