import { ref, computed, watch, nextTick, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTagTranslation } from './useTagTranslation'

export function useTripSearch(onSearch: (query: string | null) => void) {
  const route = useRoute()
  const router = useRouter()
  const { t, tm, locale } = useI18n()
  const { translateTag: translateTagUtil } = useTagTranslation()

  const searchQuery: Ref<string> = ref('')
  const originalSearchQuery: Ref<string> = ref('')
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const findOriginalTag = (translatedValue: string): string | null => {
    if (!translatedValue) return null
    const tags = tm('tags') as Record<string, string> | undefined
    if (typeof tags === 'object' && tags !== null) {
      for (const [key, value] of Object.entries(tags)) {
        if (value === translatedValue) {
          return key
        }
      }
    }
    return null
  }

  const translateTag = (tag: string): string => {
    return translateTagUtil(tag)
  }

  const displaySearchQuery = computed({
    get: (): string => {
      if (!searchQuery.value) return ''
      return translateTag(searchQuery.value)
    },
    set: (value: string): void => {
      const foundOriginal = findOriginalTag(value)
      if (foundOriginal) {
        searchQuery.value = foundOriginal
        originalSearchQuery.value = foundOriginal
      } else {
        searchQuery.value = value
        originalSearchQuery.value = value
      }
    }
  })

  const updateSearchQuery = (value: string): void => {
    const foundOriginal = findOriginalTag(value)
    if (foundOriginal) {
      searchQuery.value = foundOriginal
      originalSearchQuery.value = foundOriginal
    } else {
      searchQuery.value = value
      originalSearchQuery.value = value
    }
  }

  const handleSearch = (): void => {
    const query = originalSearchQuery.value || searchQuery.value
    onSearch(query ? query.trim() : null)
  }

  const handleSearchInput = (): void => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    searchTimeout = setTimeout(() => {
      const query = originalSearchQuery.value || searchQuery.value
      if (query.trim()) {
        handleSearch()
      } else {
        onSearch(null)
      }
    }, 500)
  }

  const clearSearch = (): void => {
    searchQuery.value = ''
    originalSearchQuery.value = ''
    onSearch(null)
  }

  const handleTagClick = (tag: string): void => {
    originalSearchQuery.value = tag
    searchQuery.value = tag
    onSearch(tag)
    router.push({
      path: route.path,
      query: { search: tag }
    })
  }

  watch(() => locale.value, () => {
    if (searchQuery.value) {
      const currentQuery = searchQuery.value
      searchQuery.value = ''
      nextTick(() => {
        searchQuery.value = currentQuery
      })
    }
  })

  return {
    searchQuery,
    originalSearchQuery,
    displaySearchQuery,
    updateSearchQuery,
    handleSearch,
    handleSearchInput,
    clearSearch,
    handleTagClick,
    translateTag
  }
}

