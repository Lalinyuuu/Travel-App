// Trip-related types based on backend DTOs
export interface Translations {
  th?: {
    title?: string
    description?: string
  }
  en?: {
    title?: string
    description?: string
  }
}

export interface Trip {
  id: number
  title: string
  description?: string
  translations?: Translations
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
  translations?: Translations
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

