'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { WebsiteType } from '../types'

interface WebsiteContextType {
  currentWebsite: WebsiteType
  setCurrentWebsite: (website: WebsiteType) => void
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined)

const WEBSITE_STORAGE_KEY = 'admin_current_website'

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [currentWebsite, setCurrentWebsiteState] = useState<WebsiteType>('company')

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WEBSITE_STORAGE_KEY)
      if (stored === 'company' || stored === 'ngo') {
        setCurrentWebsiteState(stored)
      }
    }
  }, [])

  const setCurrentWebsite = (website: WebsiteType) => {
    setCurrentWebsiteState(website)
    if (typeof window !== 'undefined') {
      localStorage.setItem(WEBSITE_STORAGE_KEY, website)
    }
  }

  return (
    <WebsiteContext.Provider value={{ currentWebsite, setCurrentWebsite }}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsite() {
  const context = useContext(WebsiteContext)
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider')
  }
  return context
}

