/**
 * URL validation utility
 */
export const isValidUrl = (urlString: string | null | undefined): boolean => {
  if (!urlString || typeof urlString !== 'string') {
    return false
  }

  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate image URL
 */
export const isValidImageUrl = (urlString: string | null | undefined): boolean => {
  if (!isValidUrl(urlString)) {
    return false
  }

  if (!urlString) return false

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const lowerUrl = urlString.toLowerCase()
  
  const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext))
  
  const imageServicePatterns = [
    'imgur.com',
    'cloudinary.com',
    'unsplash.com',
    'pexels.com',
    'images.unsplash.com',
    'res.cloudinary.com'
  ]
  
  const isImageService = imageServicePatterns.some(pattern => lowerUrl.includes(pattern))
  
  return hasImageExtension || isImageService
}

/**
 * Validate multiple image URLs
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  validUrls: string[]
}

export const validateImageUrls = (urls: unknown): ValidationResult => {
  if (!Array.isArray(urls)) {
    return { valid: false, errors: ['URLs must be an array'], validUrls: [] }
  }

  const errors: string[] = []
  const validUrls: string[] = []

  urls.forEach((url, index) => {
    if (typeof url !== 'string') {
      errors.push(`URL ที่ ${index + 1} ต้องเป็น string`)
      return
    }

    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      return // Skip empty URLs
    }

    if (!isValidImageUrl(trimmedUrl)) {
      errors.push(`URL ที่ ${index + 1} ไม่ถูกต้อง: ${trimmedUrl}`)
    } else {
      validUrls.push(trimmedUrl)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    validUrls
  }
}

