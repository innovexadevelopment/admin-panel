import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { GlobalLoading } from "@/components/shared/global-loading"
import { SiteProvider } from "@/contexts/site-context"

// Always fetch fresh data; avoid cached responses
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing company and NGO websites",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteProvider>
          <GlobalLoading />
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  )
}

