"use client"

import { useRouter } from "next/navigation"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Building2, Heart } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useToast } from "@/components/ui/use-toast"
import { useSite } from "@/contexts/site-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Props = {
  email?: string
  role?: string
}

function TopbarComponent({ email, role }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const { site, toggleSite } = useSite()

  async function handleLogout() {
    try {
      await supabaseBrowser.auth.signOut()
      router.push("/auth/login")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn(
      "flex h-20 items-center justify-between border-b px-8 shadow-sm transition-all duration-300",
      site === "company" 
        ? "border-green-600/20 bg-black/95 backdrop-blur-xl supports-[backdrop-filter]:bg-black/90 shadow-green-600/20" 
        : "border-primary/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-primary/5"
    )}>
      <div className="flex items-center space-x-4">
        <div className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          site === "company" ? "bg-green-500" : "bg-primary"
        )} />
        <h1 className={cn(
          "text-2xl font-bold bg-clip-text text-transparent",
          site === "company"
            ? "bg-gradient-to-r from-green-400 to-green-600"
            : "bg-gradient-to-r from-foreground to-foreground/70"
        )}>
          Dashboard
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Site Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border bg-background/50 backdrop-blur-sm">
          <div className={cn(
            "flex items-center gap-2 transition-colors",
            site === "company" ? "text-green-400" : "text-muted-foreground"
          )}>
            <Building2 className="h-4 w-4" />
            <Label htmlFor="site-toggle" className="text-sm font-medium cursor-pointer">
              Company
            </Label>
          </div>
          <Switch
            id="site-toggle"
            checked={site === "ngo"}
            onCheckedChange={toggleSite}
            className={cn(
              "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
              site === "company" && "data-[state=unchecked]:bg-green-600"
            )}
          />
          <div className={cn(
            "flex items-center gap-2 transition-colors",
            site === "ngo" ? "text-red-500" : "text-muted-foreground"
          )}>
            <Heart className="h-4 w-4" />
            <Label htmlFor="site-toggle" className="text-sm font-medium cursor-pointer">
              NGO
            </Label>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-3 hover:bg-primary/5 rounded-xl px-4 py-2.5 transition-all duration-300 group"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-110 transition-all duration-300">
                <User className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-foreground">{email?.split("@")[0] || "Admin"}</span>
                <span className="text-xs text-muted-foreground capitalize font-medium">{role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn(
            "w-64 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300",
            site === "company"
              ? "bg-zinc-950/95 border-zinc-800"
              : "bg-white/95 border-border"
          )}>
            <DropdownMenuLabel className="px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className={cn(
                  "text-sm font-semibold",
                  site === "company" ? "text-green-300" : "text-foreground"
                )}>{email}</p>
                <p className={cn(
                  "text-xs capitalize font-medium",
                  site === "company" ? "text-green-500/70" : "text-muted-foreground"
                )}>{role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={site === "company" ? "bg-zinc-800" : ""} />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className={cn(
                "rounded-lg mx-2 my-1 cursor-pointer transition-colors",
                site === "company"
                  ? "text-red-400 focus:text-red-300 focus:bg-red-500/20"
                  : "text-red-600 focus:text-red-600 focus:bg-red-50"
              )}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export const Topbar = memo(TopbarComponent)

