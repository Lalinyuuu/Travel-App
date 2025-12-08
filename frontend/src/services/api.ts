import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { Trip, TripSummary, PageResponse, CreateTripData } from '../types'

// Prioritize VITE_API_BASE_URL (full path), then VITE_API_URL (root domain + /api), 
// then production URL, finally localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 
                     (import.meta.env.PROD ? 'https://travel-app-backend-lu5l.onrender.com/api' : 'http://localhost:8080/api'))

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient

export const tripService = {
  async getAllTrips(page: number = 0, size: number = 12, query: string | null = null): Promise<PageResponse<TripSummary>> {
    const params: Record<string, string | number> = { page, size }
    if (query) {
      params.query = query
    }
    const response = await apiClient.get<PageResponse<TripSummary>>('/trips', { params })
    return response.data
  },

  async getTripById(id: string | number): Promise<Trip> {
    const response = await apiClient.get<Trip>(`/trips/${id}`)
    return response.data
  },

  async getMyTrips(page: number = 0, size: number = 12): Promise<PageResponse<TripSummary>> {
    const response = await apiClient.get<PageResponse<TripSummary>>('/trips/mine', {
      params: { page, size }
    })
    return response.data
  },

  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const response = await apiClient.post<Trip>('/trips', tripData)
    return response.data
  },

  async updateTrip(id: number, tripData: CreateTripData): Promise<Trip> {
    const response = await apiClient.put<Trip>(`/trips/${id}`, tripData)
    return response.data
  },

  async deleteTrip(id: number): Promise<void> {
    await apiClient.delete(`/trips/${id}`)
  }
}

