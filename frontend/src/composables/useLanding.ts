import { ref, watch, nextTick, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTripList } from './useTripList'
import { useTripSearch } from './useTripSearch'
import { useTripShare } from './useTripShare'

export function useLanding() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  const pageSize: Ref<number> = ref(12)

  const handleSearchWithPage = (query: string | null): void => {
    resetPage()
    fetchTrips(0, false, query, query)
  }

  const {
    trips,
    loading,
    loadingMore,
    currentPage,
    totalElements,
    hasMore,
    fetchTrips,
    loadMore,
    resetPage
  } = useTripList(pageSize.value)

  const {
    searchQuery,
    displaySearchQuery,
    updateSearchQuery,
    handleSearch,
    handleSearchInput,
    clearSearch,
    handleTagClick
  } = useTripSearch(handleSearchWithPage)

  const { handleShare } = useTripShare()

  const handleImageError = (event: Event): void => {
    const target = event.target as HTMLImageElement
    target.style.display = 'none'
    const container = target.closest('.trip-image-container')
    if (container) {
      const placeholder = container.querySelector('.trip-image-placeholder')
      if (placeholder) {
        (placeholder as HTMLElement).style.display = 'flex'
      }
    }
  }

  const goToTripDetail = (tripId: number): void => {
    router.push(`/trips/${tripId}`)
  }

  watch(() => route.query.search, (newSearch) => {
    if (!newSearch && route.path === '/') {
      updateSearchQuery('')
      fetchTrips(0, false, null)
    } else if (newSearch && typeof newSearch === 'string') {
      updateSearchQuery(newSearch)
      fetchTrips(0, false, newSearch)
    }
  })

  watch(() => route.path, (newPath) => {
    if (newPath === '/' && !route.query.search) {
      updateSearchQuery('')
      fetchTrips(0, false, null)
    }
  })

  watch(() => locale.value, () => {
    if (searchQuery.value) {
      const currentQuery = searchQuery.value
      updateSearchQuery('')
      nextTick(() => {
        updateSearchQuery(currentQuery)
      })
    }
  })

  const init = (): void => {
    const searchParam = route.query.search
    if (searchParam && typeof searchParam === 'string') {
      updateSearchQuery(searchParam)
      fetchTrips(0, false, searchParam)
    } else {
      updateSearchQuery('')
      fetchTrips(0)
    }
  }

  return {
    trips,
    loading,
    loadingMore,
    hasMore,
    totalElements,
    displaySearchQuery,
    updateSearchQuery,
    handleSearch,
    handleSearchInput,
    clearSearch,
    handleTagClick,
    handleShare,
    handleImageError,
    goToTripDetail,
    loadMore,
    init
  }
}

