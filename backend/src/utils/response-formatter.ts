export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode: number
}

export const formatResponse = <T>(
  success: boolean,
  data: T | null = null,
  message: string = "",
  statusCode: number = 200
): ApiResponse<T> => {
  return {
    success,
    data: data || undefined,
    message,
    statusCode,
  }
}

export const formatError = (message: string, statusCode: number = 400): ApiResponse => {
  return {
    success: false,
    error: message,
    statusCode,
  }
}
