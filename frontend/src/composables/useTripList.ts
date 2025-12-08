import { ref, type Ref } from 'vue'
import { tripService } from '../services/api'
import type { TripSummary, PageResponse } from '../types'

export function useTripList(pageSize: number = 12) {
  const trips: Ref<TripSummary[]> = ref([])
  const loading: Ref<boolean> = ref(true)
  const loadingMore: Ref<boolean> = ref(false)
  const currentPage: Ref<number> = ref(0)
  const totalPages: Ref<number> = ref(0)
  const totalElements: Ref<number> = ref(0)
  const hasMore: Ref<boolean> = ref(false)

  const fetchTrips = async (page: number = 0, append: boolean = false, query: string | null = null, originalQuery: string | null = null): Promise<void> => {
    try {
      if (!append) {
        loading.value = true
      } else {
        loadingMore.value = true
      }

      const searchValue = query || originalQuery || null
      const response: PageResponse<TripSummary> = await tripService.getAllTrips(page, pageSize, searchValue)
      
      if (append) {
        trips.value = [...trips.value, ...response.content]
      } else {
        trips.value = response.content
      }

      currentPage.value = response.page
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
      hasMore.value = response.page < response.totalPages - 1
    } catch (error) {
      console.error('Failed to fetch trips:', error)
      if (!append) {
        trips.value = []
      }
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  const loadMore = (): void => {
    if (hasMore.value && !loadingMore.value) {
      fetchTrips(currentPage.value + 1, true)
    }
  }

  const resetPage = (): void => {
    currentPage.value = 0
  }

  return {
    trips,
    loading,
    loadingMore,
    currentPage,
    totalPages,
    totalElements,
    hasMore,
    fetchTrips,
    loadMore,
    resetPage
  }
}

