"use client"

import { useSite } from "@/contexts/site-context"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

export function WelcomeSection({ adminUser }: { adminUser: { email?: string } }) {
  const { site } = useSite()
  
  return (
    <div className={cn(
      "relative rounded-2xl p-8 border shadow-lg overflow-hidden transition-all duration-300",
      site === "company"
        ? "bg-gradient-to-br from-green-600/10 via-green-600/5 to-transparent border-green-600/20 shadow-green-600/10"
        : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-primary/5"
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2",
        site === "company" ? "bg-green-600/5" : "bg-primary/5"
      )} />
      <div className={cn(
        "absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2",
        site === "company" ? "bg-green-600/5" : "bg-primary/5"
      )} />
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-4xl font-bold mb-3 bg-clip-text text-transparent",
            site === "company"
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : "bg-gradient-to-r from-foreground to-foreground/80"
          )}>
            Welcome back, {adminUser.email?.split("@")[0] || "Admin"}! 👋
          </h1>
          <p className={cn(
            "text-lg",
            site === "company" ? "text-green-400/80" : "text-muted-foreground"
          )}>
            Here's what's happening with your content today.
          </p>
        </div>
        <div className={cn(
          "hidden md:flex items-center gap-3 px-6 py-3 backdrop-blur-sm rounded-xl border shadow-lg transition-all duration-300",
          site === "company"
            ? "bg-zinc-900/80 border-green-600/20"
            : "bg-white/80 border-primary/10"
        )}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className={cn(
              "text-xs font-medium",
              site === "company" ? "text-green-400/70" : "text-muted-foreground"
            )}>Growth Rate</p>
            <p className={cn(
              "text-lg font-bold",
              site === "company" ? "text-green-500" : "text-green-600"
            )}>+72.80%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

