'use client'

import Link from "next/link"
import { ThemeToggle } from './theme-toggle'
import { IQLogo } from './iq-logo'
import { UserAvatarProfile } from './user-avatar-profile'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface AuthenticatedHeaderProps {
  user: any
}

export function AuthenticatedHeader({ user }: AuthenticatedHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={user.role === "student" ? "/student" : "/lecturer"} className="hover:opacity-80 transition-opacity">
          <IQLogo size="md" showText={true} />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <UserAvatarProfile user={user} />

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
