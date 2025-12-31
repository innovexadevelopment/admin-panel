'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { supabase } from '../../../lib/supabase/client'
import { SearchInput } from '../../../components/search-input'
import type { ContactSubmission, CompanyContactSubmission } from '../../../lib/types-separate'
import { getTableName } from '../../../lib/utils/tables'
import { Mail, Eye, Trash2, CheckCircle, Clock, Archive } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../../../lib/hooks/use-toast'

type Submission = ContactSubmission | CompanyContactSubmission

export default function ContactSubmissionsPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    loadSubmissions()
  }, [currentWebsite])

  async function loadSubmissions() {
    setLoading(true)
    try {
      const tableName = getTableName(currentWebsite, 'contact_submissions')
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading submissions:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }
      setSubmissions(data || [])
    } catch (error: any) {
      console.error('Error loading submissions:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load submissions',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions
    const query = searchQuery.toLowerCase()
    return submissions.filter(submission => 
      submission.name.toLowerCase().includes(query) ||
      submission.email.toLowerCase().includes(query) ||
      submission.phone?.toLowerCase().includes(query) ||
      submission.message.toLowerCase().includes(query) ||
      (submission as ContactSubmission).type?.toLowerCase().includes(query) ||
      submission.subject?.toLowerCase().includes(query) ||
      (submission as CompanyContactSubmission).service_interest?.toLowerCase().includes(query) ||
      (submission as CompanyContactSubmission).budget_range?.toLowerCase().includes(query)
    )
  }, [submissions, searchQuery])

  async function updateStatus(submissionId: string, newStatus: 'new' | 'read' | 'replied' | 'archived') {
    const tableName = getTableName(currentWebsite, 'contact_submissions')
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', submissionId)

    if (error) {
      console.error('Error updating submission:', error)
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
      description: 'Submission status updated successfully!',
    })
    loadSubmissions()
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus })
    }
  }

  async function deleteSubmission(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) return

    const tableName = getTableName(currentWebsite, 'contact_submissions')
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting submission:', error)
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
      description: 'Submission deleted successfully!',
    })
    loadSubmissions()
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null)
    }
  }

  function getStatusBadge(status: string) {
    const badges = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      read: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return badges[status as keyof typeof badges] || badges.new
  }

  function getTypeBadge(type?: string) {
    if (!type) return 'bg-gray-100 text-gray-800'
    const badges = {
      volunteer: 'bg-purple-100 text-purple-800',
      donate: 'bg-green-100 text-green-800',
      partner: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
    }
    return badges[type as keyof typeof badges] || badges.general
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-b-2 border-primary rounded-full"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Contact Submissions
          </h1>
          <p className="text-muted-foreground">Manage contact form submissions from the website</p>
        </div>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, message, type..."
        />
      </div>

      {selectedSubmission ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedSubmission.name}</h2>
              <p className="text-muted-foreground">{selectedSubmission.email}</p>
              {selectedSubmission.phone && (
                <p className="text-muted-foreground">{selectedSubmission.phone}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {(selectedSubmission as ContactSubmission).type && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Type:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge((selectedSubmission as ContactSubmission).type)}`}>
                  {(selectedSubmission as ContactSubmission).type}
                </span>
              </div>
            )}
            {(selectedSubmission as CompanyContactSubmission).service_interest && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Service Interest:</span>
                <span className="ml-2">{(selectedSubmission as CompanyContactSubmission).service_interest}</span>
              </div>
            )}
            {(selectedSubmission as CompanyContactSubmission).budget_range && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Budget Range:</span>
                <span className="ml-2">{(selectedSubmission as CompanyContactSubmission).budget_range}</span>
              </div>
            )}
            {selectedSubmission.subject && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Subject:</span>
                <span className="ml-2">{selectedSubmission.subject}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-muted-foreground">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedSubmission.status)}`}>
                {selectedSubmission.status}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-muted-foreground">Submitted:</span>
              <span className="ml-2">{new Date(selectedSubmission.created_at).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-muted-foreground block mb-2">Message:</span>
              <p className="text-foreground bg-muted p-4 rounded-lg">{selectedSubmission.message}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(selectedSubmission.id, 'read')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Mark as Read
            </button>
            <button
              onClick={() => updateStatus(selectedSubmission.id, 'replied')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Replied
            </button>
            <button
              onClick={() => updateStatus(selectedSubmission.id, 'archived')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </div>
        </motion.div>
      ) : null}

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Name</th>
                  <th className="text-left p-4 font-semibold text-sm">Email</th>
                  <th className="text-left p-4 font-semibold text-sm">Type</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-t hover:bg-muted/30 cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <td className="p-4 font-medium">{submission.name}</td>
                    <td className="p-4 text-muted-foreground">{submission.email}</td>
                    <td className="p-4">
                      {(submission as ContactSubmission).type ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadge((submission as ContactSubmission).type)}`}>
                          {(submission as ContactSubmission).type}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSubmission(submission.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

