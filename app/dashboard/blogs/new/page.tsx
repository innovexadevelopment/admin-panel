'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import { ImageUpload } from '../../../../components/image-upload'
import { FormInput, FormTextarea, FormSelect, FormButton } from '../../../../components/form-input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        alert(`Authentication error: ${authError.message}\n\nPlease log in first.`)
        return
      }

      // Get admin user ID
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .eq('is_active', true)
        .single()

      // Parse tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []

      // Create blog post using correct table name
      const tableName = getTableName(currentWebsite, 'blog_posts')
      const { data: blog, error } = await supabase
        .from(tableName)
        .insert({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          excerpt: formData.excerpt || null,
          content: formData.content,
          category: formData.category || null,
          tags: tagsArray,
          status: formData.status,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
          author_id: adminUser?.id || null,
          featured_image_id: formData.featured_image_id || null,
          view_count: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating blog post:', error)
        alert(`Error creating blog post: ${error.message}\n\nCommon issues:\n- Not authenticated\n- Missing admin_users record\n- RLS policy blocking access`)
        return
      }

      router.push(`/dashboard/blogs`)
    } catch (error: any) {
      console.error('Error creating blog post:', error)
      alert(`Failed to create blog post: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
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
          <motion.div
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
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
          Create New Blog Post
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Fill in the details below to create a new blog post
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
          placeholder="auto-generated from title"
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
            disabled={loading}
            loading={loading}
            icon={<Save className="h-4 w-4" />}
            className="flex-1"
          >
            Create Blog Post
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

