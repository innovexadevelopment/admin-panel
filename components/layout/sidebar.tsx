"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSite } from "@/contexts/site-context"
import { memo } from "react"
import {
  LayoutDashboard,
  Building2,
  Heart,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Mail,
  FileText,
  Calendar,
  Award,
  Camera,
  DollarSign,
  BarChart3,
  Settings,
  BookOpen,
  Briefcase,
  UserPlus,
} from "lucide-react"

const companyMenu = [
  { name: "Hero", href: "/company/hero", icon: ImageIcon },
  { name: "Services", href: "/company/services", icon: FileText },
  { name: "Projects", href: "/company/projects", icon: Building2 },
  { name: "Blog", href: "/company/blog", icon: BookOpen },
  { name: "Events", href: "/company/events", icon: Calendar },
  { name: "Careers", href: "/company/careers", icon: Briefcase },
  { name: "Timeline", href: "/company/timeline", icon: Calendar },
  { name: "Team", href: "/company/team", icon: Users },
  { name: "Testimonials", href: "/company/testimonials", icon: MessageSquare },
  { name: "Impact Stats", href: "/company/impact", icon: Award },
  { name: "Contact Info", href: "/company/contact-info", icon: Mail },
  { name: "Messages", href: "/company/messages", icon: Mail },
]

const ngoMenu = [
  { name: "Hero", href: "/ngo/hero", icon: ImageIcon },
  { name: "Projects", href: "/ngo/projects", icon: Building2 },
  { name: "Campaigns", href: "/ngo/campaigns", icon: DollarSign },
  { name: "Blog", href: "/ngo/blog", icon: BookOpen },
  { name: "Events", href: "/ngo/events", icon: Calendar },
  { name: "Volunteers", href: "/ngo/volunteers", icon: UserPlus },
  { name: "Gallery", href: "/ngo/gallery", icon: Camera },
  { name: "Team", href: "/ngo/team", icon: Users },
  { name: "Testimonials", href: "/ngo/testimonials", icon: MessageSquare },
  { name: "Impact Stats", href: "/ngo/impact", icon: Award },
  { name: "Contact Info", href: "/ngo/contact-info", icon: Mail },
  { name: "Messages", href: "/ngo/messages", icon: Mail },
]

function SidebarComponent() {
  const pathname = usePathname()
  const { site } = useSite()

  return (
    <div className={cn(
      "flex h-screen w-64 flex-col border-r shadow-xl backdrop-blur-sm transition-all duration-300",
      site === "company"
        ? "bg-gradient-to-b from-black via-zinc-950 to-black border-zinc-800"
        : "bg-gradient-to-b from-white via-slate-50/50 to-white border-border"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "flex h-20 items-center border-b px-6 transition-all duration-300",
        site === "company"
          ? "border-zinc-800 bg-gradient-to-r from-green-600/20 via-green-600/10 to-transparent"
          : "border-red-500/20 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent"
      )}>
        <Link href="/" className="flex items-center space-x-3 group">
          <div className={cn(
            "relative p-2.5 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300",
            site === "company"
              ? "bg-gradient-to-br from-green-600 to-green-700 shadow-green-600/40 group-hover:shadow-green-600/60"
              : "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25 group-hover:shadow-red-500/40"
          )}>
            <LayoutDashboard className="h-5 w-5" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "text-lg font-bold bg-clip-text text-transparent",
              site === "company"
                ? "bg-gradient-to-r from-green-400 via-green-500 to-green-400"
                : "bg-gradient-to-r from-red-500 via-red-600 to-red-500"
            )}>
              Admin Panel
            </span>
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              site === "company" ? "text-green-500/70" : "text-red-400/80"
            )}>
              {site === "company" ? "Company" : "NGO"} Dashboard
            </span>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Global Links */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 mb-3">
            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              General
            </h3>
          </div>
          <nav className="space-y-1">
            <Link
              href="/"
              className={cn(
                "group flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300",
                pathname === "/"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/analytics"
              className={cn(
                "group flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300",
                pathname === "/analytics" || pathname.startsWith("/analytics")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "group flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300",
                pathname === "/settings" || pathname.startsWith("/settings")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Show Company Menu when Company is selected */}
        {site === "company" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 mb-3">
              <Building2 className="h-3.5 w-3.5 text-green-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                Company
              </h3>
            </div>
            <nav className="space-y-1">
              {companyMenu.map((item, idx) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-black shadow-lg shadow-green-600/40 scale-[1.02]"
                        : "text-green-400 hover:bg-gradient-to-r hover:from-green-600/20 hover:to-green-600/30 hover:text-green-300 hover:shadow-sm"
                    )}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/30 rounded-r-full" />
                    )}
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isActive 
                        ? "text-black scale-110" 
                        : "group-hover:scale-110 group-hover:text-green-500"
                    )} />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}

        {/* Show NGO Menu when NGO is selected */}
        {site === "ngo" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 mb-3">
              <Heart className="h-3.5 w-3.5 text-red-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                NGO
              </h3>
            </div>
            <nav className="space-y-1">
              {ngoMenu.map((item, idx) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 scale-[1.02]"
                        : "text-muted-foreground hover:bg-gradient-to-r hover:from-red-500/5 hover:to-red-500/10 hover:text-foreground hover:shadow-sm"
                    )}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full" />
                    )}
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isActive 
                        ? "text-white scale-110" 
                        : "group-hover:scale-110 group-hover:text-red-500"
                    )} />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export const Sidebar = memo(SidebarComponent)

