'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { FormInput, FormTextarea, FormSelect, FormButton } from '../../../../components/form-input'
import type { BlogPost } from '../../../../lib/types-separate'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image_id: '',
  })

  useEffect(() => {
    loadBlog()
  }, [params.id, currentWebsite])

  async function loadBlog() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'blog_posts')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setBlog(data)
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || '',
        tags: data.tags?.join(', ') || '',
        status: data.status || 'draft',
        featured_image_id: data.featured_image_id || '',
      })
    } catch (error) {
      console.error('Error loading blog:', error)
      alert('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const tableName = getTableName(currentWebsite, 'blog_posts')
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []

      const { error } = await supabase
        .from(tableName)
        .update({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          category: formData.category || null,
          tags: tagsArray,
          status: formData.status,
          featured_image_id: formData.featured_image_id || null,
          published_at: formData.status === 'published' && !blog?.published_at
            ? new Date().toISOString()
            : blog?.published_at,
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/blogs')
    } catch (error: any) {
      console.error('Error updating blog:', error)
      alert(`Failed to update blog post: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Blog post not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard/blogs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group"
        >
          <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          Back to Blog Posts
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          Edit Blog Post
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Update the blog post details below
        </motion.p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-card border rounded-2xl p-8 shadow-lg space-y-6"
      >
        <FormInput
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter blog post title"
          required
        />

        <FormInput
          label="Slug"
          name="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="url-friendly-identifier"
          required
          helperText="URL-friendly identifier (e.g., 'my-blog-post')"
        />

        <FormTextarea
          label="Excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Short description of the blog post"
          rows={3}
        />

        <ImageUpload
          value={formData.featured_image_id}
          onChange={(id) => setFormData({ ...formData, featured_image_id: id || '' })}
          folder="blogs"
          label="Featured Image"
          altText={formData.title || 'Blog featured image'}
        />

        <FormTextarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Blog post content"
          rows={12}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Category"
            name="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Technology, News"
          />

          <FormInput
            label="Tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="comma-separated tags"
            helperText="Separate tags with commas"
          />
        </div>

        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />

        <div className="flex gap-4 pt-4">
          <FormButton
            type="submit"
            disabled={saving}
            loading={saving}
            icon={<Save className="h-4 w-4" />}
            className="flex-1"
          >
            Save Changes
          </FormButton>
          <FormButton
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/blogs')}
            className="px-8"
          >
            Cancel
          </FormButton>
        </div>
      </motion.form>
    </div>
  )
}

