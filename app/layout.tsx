import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WebsiteProvider } from '../lib/hooks/use-website-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Panel - Unified CMS',
  description: 'Centralized admin panel for managing Company and NGO websites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebsiteProvider>
          {children}
        </WebsiteProvider>
      </body>
    </html>
  )
}

