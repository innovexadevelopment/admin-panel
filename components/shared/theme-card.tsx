"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSite } from "@/contexts/site-context"
import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

export function ThemeCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { site } = useSite()
  
  return (
    <Card
      className={cn(
        site === "company"
          ? "bg-zinc-950/90 border-zinc-800 backdrop-blur-sm"
          : "bg-white/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

