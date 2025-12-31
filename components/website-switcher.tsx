'use client'

import { useWebsite } from '../lib/hooks/use-website-context'
import { Building2, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export function WebsiteSwitcher() {
  const { currentWebsite, setCurrentWebsite } = useWebsite()

  const handleSwitch = (website: 'company' | 'ngo') => {
    if (website !== currentWebsite) {
      setCurrentWebsite(website)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 border border-border/50"
    >
      <motion.button
        type="button"
        onClick={() => handleSwitch('company')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-md transition-all relative',
          'hover:bg-background cursor-pointer',
          currentWebsite === 'company'
            ? 'bg-background shadow-sm font-medium text-foreground'
            : 'text-muted-foreground'
        )}
      >
        {currentWebsite === 'company' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-background rounded-md border border-border"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <motion.div
          animate={currentWebsite === 'company' ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Building2 className="h-4 w-4" />
        </motion.div>
        <span className="relative z-10">Innovexa</span>
      </motion.button>
      <motion.button
        type="button"
        onClick={() => handleSwitch('ngo')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-md transition-all relative',
          'hover:bg-background cursor-pointer',
          currentWebsite === 'ngo'
            ? 'bg-background shadow-sm font-medium text-foreground'
            : 'text-muted-foreground'
        )}
      >
        {currentWebsite === 'ngo' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-background rounded-md border border-border"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <motion.div
          animate={currentWebsite === 'ngo' ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Heart className="h-4 w-4" />
        </motion.div>
        <span className="relative z-10">DUAF</span>
      </motion.button>
    </motion.div>
  )
}

