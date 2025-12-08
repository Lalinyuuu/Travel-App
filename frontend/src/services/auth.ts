import apiClient, { type AxiosError, type InternalAxiosRequestConfig } from './api'
import type { AuthData, AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth'

const AUTH_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

interface AuthServiceData {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
}

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        email,
        password
      } as RegisterRequest)
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password
      } as LoginRequest)
      this.setAuthData(response.data)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
    }
  },

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ exists: boolean }>('/auth/check-email', {
        params: { email }
      })
      return response.data.exists
    } catch (error) {
      console.error('Check email error:', error)
      return false
    }
  },

  setAuthData(data: Partial<AuthData>): void {
    if (data.accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken)
    }
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
    }
    if (data.userId || data.email) {
      localStorage.setItem(USER_KEY, JSON.stringify({
        id: data.userId,
        email: data.email,
        displayName: data.displayName
      }))
    }
  },

  getAuthData(): AuthServiceData {
    const userStr = localStorage.getItem(USER_KEY)
    let user: User | null = null
    try {
      user = userStr ? JSON.parse(userStr) : null
    } catch {
      user = null
    }
    
    return {
      accessToken: localStorage.getItem(AUTH_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      user
    }
  },

  clearAuthData(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated(): boolean {
    const authData = this.getAuthData()
    return !!authData.accessToken
  },

  getCurrentUser(): User | null {
    const authData = this.getAuthData()
    return authData.user
  }
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = authService.getAuthData()
    if (authData.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authService.clearAuthData()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

