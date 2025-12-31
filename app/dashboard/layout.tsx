'use client'

import { useEffect, useState } from 'react'
import { WebsiteSwitcher } from '../../components/website-switcher'
import { LayoutDashboard, FileText, Image, Users, MessageSquare, Building2, BookOpen, Settings, LogOut, User, Shield, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabase/client'
import { signOut } from '../../lib/utils/auth'
import { useWebsite } from '../../lib/hooks/use-website-context'
import { Toaster } from '../../components/toaster'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/login'
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  async function loadUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
      // Clear all cookies and localStorage
      if (typeof window !== 'undefined') {
        document.cookie.split(";").forEach(c => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
      }
      // Hard redirect to ensure clean state
      window.location.href = '/login'
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-card shadow-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
            >
              Admin Panel
            </motion.h1>
            <WebsiteSwitcher />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </motion.div>
                  <motion.button
                    onClick={handleSignOut}
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      <div className="flex pt-[73px]">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="fixed top-[73px] left-0 w-64 h-[calc(100vh-73px)] border-r bg-card shadow-sm overflow-y-auto z-40"
        >
          <nav className="p-4 space-y-1">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.3,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              <NavLink href="/dashboard" icon={LayoutDashboard} isActive={pathname === '/dashboard'}>
                Dashboard
              </NavLink>
              <NavLink href="/dashboard/pages" icon={FileText} isActive={pathname?.startsWith('/dashboard/pages')}>
                Pages
              </NavLink>
              <NavLink href="/dashboard/blogs" icon={BookOpen} isActive={pathname?.startsWith('/dashboard/blogs')}>
                Blogs
              </NavLink>
              <NavLink href="/dashboard/media" icon={Image} isActive={pathname?.startsWith('/dashboard/media')}>
                Media
              </NavLink>
              <NavLink href="/dashboard/team" icon={Users} isActive={pathname?.startsWith('/dashboard/team')}>
                Team
              </NavLink>
              <NavLink href="/dashboard/testimonials" icon={MessageSquare} isActive={pathname?.startsWith('/dashboard/testimonials')}>
                Testimonials
              </NavLink>
              <NavLink href="/dashboard/partners" icon={Building2} isActive={pathname?.startsWith('/dashboard/partners')}>
                Partners
              </NavLink>
              <NavLink href="/dashboard/programs" icon={BookOpen} isActive={pathname?.startsWith('/dashboard/programs')}>
                Programs/Services
              </NavLink>
              {currentWebsite === 'ngo' && (
                <NavLink href="/dashboard/impact-stats" icon={BookOpen} isActive={pathname?.startsWith('/dashboard/impact-stats')}>
                  Impact Stats
                </NavLink>
              )}
              {currentWebsite === 'company' && (
                <NavLink href="/dashboard/projects" icon={Building2} isActive={pathname?.startsWith('/dashboard/projects')}>
                  Projects
                </NavLink>
              )}
              <NavLink href="/dashboard/contact-submissions" icon={MessageSquare} isActive={pathname?.startsWith('/dashboard/contact-submissions')}>
                Contact Submissions
              </NavLink>
              {currentWebsite === 'ngo' && (
                <NavLink href="/dashboard/donations" icon={DollarSign} isActive={pathname?.startsWith('/dashboard/donations')}>
                  Donations
                </NavLink>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 mt-4 border-t"
              >
                <NavLink href="/dashboard/admin-users" icon={Shield} isActive={pathname?.startsWith('/dashboard/admin-users')}>
                  Admin Users
                </NavLink>
                <NavLink href="/dashboard/settings" icon={Settings} isActive={pathname?.startsWith('/dashboard/settings')}>
                  Settings
                </NavLink>
              </motion.div>
            </motion.div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 ml-64 p-8"
        >
          {children}
        </motion.main>
      </div>
      <Toaster />
    </div>
  )
}

function NavLink({ href, icon: Icon, children, isActive }: { href: string; icon: any; children: React.ReactNode; isActive?: boolean }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 relative group",
          isActive ? "bg-muted font-medium text-primary" : "hover:bg-muted/50"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <span>{children}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  )
}

