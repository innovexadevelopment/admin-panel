'use client'

import { useEffect, useState, useMemo } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { useAdminUser } from '../../../lib/hooks/use-admin-user'
import { supabase } from '../../../lib/supabase/client'
import { SearchInput } from '../../../components/search-input'
import { DollarSign, Eye, Trash2, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../../../lib/hooks/use-toast'

interface Donation {
  id: string
  donor_name: string
  donor_email: string
  donor_phone?: string
  amount: number
  currency: string
  payment_method?: string
  payment_status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  payment_reference?: string
  notes?: string
  metadata?: any
  confirmed_by?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

export default function DonationsPage() {
  const { currentWebsite } = useWebsite()
  const { adminUser } = useAdminUser()
  const { toast } = useToast()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed' | 'cancelled'>('all')
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)

  useEffect(() => {
    if (currentWebsite === 'ngo') {
      loadDonations()
    }
  }, [currentWebsite])

  async function loadDonations() {
    if (currentWebsite !== 'ngo') return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ngo_donations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading donations:', error)
        toast({
          variant: 'error',
          title: 'Error',
          description: error.message,
        })
        return
      }
      setDonations(data || [])
    } catch (error: any) {
      console.error('Error loading donations:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to load donations',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDonations = useMemo(() => {
    let filtered = donations

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.payment_status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(donation => 
        donation.donor_name.toLowerCase().includes(query) ||
        donation.donor_email.toLowerCase().includes(query) ||
        donation.donor_phone?.toLowerCase().includes(query) ||
        donation.payment_reference?.toLowerCase().includes(query) ||
        donation.amount.toString().includes(query)
      )
    }

    return filtered
  }, [donations, searchQuery, statusFilter])

  async function confirmPayment(donationId: string) {
    if (!adminUser?.id) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Unable to identify admin user',
      })
      return
    }

    if (!confirm('Are you sure you want to confirm this payment has been received?')) return

    const { error } = await supabase
      .from('ngo_donations')
      .update({ 
        payment_status: 'confirmed',
        confirmed_by: adminUser.id,
        confirmed_at: new Date().toISOString()
      })
      .eq('id', donationId)

      if (error) {
        console.error('Error confirming payment:', error)
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
        description: 'Payment confirmed successfully!',
      })
      loadDonations()
    if (selectedDonation?.id === donationId) {
      setSelectedDonation({ ...selectedDonation, payment_status: 'confirmed', confirmed_by: adminUser.id, confirmed_at: new Date().toISOString() })
    }
  }

  async function updateStatus(donationId: string, status: 'pending' | 'confirmed' | 'failed' | 'cancelled') {
    const { error } = await supabase
      .from('ngo_donations')
      .update({ payment_status: status })
      .eq('id', donationId)

    if (error) {
      console.error('Error updating donation:', error)
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
      description: 'Donation status updated successfully!',
    })
    loadDonations()
    if (selectedDonation?.id === donationId) {
      setSelectedDonation({ ...selectedDonation, payment_status: status })
    }
  }

  async function deleteDonation(id: string) {
    if (!confirm('Are you sure you want to delete this donation record?')) return

    const { error } = await supabase
      .from('ngo_donations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting donation:', error)
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
      description: 'Donation deleted successfully!',
    })
    loadDonations()
    if (selectedDonation?.id === id) {
      setSelectedDonation(null)
    }
  }

  function getStatusBadge(status: string) {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircle },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: XCircle },
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  function formatCurrency(amount: number, currency: string = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const totalAmount = filteredDonations
    .filter(d => d.payment_status === 'confirmed')
    .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)

  const pendingAmount = filteredDonations
    .filter(d => d.payment_status === 'pending')
    .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)

  if (currentWebsite !== 'ngo') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Donations are only available for NGO website.</p>
      </div>
    )
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
            Donations
          </h1>
          <p className="text-muted-foreground">Manage and confirm donation payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Confirmed</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {filteredDonations.filter(d => d.payment_status === 'confirmed').length} donations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {filteredDonations.filter(d => d.payment_status === 'pending').length} donations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{filteredDonations.length}</p>
          <p className="text-xs text-muted-foreground mt-2">All statuses</p>
        </motion.div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, amount..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {selectedDonation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedDonation.donor_name}</h2>
              <p className="text-muted-foreground">{selectedDonation.donor_email}</p>
              {selectedDonation.donor_phone && (
                <p className="text-muted-foreground">{selectedDonation.donor_phone}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedDonation(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-sm font-semibold text-muted-foreground block mb-2">Amount</span>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedDonation.amount, selectedDonation.currency)}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-muted-foreground block mb-2">Status</span>
              {(() => {
                const badge = getStatusBadge(selectedDonation.payment_status)
                const Icon = badge.icon
                return (
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                    <Icon className="h-4 w-4" />
                    {selectedDonation.payment_status}
                  </span>
                )
              })()}
            </div>
            <div>
              <span className="text-sm font-semibold text-muted-foreground block mb-2">Submitted</span>
              <p>{new Date(selectedDonation.created_at).toLocaleString()}</p>
            </div>
            {selectedDonation.confirmed_at && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground block mb-2">Confirmed At</span>
                <p>{new Date(selectedDonation.confirmed_at).toLocaleString()}</p>
              </div>
            )}
            {selectedDonation.payment_reference && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground block mb-2">Payment Reference</span>
                <p className="font-mono">{selectedDonation.payment_reference}</p>
              </div>
            )}
            {selectedDonation.notes && (
              <div className="md:col-span-2">
                <span className="text-sm font-semibold text-muted-foreground block mb-2">Notes</span>
                <p className="bg-muted p-4 rounded-lg">{selectedDonation.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {selectedDonation.payment_status === 'pending' && (
              <button
                onClick={() => confirmPayment(selectedDonation.id)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="h-5 w-5" />
                Confirm Payment Received
              </button>
            )}
            {selectedDonation.payment_status !== 'failed' && (
              <button
                onClick={() => updateStatus(selectedDonation.id, 'failed')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Mark as Failed
              </button>
            )}
            {selectedDonation.payment_status !== 'cancelled' && (
              <button
                onClick={() => updateStatus(selectedDonation.id, 'cancelled')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>
      )}

      {filteredDonations.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No donations found</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Donor</th>
                  <th className="text-left p-4 font-semibold text-sm">Email</th>
                  <th className="text-left p-4 font-semibold text-sm">Amount</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => {
                  const badge = getStatusBadge(donation.payment_status)
                  const Icon = badge.icon
                  return (
                    <tr
                      key={donation.id}
                      className="border-t hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelectedDonation(donation)}
                    >
                      <td className="p-4 font-medium">{donation.donor_name}</td>
                      <td className="p-4 text-muted-foreground">{donation.donor_email}</td>
                      <td className="p-4 font-bold text-green-600">{formatCurrency(donation.amount, donation.currency)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <Icon className="h-3 w-3" />
                          {donation.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {donation.payment_status === 'pending' && (
                            <button
                              onClick={() => confirmPayment(donation.id)}
                              className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                              title="Confirm Payment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

