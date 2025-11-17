import { apiClient } from "@/lib/api-client"

export const quizService = {
  async getPublishedQuizzes() {
    return apiClient.get("/quizzes/published")
  },

  async getMyQuizzes() {
    return apiClient.get("/quizzes/my-quizzes")
  },

  async getQuizById(id: string) {
    return apiClient.get(`/quizzes/${id}`)
  },

  async createQuiz(data: any) {
    return apiClient.post("/quizzes", data)
  },

  async updateQuiz(id: string, data: any) {
    return apiClient.patch(`/quizzes/${id}`, data)
  },

  async publishQuiz(id: string) {
    return apiClient.patch(`/quizzes/${id}/publish`, {})
  },

  async deleteQuiz(id: string) {
    return apiClient.delete(`/quizzes/${id}`)
  },

  async startSession(quizId: string) {
    return apiClient.post("/quizzes/session/start", { quizId })
  },

  async getSession(id: string) {
    return apiClient.get(`/quizzes/session/${id}`)
  },

  async submitSession(id: string) {
    return apiClient.post(`/quizzes/session/${id}/submit`, {})
  },
}
