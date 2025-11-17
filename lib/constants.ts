export const QUIZ_ROLES = {
  STUDENT: "student",
  LECTURER: "lecturer",
} as const

export const SCORE_GRADES = {
  EXCELLENT: { min: 80, label: "Excellent", color: "text-green-600" },
  GOOD: { min: 60, label: "Good", color: "text-yellow-600" },
  POOR: { min: 0, label: "Needs Improvement", color: "text-red-600" },
} as const

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  STUDENT_DASHBOARD: "/student",
  LECTURER_DASHBOARD: "/lecturer",
  HOME: "/",
} as const
