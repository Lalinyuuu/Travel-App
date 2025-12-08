import { ref, nextTick, watch, type Ref } from 'vue'
import type { FormData, GoogleMapsPlace, GoogleMapsPlaceDetails } from '../types'

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: {
                input: string
                componentRestrictions?: { country: string }
                types?: string[]
              },
              callback: (predictions: GoogleMapsPlace[] | null, status: string) => void
            ) => void
          }
          PlacesService: new (element: HTMLElement) => {
            getDetails: (
              request: { placeId: string; fields: string[] },
              callback: (place: GoogleMapsPlaceDetails | null, status: string) => void
            ) => void
          }
          PlacesServiceStatus: {
            OK: string
          }
        }
        Map: new (element: HTMLElement | null, options: google.maps.MapOptions) => google.maps.Map
        Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker
        marker?: {
          AdvancedMarkerElement: new (options: {
            position: google.maps.LatLng | google.maps.LatLngLiteral
            map: google.maps.Map | null
            gmpDraggable?: boolean
          }) => {
            position: google.maps.LatLng | google.maps.LatLngLiteral
            map: google.maps.Map | null
            addListener: (event: string, handler: (e: any) => void) => void
          }
        }
        LatLng: new (lat: number, lng: number) => google.maps.LatLng
        LatLngLiteral: { lat: number; lng: number }
        MapOptions: {
          center?: google.maps.LatLng | google.maps.LatLngLiteral
          zoom?: number
          mapTypeControl?: boolean
          streetViewControl?: boolean
          fullscreenControl?: boolean
          mapId?: string
        }
        MarkerOptions: {
          position: google.maps.LatLng | google.maps.LatLngLiteral
          map: google.maps.Map | null
          draggable?: boolean
        }
      }
    }
  }
}

