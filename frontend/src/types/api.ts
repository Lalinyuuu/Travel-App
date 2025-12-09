// API-related types
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ApiError extends Error {
  response?: {
    status: number
    statusText?: string
    data?: {
      error?: string
      message?: string
    }
  }
  code?: string
}

