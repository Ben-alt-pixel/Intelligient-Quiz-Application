import { apiClient } from "@/lib/api-client"

export const resultService = {
  async getMyResults() {
    return apiClient.get("/results/my-results")
  },

  async getQuizResults(quizId: string) {
    return apiClient.get(`/results/quiz/${quizId}`)
  },

  async getResultDetails(quizId: string, studentId: string) {
    return apiClient.get(`/results/${quizId}/${studentId}`)
  },
}
