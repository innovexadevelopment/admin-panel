'use client'

import { useEffect, useState } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import type { ImpactStat } from '../../../lib/types-separate'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '../../../lib/hooks/use-toast'

export default function ImpactStatsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [stats, setStats] = useState<ImpactStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentWebsite === 'ngo') {
      loadStats()
    }
  }, [currentWebsite])

  async function loadStats() {
    if (currentWebsite !== 'ngo') return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ngo_impact_stats')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error loading impact stats:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }
      setStats(data || [])
    } catch (error: any) {
      console.error('Error loading impact stats:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load impact stats',
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleVisibility(statId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('ngo_impact_stats')
      .update({ is_visible: !currentStatus })
      .eq('id', statId)

    if (error) {
      console.error('Error updating stat:', error)
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
      description: 'Impact stat updated successfully!',
    })
    loadStats()
  }

  async function deleteStat(id: string) {
    if (!confirm('Are you sure you want to delete this impact stat?')) return

    const { error } = await supabase
      .from('ngo_impact_stats')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting stat:', error)
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
      description: 'Impact stat deleted successfully!',
    })
    loadStats()
  }

  if (currentWebsite !== 'ngo') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impact Stats are only available for NGO website.</p>
      </div>
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Impact Statistics</h1>
          <p className="text-muted-foreground">Manage impact metrics and statistics</p>
        </div>
        <Link
          href="/dashboard/impact-stats/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          New Stat
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">Label</th>
              <th className="text-left p-4 font-medium">Value</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Year</th>
              <th className="text-left p-4 font-medium">Visible</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No impact stats yet. Add your first stat!
                </td>
              </tr>
            ) : (
              stats.map((stat) => (
                <tr key={stat.id} className="border-t hover:bg-muted/50">
                  <td className="p-4 font-medium">{stat.label}</td>
                  <td className="p-4 font-bold text-lg">{stat.value}</td>
                  <td className="p-4 text-sm text-muted-foreground">{stat.category || '-'}</td>
                  <td className="p-4 text-sm text-muted-foreground">{stat.year || '-'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        stat.is_visible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {stat.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleVisibility(stat.id, stat.is_visible)}
                        className="p-2 hover:bg-muted rounded"
                        title={stat.is_visible ? 'Hide' : 'Show'}
                      >
                        {stat.is_visible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/dashboard/impact-stats/${stat.id}`}
                        className="p-2 hover:bg-muted rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteStat(stat.id)}
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