export function useLocationSearch(formData: Ref<FormData>) {
  const locationSearch: Ref<string> = ref('')
  const locationSearchResults: Ref<GoogleMapsPlace[]> = ref([])
  const showMapPicker: Ref<boolean> = ref(false)
  const mapPickerContainer: Ref<HTMLElement | null> = ref(null)
  const mapPicker: Ref<google.maps.Map | null> = ref(null)
  const mapPickerMarker: Ref<any> = ref(null)
  let placesService: any = null
  let autocompleteService: any = null
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const handleLocationSearch = (): void => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (!locationSearch.value.trim()) {
      locationSearchResults.value = []
      return
    }

    if (typeof window === 'undefined' || !window.google?.maps?.places) {
      searchTimeout = setTimeout(() => {
        handleLocationSearch()
      }, 500)
      return
    }

    searchTimeout = setTimeout(() => {
      if (!autocompleteService) {
        autocompleteService = new window.google!.maps.places.AutocompleteService()
      }

      autocompleteService.getPlacePredictions(
        {
          input: locationSearch.value,
          componentRestrictions: { country: 'th' },
          types: ['establishment', 'geocode']
        },
        (predictions: GoogleMapsPlace[] | null, status: string) => {
          if (status === window.google!.maps.places.PlacesServiceStatus.OK && predictions) {
            locationSearchResults.value = predictions
          } else {
            locationSearchResults.value = []
          }
        }
      )
    }, 300)
  }

  const selectLocation = (place: GoogleMapsPlace): void => {
    if (!placesService) {
      placesService = new window.google!.maps.places.PlacesService(document.createElement('div'))
    }

    placesService.getDetails(
      {
        placeId: place.place_id,
        fields: ['geometry', 'name', 'formatted_address']
      },
      (placeDetails: GoogleMapsPlaceDetails | null, status: string) => {
        if (status === window.google!.maps.places.PlacesServiceStatus.OK && placeDetails) {
          const location = placeDetails.geometry.location
          formData.value.latitude = location.lat()
          formData.value.longitude = location.lng()
          locationSearch.value = placeDetails.name || place.description
          locationSearchResults.value = []
          showMapPicker.value = true
          nextTick(() => {
            initMapPicker()
          })
        }
      }
    )
  }

  const clearLocation = (): void => {
    formData.value.latitude = null
    formData.value.longitude = null
    locationSearch.value = ''
    locationSearchResults.value = []
    showMapPicker.value = false
    if (mapPickerMarker.value) {
      if (mapPickerMarker.value instanceof window.google?.maps.marker?.AdvancedMarkerElement) {
        mapPickerMarker.value.map = null
      } else {
        mapPickerMarker.value.setMap(null)
      }
      mapPickerMarker.value = null
    }
  }

  const initMapPicker = (): void => {
    if (!mapPickerContainer.value || !formData.value.latitude || !formData.value.longitude) {
      return
    }

    if (typeof window === 'undefined' || !window.google?.maps) {
      return
    }

    const position: google.maps.LatLngLiteral = {
      lat: formData.value.latitude,
      lng: formData.value.longitude
    }

    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || null
    
    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }

    if (mapId) {
      mapOptions.mapId = mapId
    }

    mapPicker.value = new window.google.maps.Map(mapPickerContainer.value, mapOptions)

    const createMarker = (pos: google.maps.LatLng | google.maps.LatLngLiteral, isDraggable: boolean = true): any => {
      if (mapId && window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: pos,
          map: mapPicker.value,
          gmpDraggable: isDraggable
        })
        
        if (isDraggable) {
          marker.addListener('dragend', (e: any) => {
            const newPosition = e.latLng || e.target.position
            formData.value.latitude = typeof newPosition.lat === 'function' ? newPosition.lat() : newPosition.lat
            formData.value.longitude = typeof newPosition.lng === 'function' ? newPosition.lng() : newPosition.lng
          })
        }
        
        return marker
      }
      
      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapPicker.value,
        draggable: isDraggable
      })
      
      return marker
    }

    mapPickerMarker.value = createMarker(position, true)

    if (mapPickerMarker.value && !(mapPickerMarker.value instanceof window.google.maps.marker?.AdvancedMarkerElement)) {
      mapPickerMarker.value.addListener('dragend', (e: any) => {
        const newPosition = e.latLng
        formData.value.latitude = newPosition.lat()
        formData.value.longitude = newPosition.lng()
      })
    }

    mapPicker.value.addListener('click', (e: any) => {
      const newPosition = e.latLng
      formData.value.latitude = newPosition.lat()
      formData.value.longitude = newPosition.lng()
      
      if (mapPickerMarker.value) {
        if (mapPickerMarker.value instanceof window.google.maps.marker?.AdvancedMarkerElement) {
          mapPickerMarker.value.position = newPosition
        } else {
          mapPickerMarker.value.setPosition(newPosition)
        }
      } else {
        mapPickerMarker.value = createMarker(newPosition, true)
        
        if (!(mapPickerMarker.value instanceof window.google.maps.marker?.AdvancedMarkerElement)) {
          mapPickerMarker.value.addListener('dragend', (e: any) => {
            const pos = e.latLng
            formData.value.latitude = pos.lat()
            formData.value.longitude = pos.lng()
          })
        }
      }
    })
  }

  watch(() => [formData.value.latitude, formData.value.longitude], ([lat, lng]) => {
    if (showMapPicker.value && lat && lng && mapPicker.value) {
      const position: google.maps.LatLngLiteral = { lat, lng }
      mapPicker.value.setCenter(position)
      if (mapPickerMarker.value) {
        if (mapPickerMarker.value instanceof window.google?.maps.marker?.AdvancedMarkerElement) {
          mapPickerMarker.value.position = position
        } else {
          mapPickerMarker.value.setPosition(position)
        }
      }
    }
  })

  watch(showMapPicker, (visible) => {
    if (visible && formData.value.latitude && formData.value.longitude) {
      nextTick(() => {
        initMapPicker()
      })
    }
  })

  const reset = (): void => {
    locationSearch.value = ''
    locationSearchResults.value = []
    showMapPicker.value = false
    if (mapPickerMarker.value) {
      if (mapPickerMarker.value instanceof window.google?.maps.marker?.AdvancedMarkerElement) {
        mapPickerMarker.value.map = null
      } else {
        mapPickerMarker.value.setMap(null)
      }
      mapPickerMarker.value = null
    }
  }

  return {
    locationSearch,
    locationSearchResults,
    showMapPicker,
    mapPickerContainer,
    handleLocationSearch,
    selectLocation,
    clearLocation,
    reset,
    initMapPicker
  }
}
