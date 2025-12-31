'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import { SearchInput } from '../../../components/search-input'
import type { BlogPost, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'
import { motion } from 'framer-motion'

interface BlogPostWithImage extends BlogPost {
  featured_image?: Media
}

export default function BlogsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<BlogPostWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadBlogs()
  }, [currentWebsite])

  async function loadBlogs() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'blog_posts')
      const mediaTableName = getTableName(currentWebsite, 'media')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading blogs:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      // Fetch images separately
      const blogsWithImages = await Promise.all((data || []).map(async (blog: any) => {
        if (blog.featured_image_id) {
          const { data: imageData } = await supabase
            .from(mediaTableName)
            .select('id, file_url, file_name, alt_text')
            .eq('id', blog.featured_image_id)
            .single()
          
          return { ...blog, featured_image: imageData || undefined }
        }
        return { ...blog, featured_image: undefined }
      }))

      setBlogs(blogsWithImages)
    } catch (error: any) {
      console.error('Error loading blogs:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load blogs',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs
    const query = searchQuery.toLowerCase()
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(query) ||
      blog.slug.toLowerCase().includes(query) ||
      blog.category?.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }, [blogs, searchQuery])

  async function toggleVisibility(blogId: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const tableName = getTableName(currentWebsite, 'blog_posts')
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', blogId)

    if (error) {
      console.error('Error updating blog:', error)
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
      description: 'Blog status updated successfully!',
    })
    loadBlogs()
  }

  async function deleteBlog(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    const tableName = getTableName(currentWebsite, 'blog_posts')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog:', error)
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
      description: 'Blog deleted successfully!',
    })
    loadBlogs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
          >
            <BookOpen className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
            >
              Blog Posts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg"
            >
              Manage blog articles and content
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/dashboard/blogs/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            New Post
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search blogs by title, slug, category, or tags..."
          className="max-w-md"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground/90">Image</th>
                <th className="text-left p-4 font-semibold text-foreground/90">Title</th>
                <th className="text-left p-4 font-semibold text-foreground/90">Slug</th>
                <th className="text-left p-4 font-semibold text-foreground/90">Status</th>
                <th className="text-left p-4 font-semibold text-foreground/90">Published</th>
                <th className="text-left p-4 font-semibold text-foreground/90">Views</th>
                <th className="text-right p-4 font-semibold text-foreground/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'No blogs found matching your search.' : 'No blog posts yet. Create your first post!'}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-border/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="p-4">
                      {blog.featured_image?.file_url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={blog.featured_image.file_url}
                            alt={blog.featured_image.alt_text || blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{blog.title}</td>
                    <td className="p-4 text-muted-foreground">/{blog.slug}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString()
                        : <span className="text-muted-foreground/50">-</span>}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                        {blog.view_count || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleVisibility(blog.id, blog.status)}
                          className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 group/btn"
                          title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {blog.status === 'published' ? (
                            <EyeOff className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          ) : (
                            <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          )}
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            href={`/dashboard/blogs/${blog.id}`}
                            className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 inline-block"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteBlog(blog.id)}
                          className="p-2.5 hover:bg-destructive/10 text-destructive hover:text-destructive rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

