'use client'

import { useEffect, useState } from 'react'
import { useWebsite } from '../../lib/hooks/use-website-context'
import { supabase } from '../../lib/supabase/client'
import { getTableName } from '../../lib/utils/tables'
import { FileText, BookOpen, Image, Users, MessageSquare, Building2, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Stats {
  pages: number
  blogs: number
  media: number
  team: number
  testimonials: number
  partners: number
  programs: number
}

export default function DashboardPage() {
  const { currentWebsite } = useWebsite()
  const websiteName = currentWebsite === 'company' ? 'Innovexa' : 'DUAF'
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    blogs: 0,
    media: 0,
    team: 0,
    testimonials: 0,
    partners: 0,
    programs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [currentWebsite])

  async function loadStats() {
    setLoading(true)
    try {
      const [
        pagesResult,
        blogsResult,
        mediaResult,
        teamResult,
        testimonialsResult,
        partnersResult,
        programsResult,
      ] = await Promise.all([
        supabase.from(getTableName(currentWebsite, 'pages')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'blog_posts')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'media')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'team_members')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'testimonials')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'partners')).select('id', { count: 'exact', head: true }),
        supabase.from(getTableName(currentWebsite, 'programs')).select('id', { count: 'exact', head: true }),
      ])

      setStats({
        pages: pagesResult.count || 0,
        blogs: blogsResult.count || 0,
        media: mediaResult.count || 0,
        team: teamResult.count || 0,
        testimonials: testimonialsResult.count || 0,
        partners: partnersResult.count || 0,
        programs: programsResult.count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Pages', value: stats.pages, icon: FileText, href: '/dashboard/pages' },
    { label: 'Blog Posts', value: stats.blogs, icon: BookOpen, href: '/dashboard/blogs' },
    { label: 'Media Files', value: stats.media, icon: Image, href: '/dashboard/media' },
    { label: 'Team Members', value: stats.team, icon: Users, href: '/dashboard/team' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, href: '/dashboard/testimonials' },
    { label: 'Partners', value: stats.partners, icon: Building2, href: '/dashboard/partners' },
    { label: currentWebsite === 'company' ? 'Services' : 'Programs', value: stats.programs, icon: BookOpen, href: '/dashboard/programs' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
          >
            <LayoutDashboard className="h-7 w-7 text-primary" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg"
            >
              Managing content for <strong className="text-foreground font-semibold">{websiteName}</strong>
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={stat.href}
                className="bg-gradient-to-br from-card via-card to-card/95 border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group relative overflow-hidden block"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                    >
                      <Icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="w-2 h-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                  >
                    {loading ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    ) : (
                      stat.value
                    )}
                  </motion.div>
                  <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
