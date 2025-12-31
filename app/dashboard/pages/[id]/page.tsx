'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useWebsite } from '../../../../lib/hooks/use-website-context'
import { supabase } from '../../../../lib/supabase/client'
import { getTableName } from '../../../../lib/utils/tables'
import type { Page, Section, ContentBlock } from '../../../../lib/types'
import { ArrowLeft, Plus, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [page, setPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPage()
  }, [params.id])

  async function loadPage() {
    setLoading(true)
    try {
      const pagesTable = getTableName(currentWebsite, 'pages')
      const { data: pageData, error: pageError } = await supabase
        .from(pagesTable)
        .select('*')
        .eq('id', params.id)
        .single()

      if (pageError) throw pageError
      setPage(pageData)

      const sectionsTable = getTableName(currentWebsite, 'sections')
      const { data: sectionsData, error: sectionsError } = await supabase
        .from(sectionsTable)
        .select('*')
        .eq('page_id', params.id)
        .order('order_index', { ascending: true })

      if (sectionsError) throw sectionsError
      setSections(sectionsData || [])
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addSection() {
    if (!page) return

    const sectionsTable = getTableName(currentWebsite, 'sections')
    const { data, error } = await supabase
      .from(sectionsTable)
      .insert({
        page_id: page.id,
        type: 'content',
        title: 'New Section',
        order_index: sections.length,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating section:', error)
      return
    }

    setSections([...sections, data])
  }

  async function updateSection(sectionId: string, updates: Partial<Section>) {
    const sectionsTable = getTableName(currentWebsite, 'sections')
    const { error } = await supabase
      .from(sectionsTable)
      .update(updates)
      .eq('id', sectionId)

    if (error) {
      console.error('Error updating section:', error)
      return
    }

    loadPage()
  }

  async function deleteSection(sectionId: string) {
    if (!confirm('Delete this section?')) return

    const sectionsTable = getTableName(currentWebsite, 'sections')
    const { error } = await supabase
      .from(sectionsTable)
      .delete()
      .eq('id', sectionId)

    if (error) {
      console.error('Error deleting section:', error)
      return
    }

    loadPage()
  }

  async function publishPage() {
    if (!page) return
    setSaving(true)

    const pagesTable = getTableName(currentWebsite, 'pages')
    const { error } = await supabase
      .from(pagesTable)
      .update({ status: 'published' })
      .eq('id', page.id)

    if (error) {
      console.error('Error publishing page:', error)
    } else {
      loadPage()
    }
    setSaving(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/pages"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pages
        </Link>
        <div className="flex gap-2">
          <button
            onClick={publishPage}
            disabled={saving || page.status === 'published'}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            {page.status === 'published' ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
        <p className="text-muted-foreground">
          Slug: /{page.slug} • Status: {page.status}
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            onUpdate={(updates) => updateSection(section.id, updates)}
            onDelete={() => deleteSection(section.id)}
          />
        ))}

        <button
          onClick={addSection}
          className="w-full p-8 border-2 border-dashed rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Section
        </button>
      </div>
    </div>
  )
}

function SectionEditor({
  section,
  onUpdate,
  onDelete,
}: {
  section: Section
  onUpdate: (updates: Partial<Section>) => void
  onDelete: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
            placeholder="Section Title"
          />
          <select
            value={section.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="hero">Hero</option>
            <option value="content">Content</option>
            <option value="about">About</option>
            <option value="services">Services</option>
            <option value="testimonials">Testimonials</option>
            <option value="cta">Call to Action</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={section.is_visible}
              onChange={(e) => onUpdate({ is_visible: e.target.checked })}
            />
            Visible
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm border border-destructive text-destructive rounded hover:bg-destructive/10"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input
                type="color"
                value={section.background_color || '#ffffff'}
                onChange={(e) => onUpdate({ background_color: e.target.value })}
                className="w-full h-10 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Padding Top</label>
              <input
                type="number"
                value={section.padding_top}
                onChange={(e) => onUpdate({ padding_top: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Image URL</label>
            <input
              type="text"
              value={section.background_image_url || ''}
              onChange={(e) => onUpdate({ background_image_url: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://..."
            />
          </div>
          <ContentBlocksEditor sectionId={section.id} />
        </div>
      )}
    </div>
  )
}

function ContentBlocksEditor({ sectionId }: { sectionId: string }) {
  const { currentWebsite } = useWebsite()
  const [blocks, setBlocks] = useState<ContentBlock[]>([])

  useEffect(() => {
    loadBlocks()
  }, [sectionId, currentWebsite])

  async function loadBlocks() {
    const contentBlocksTable = getTableName(currentWebsite, 'content_blocks')
    const { data, error } = await supabase
      .from(contentBlocksTable)
      .select('*')
      .eq('section_id', sectionId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error loading blocks:', error)
      return
    }

    setBlocks(data || [])
  }

  async function addBlock() {
    const contentBlocksTable = getTableName(currentWebsite, 'content_blocks')
    const { data, error } = await supabase
      .from(contentBlocksTable)
      .insert({
        section_id: sectionId,
        type: 'paragraph',
        content: { text: '' },
        order_index: blocks.length,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating block:', error)
      return
    }

    setBlocks([...blocks, data])
  }

  async function updateBlock(blockId: string, updates: Partial<ContentBlock>) {
    const contentBlocksTable = getTableName(currentWebsite, 'content_blocks')
    const { error } = await supabase
      .from(contentBlocksTable)
      .update(updates)
      .eq('id', blockId)

    if (error) {
      console.error('Error updating block:', error)
      return
    }

    loadBlocks()
  }

  async function deleteBlock(blockId: string) {
    const contentBlocksTable = getTableName(currentWebsite, 'content_blocks')
    const { error } = await supabase
      .from(contentBlocksTable)
      .delete()
      .eq('id', blockId)

    if (error) {
      console.error('Error deleting block:', error)
      return
    }

    loadBlocks()
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-2">Content Blocks</div>
      {blocks.map((block) => (
        <div key={block.id} className="border rounded p-3 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <select
              value={block.type}
              onChange={(e) => updateBlock(block.id, { type: e.target.value as any })}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="heading">Heading</option>
              <option value="paragraph">Paragraph</option>
              <option value="cta">CTA</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button
              onClick={() => deleteBlock(block.id)}
              className="text-xs text-destructive hover:underline"
            >
              Delete
            </button>
          </div>
          {block.type === 'heading' && (
            <input
              type="text"
              value={block.content?.text || ''}
              onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Heading text"
            />
          )}
          {block.type === 'paragraph' && (
            <textarea
              value={block.content?.text || ''}
              onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
              className="w-full px-3 py-2 border rounded"
              rows={3}
              placeholder="Paragraph text"
            />
          )}
        </div>
      ))}
      <button
        onClick={addBlock}
        className="text-sm text-primary hover:underline"
      >
        + Add Block
      </button>
    </div>
  )
}

