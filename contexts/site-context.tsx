"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type SiteType = "company" | "ngo"

interface SiteContextType {
  site: SiteType
  setSite: (site: SiteType) => void
  toggleSite: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSiteState] = useState<SiteType>("company")

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin-site-preference") as SiteType | null
    if (saved === "company" || saved === "ngo") {
      setSiteState(saved)
    }
  }, [])

  // Save to localStorage when site changes
  const setSite = (newSite: SiteType) => {
    setSiteState(newSite)
    localStorage.setItem("admin-site-preference", newSite)
    // Update body class for theme
    document.documentElement.setAttribute("data-site", newSite)
  }

  const toggleSite = () => {
    setSite(site === "company" ? "ngo" : "company")
  }

  // Set initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-site", site)
  }, [site])

  return (
    <SiteContext.Provider value={{ site, setSite, toggleSite }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}

