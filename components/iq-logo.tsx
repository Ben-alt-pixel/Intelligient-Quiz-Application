'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface IQLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export function IQLogo({ size = 'md', showText = true, className = '' }: IQLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Logo */}
      <div className={sizeMap[size]}>
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Outer decorative circle */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={isDark ? '#D4AF37' : '#5C0E14'}
            strokeWidth="2"
          />

          {/* Main IQ text */}
          <text
            x="100"
            y="115"
            fontFamily="Arial, sans-serif"
            fontSize="72"
            fontWeight="700"
            textAnchor="middle"
            fill={isDark ? '#D4AF37' : '#5C0E14'}
            letterSpacing="2"
          >
            IQ
          </text>

          {/* Accent dots - representing intelligence nodes */}
          <circle cx="65" cy="65" r="5" fill={isDark ? '#D4AF37' : '#5C0E14'} opacity="0.6" />
          <circle cx="135" cy="65" r="5" fill={isDark ? '#D4AF37' : '#5C0E14'} opacity="0.6" />
          <circle cx="100" cy="140" r="5" fill={isDark ? '#D4AF37' : '#5C0E14'} opacity="0.6" />

          {/* Top accent line */}
          <line
            x1="60"
            y1="50"
            x2="140"
            y2="50"
            stroke={isDark ? '#D4AF37' : '#5C0E14'}
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Logo text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary">IQ</span>
          <span className="text-xs font-medium text-muted-foreground leading-none">
            Intelligent Quiz
          </span>
        </div>
      )}
    </div>
  )
}
