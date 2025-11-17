import { apiClient } from "@/lib/api-client"

export interface LoginRequest {
  emailOrRegNo: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "STUDENT" | "LECTURER"
  regNo?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
    firstName: string
    lastName: string
    regNo?: string
  }
  token: string
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", data)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/register", data)
  },

  async getCurrentUser() {
    return apiClient.get("/users/me")
  },
}
