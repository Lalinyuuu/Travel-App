import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Translations {
  th?: {
    title?: string
    description?: string
  }
  en?: {
    title?: string
    description?: string
  }
}

/**
 * Composable to get translated trip content based on current locale
 */
export function useTripTranslation() {
  const { locale } = useI18n()

  /**
   * Get translated title from trip object
   */
  const getTranslatedTitle = (trip: { title?: string; translations?: Translations }): string => {
    if (!trip) {
      console.warn('getTranslatedTitle: trip is null/undefined')
      return ''
    }
    
    const currentLang = locale.value as 'th' | 'en'
    
    // Try to get from translations first
    if (trip.translations && trip.translations[currentLang]?.title) {
      return trip.translations[currentLang].title || ''
    }
    
    // Fallback to default title
    const result = trip.title || ''
    if (!result) {
      console.warn('getTranslatedTitle: no title found', trip)
    }
    return result
  }

  /**
   * Get translated description from trip object
   */
  const getTranslatedDescription = (trip: { description?: string; translations?: Translations }): string => {
    if (!trip) return ''
    
    const currentLang = locale.value as 'th' | 'en'
    
    // Try to get from translations first
    if (trip.translations && trip.translations[currentLang]?.description) {
      return trip.translations[currentLang].description || ''
    }
    
    // Fallback to default description
    return trip.description || ''
  }

  /**
   * Get translated short description (truncated)
   * For TripSummary, use shortDescription if available, otherwise use description
   */
  const getTranslatedShortDescription = (trip: { description?: string; shortDescription?: string; translations?: Translations }, maxLength: number = 120): string => {
    if (!trip) {
      console.warn('getTranslatedShortDescription: trip is null/undefined')
      return ''
    }
    
    const currentLang = locale.value as 'th' | 'en'
    
    // Try to get from translations first
    if (trip.translations && trip.translations[currentLang]?.description) {
      const translatedDesc = trip.translations[currentLang].description || ''
      if (translatedDesc.length <= maxLength) {
        return translatedDesc
      }
      return translatedDesc.substring(0, maxLength) + '...'
    }
    
    // Fallback to shortDescription if available (for TripSummary)
    if (trip.shortDescription) {
      return trip.shortDescription
    }
    
    // Fallback to description
    const description = trip.description || ''
    if (description.length <= maxLength) {
      return description
    }
    
    return description.substring(0, maxLength) + '...'
  }

  return {
    getTranslatedTitle,
    getTranslatedDescription,
    getTranslatedShortDescription
  }
}

