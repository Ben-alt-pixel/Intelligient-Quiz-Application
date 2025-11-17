const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode: number
}

class ApiClient {
  private token: string | null;

 constructor() {
  this.token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;
}


  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data: ApiResponse<T> = await response.json()

    if (!data.success) {
      throw new Error(data.error || "API request failed")
    }

    return data.data as T
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint)
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>("POST", endpoint, body)
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>("PATCH", endpoint, body)
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint)
  }
}

export const apiClient = new ApiClient()
