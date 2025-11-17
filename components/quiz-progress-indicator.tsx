"use client"

interface QuizProgressIndicatorProps {
  current: number
  total: number
  answeredCount: number
}

export function QuizProgressIndicator({ current, total, answeredCount }: QuizProgressIndicatorProps) {
  const percentage = ((current + 1) / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-foreground">
          Question {current + 1} of {total}
        </p>
        <p className="text-sm text-muted-foreground">{answeredCount} answered</p>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
