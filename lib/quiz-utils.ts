export function calculateScorePercentage(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

export function getScoreGrade(percentage: number): string {
  if (percentage >= 80) return "Excellent"
  if (percentage >= 60) return "Good"
  return "Needs Improvement"
}

export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export function validateQuiz(quiz: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!quiz.title || !quiz.title.trim()) {
    errors.push("Quiz title is required")
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    errors.push("At least one question is required")
  }

  quiz.questions?.forEach((q: any, index: number) => {
    if (!q.text || !q.text.trim()) {
      errors.push(`Question ${index + 1}: Text is required`)
    }
    if (!q.options || q.options.some((opt: string) => !opt.trim())) {
      errors.push(`Question ${index + 1}: All options must be filled`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
