"use client"

import { useState, useEffect } from "react"

interface QuizTimerProps {
  initialSeconds: number
  onTimeUp: () => void
}

export function QuizTimer({ initialSeconds, onTimeUp }: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, onTimeUp])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isWarning = timeRemaining < 300 // 5 minutes

  return (
    <div
      className={`text-center p-4 rounded-lg font-semibold ${
        isWarning ? "bg-destructive/10 text-destructive" : "bg-primary text-primary-foreground"
      }`}
    >
      <p className="text-xs mb-1">Time Remaining</p>
      <p className="text-2xl font-bold">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </p>
    </div>
  )
}
