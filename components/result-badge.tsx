"use client"

interface ResultBadgeProps {
  score: number
  total: number
  size?: "sm" | "md" | "lg"
}

export function ResultBadge({ score, total, size = "md" }: ResultBadgeProps) {
  const percentage = Math.round((score / total) * 100)
  const getColor = () => {
    if (percentage >= 80) return "bg-green-600"
    if (percentage >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-2 ${getColor()} text-white px-3 py-2 rounded-lg`}>
      <span className={`font-bold ${sizeClasses[size]}`}>{percentage}%</span>
      <span className="text-xs">
        ({score}/{total})
      </span>
    </div>
  )
}
