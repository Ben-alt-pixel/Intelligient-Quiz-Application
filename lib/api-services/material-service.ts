import { apiClient } from "@/lib/api-client"

export const materialService = {
  async getMaterials() {
    return apiClient.get("/materials")
  },

  async getMaterialById(id: string) {
    return apiClient.get(`/materials/${id}`)
  },

  async uploadMaterial(formData: FormData) {
    const token = apiClient.getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/materials/upload`,
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

  async deleteMaterial(id: string) {
    return apiClient.delete(`/materials/${id}`)
  },
}
