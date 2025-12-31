'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { getTableName } from '../../../lib/utils/tables'
import { SearchInput } from '../../../components/search-input'
import type { Partner, Media } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

interface PartnerWithImage extends Partner {
  logo?: Media
}

export default function PartnersPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [partners, setPartners] = useState<PartnerWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPartners()
  }, [currentWebsite])

  async function loadPartners() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'partners')
      const mediaTableName = getTableName(currentWebsite, 'media')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading partners:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }

      // Fetch logos for partners
      const partnersWithImages = await Promise.all((data || []).map(async (partner) => {
        if (partner.logo_id) {
          const { data: imageData } = await supabase
            .from(mediaTableName)
            .select('id, file_url, file_name, alt_text')
            .eq('id', partner.logo_id)
            .single()
          
          return { ...partner, logo: imageData || undefined }
        }
        return { ...partner, logo: undefined }
      }))

      setPartners(partnersWithImages)
    } catch (error: any) {
      console.error('Error loading partners:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load partners',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners
    const query = searchQuery.toLowerCase()
    return partners.filter(partner => 
      partner.name.toLowerCase().includes(query) ||
      partner.category?.toLowerCase().includes(query) ||
      partner.description?.toLowerCase().includes(query) ||
      partner.website_url?.toLowerCase().includes(query)
    )
  }, [partners, searchQuery])

  async function toggleVisibility(partnerId: string, currentStatus: boolean) {
    const tableName = getTableName(currentWebsite, 'partners')
    const { error } = await supabase
      .from(tableName)
      .update({ is_visible: !currentStatus })
      .eq('id', partnerId)

    if (error) {
      console.error('Error updating partner:', error)
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
      description: 'Partner updated successfully!',
    })
    loadPartners()
  }

  async function deletePartner(id: string) {
    if (!confirm('Are you sure you want to delete this partner?')) return

    const tableName = getTableName(currentWebsite, 'partners')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting partner:', error)
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
      description: 'Partner deleted successfully!',
    })
    loadPartners()
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
          <h1 className="text-3xl font-bold mb-2">Partners</h1>
          <p className="text-muted-foreground">Manage partners and sponsors</p>
        </div>
        <Link
          href="/dashboard/partners/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Partner
        </Link>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search partners by name, category, description..."
          className="max-w-md"
        />
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Logo</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Website</th>
                <th className="text-left p-4 font-medium">Visible</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'No partners found matching your search.' : 'No partners yet. Add your first partner!'}
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {partner.logo?.file_url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={partner.logo.file_url}
                            alt={partner.logo.alt_text || partner.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{partner.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{partner.category || '-'}</td>
                    <td className="p-4 text-sm">
                      {partner.website_url ? (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          partner.is_visible
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {partner.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(partner.id, partner.is_visible)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={partner.is_visible ? 'Hide' : 'Show'}
                        >
                          {partner.is_visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/partners/${partner.id}`}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deletePartner(partner.id)}
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
