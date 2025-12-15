"use client"

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GlobalLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setLoading(true)
    setProgress(10)
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return Math.min(prev + 15, 90)
        clearInterval(interval)
        return prev
      })
    }, 80)

    // Complete faster
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 150)
      clearInterval(interval)
    }, 250)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/10 z-[9999] overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-200 ease-out shadow-lg"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
