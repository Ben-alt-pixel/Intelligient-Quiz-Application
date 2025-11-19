const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

class ApiClient {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const runtimeToken = localStorage.getItem("token");
      if (runtimeToken) {
        headers["Authorization"] = `Bearer ${runtimeToken}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data.data as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>("POST", endpoint, body);
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>("PATCH", endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }

  /**
   * Upload files using FormData
   */
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};

    if (typeof window !== "undefined") {
      const runtimeToken = localStorage.getItem("token");
      if (runtimeToken) {
        headers["Authorization"] = `Bearer ${runtimeToken}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || data.message || "Upload failed");
    }

    return data.data as T;
  }
}

export const apiClient = new ApiClient();
