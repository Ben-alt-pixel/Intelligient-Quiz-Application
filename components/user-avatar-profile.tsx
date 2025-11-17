'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface User {
  id: string
  name: string
  email: string
  role: "student" | "lecturer"
  registrationNumber?: string
}

interface UserAvatarProfileProps {
  user: User
}

export function UserAvatarProfile({ user }: UserAvatarProfileProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const initials = user?.name
    ?.split(' ')
    ?.map(n => n[0])
    ?.join('')
    ?.toUpperCase()

  const bgColor = user.role === 'student' ? 'bg-blue-500' : 'bg-purple-500'

  return (
    <div className="group relative">
      <Avatar className={`h-10 w-10 ${bgColor} text-white cursor-pointer hover:opacity-80 transition-opacity`}>
        <AvatarFallback className={bgColor}>{initials}</AvatarFallback>
      </Avatar>

      <div className="absolute right-0 top-12 hidden group-hover:block bg-background border border-border rounded-lg shadow-lg p-4 w-64 z-50">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Name</p>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email</p>
            <p className="text-sm text-foreground break-all">{user.email}</p>
          </div>

          {user.registrationNumber && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Registration Number</p>
              <p className="text-sm font-mono text-foreground">{user.registrationNumber}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Role</p>
            <p className="text-sm capitalize text-foreground px-2 py-1 rounded bg-primary/10 text-primary w-fit">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
