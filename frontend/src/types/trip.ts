// Trip-related types based on backend DTOs
export interface Trip {
  id: number
  title: string
  description?: string
  photos: string[]
  tags: string[]
  latitude?: number | null
  longitude?: number | null
  authorId?: number
  authorName?: string
  createdAt?: string
  updatedAt?: string
  province?: string
}

export interface TripSummary {
  id: number
  title: string
  shortDescription?: string
  coverImage?: string
  province?: string
  tags: string[]
  authorId?: number
  updatedAt?: string
}

export interface CreateTripData {
  title: string
  description?: string
  photos: string[]
  tags: string[]
  latitude?: number | null
  longitude?: number | null
}

export interface FormData {
  title: string
  description: string
  photos: string[]
  tags: string[]
  latitude: number | null
  longitude: number | null
}

