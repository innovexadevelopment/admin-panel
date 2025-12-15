"use client"

import { useSite } from "@/contexts/site-context"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  const { site } = useSite()
  
  return (
    <div className={cn(
      "flex h-screen transition-all duration-300",
      site === "company"
        ? "bg-gradient-to-br from-black via-zinc-950 to-black"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-50/50",
      className
    )}>
      {children}
    </div>
  )
}

