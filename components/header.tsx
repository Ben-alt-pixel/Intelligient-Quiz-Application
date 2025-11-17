'use client'

import Link from "next/link"
import { ThemeToggle } from './theme-toggle'
import { IQLogo } from './iq-logo'

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <IQLogo size="md" showText={true} />
        </Link>
        
        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
