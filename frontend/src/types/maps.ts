// Google Maps types
export interface GoogleMapsPlace {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
}

export interface GoogleMapsPlaceDetails {
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
  name?: string
  formatted_address?: string
}

