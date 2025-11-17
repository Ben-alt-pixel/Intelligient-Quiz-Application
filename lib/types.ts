export type UserRole = "student" | "lecturer"

export interface User {
  id: string
  name: string
  email: string
  registrationNumber?: string
  role: UserRole
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  description?: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  questionCount: number
  timeLimit: number
  createdBy: string
  createdAt: string
  studentCount?: number
}

export interface StudentQuizResult {
  id: string
  studentId: string
  studentName: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
}

export interface QuizAttempt {
  quizId: string
  answers: Record<string, number>
  timeSpent: number
  submittedAt: string
}
