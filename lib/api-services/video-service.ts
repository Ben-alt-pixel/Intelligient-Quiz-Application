import { apiClient } from "@/lib/api-client"

export const videoService = {
  async uploadVideo(formData: FormData) {
    const token = apiClient.getToken()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/videos/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
    return response.json()
  },

  async getVideoSubmission(id: string) {
    return apiClient.get(`/videos/${id}`)
  },
}
