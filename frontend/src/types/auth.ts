// Authentication types
export interface User {
  id: number
  email: string
  displayName?: string
}

export interface AuthData {
  accessToken: string
  refreshToken?: string
  userId?: number
  email?: string
  displayName?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  userId?: number
  email?: string
  displayName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

