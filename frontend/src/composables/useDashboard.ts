import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { tripService } from '../services/api'
import { authService } from '../services/auth'
import { useToast } from './useToast'
import type { Trip, TripSummary, FormData, CreateTripData, PageResponse, ApiError } from '../types'

export function useDashboard() {
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const trips: Ref<TripSummary[]> = ref([])
  const loading: Ref<boolean> = ref(true)
  const loadingMore: Ref<boolean> = ref(false)
  const currentPage: Ref<number> = ref(0)
  const hasMore: Ref<boolean> = ref(false)
  const showCreateModal: Ref<boolean> = ref(false)
  const editingTrip: Ref<Trip | null> = ref(null)
  const tripToDelete: Ref<TripSummary | null> = ref(null)
  const deleting: Ref<boolean> = ref(false)
  const submitting: Ref<boolean> = ref(false)
  const formError: Ref<string> = ref('')
  const formData: Ref<FormData> = ref({
    title: '',
    description: '',
    photos: [],
    tags: [],
    latitude: null,
    longitude: null
  })

  const fetchTrips = async (page: number = 0, append: boolean = false): Promise<void> => {
    try {
      if (!append) {
        loading.value = true
      } else {
        loadingMore.value = true
      }

      const response: PageResponse<TripSummary> = await tripService.getMyTrips(page, 12)
      
      if (append) {
        trips.value = [...trips.value, ...response.content]
      } else {
        trips.value = response.content
      }

      currentPage.value = response.page
      hasMore.value = response.page < response.totalPages - 1
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.code === 'ERR_NETWORK' || apiError.message === 'Network Error') {
        toast.error(t('dashboard.networkError'))
        return
      }
      
      if (apiError.response?.status === 401 || apiError.response?.status === 403) {
        authService.clearAuthData()
        toast.error(t('dashboard.pleaseLogin'))
        router.push('/login')
      } else {
        toast.error(t('dashboard.loadError'))
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

  const openCreateModal = (): void => {
    editingTrip.value = null
    formData.value = {
      title: '',
      description: '',
      photos: [],
      tags: [],
      latitude: null,
      longitude: null
    }
    formError.value = ''
    showCreateModal.value = true
  }

  const editTrip = async (trip: TripSummary): Promise<void> => {
    try {
      const fullTrip: Trip = await tripService.getTripById(trip.id)
      editingTrip.value = fullTrip
      formData.value = {
        title: fullTrip.title,
        description: fullTrip.description || '',
        photos: fullTrip.photos || [],
        tags: fullTrip.tags || [],
        latitude: fullTrip.latitude || null,
        longitude: fullTrip.longitude || null
      }
      formError.value = ''
      showCreateModal.value = true
    } catch (error) {
      const apiError = error as ApiError
      editingTrip.value = trip as unknown as Trip
      formData.value = {
        title: trip.title,
        description: trip.shortDescription || '',
        photos: [trip.coverImage].filter(Boolean) as string[],
        tags: trip.tags || [],
        latitude: null,
        longitude: null
      }
      formError.value = ''
      showCreateModal.value = true
    }
  }

  const confirmDelete = (trip: TripSummary): void => {
    tripToDelete.value = trip
  }

  const handleDelete = async (): Promise<void> => {
    if (!tripToDelete.value) return

    try {
      deleting.value = true
      await tripService.deleteTrip(tripToDelete.value.id)
      trips.value = trips.value.filter(t => t.id !== tripToDelete.value.id)
      tripToDelete.value = null
      toast.success(t('dashboard.tripDeleted'))
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.response?.status === 403) {
        toast.error(t('dashboard.canOnlyDeleteOwn'))
      } else if (apiError.response?.data?.error) {
        toast.error(apiError.response.data.error)
      } else {
        toast.error(t('dashboard.deleteError'))
      }
    } finally {
      deleting.value = false
    }
  }

  const handleSubmit = async (data: CreateTripData): Promise<void> => {
    formError.value = ''
    
    if (!data.title) {
      formError.value = t('dashboard.titleRequired')
      return
    }
    
    if (!data.photos || data.photos.length === 0) {
      formError.value = t('dashboard.photoRequired')
      return
    }

    try {
      submitting.value = true
      const tripData: CreateTripData = {
        title: data.title,
        description: data.description,
        photos: data.photos,
        tags: data.tags,
        latitude: data.latitude,
        longitude: data.longitude
      }

      if (editingTrip.value) {
        await tripService.updateTrip(editingTrip.value.id, tripData)
        toast.success(t('dashboard.tripUpdated'))
      } else {
        await tripService.createTrip(tripData)
        toast.success(t('dashboard.tripCreated'))
      }

      closeModal()
      fetchTrips(0, false)
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.code === 'ERR_NETWORK' || apiError.message === 'Network Error') {
        const errorMsg = t('dashboard.networkError')
        formError.value = errorMsg
        toast.error(errorMsg)
        return
      }
      
      if (apiError.response?.status === 403) {
        const errorMsg = t('dashboard.canOnlyEditOwn')
        formError.value = errorMsg
        toast.error(errorMsg)
      } else if (apiError.response?.data?.error) {
        formError.value = apiError.response.data.error
        toast.error(apiError.response.data.error)
      } else {
        const errorMsg = t('dashboard.saveError')
        formError.value = errorMsg
        toast.error(errorMsg)
      }
    } finally {
      submitting.value = false
    }
  }

  const closeModal = (): void => {
    showCreateModal.value = false
    editingTrip.value = null
    formData.value = {
      title: '',
      description: '',
      photos: [],
      tags: [],
      latitude: null,
      longitude: null
    }
    formError.value = ''
  }

  const init = (): void => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchTrips(0, false)
  }

  return {
    trips,
    loading,
    loadingMore,
    hasMore,
    showCreateModal,
    editingTrip,
    tripToDelete,
    deleting,
    submitting,
    formError,
    formData,
    fetchTrips,
    loadMore,
    openCreateModal,
    editTrip,
    confirmDelete,
    handleDelete,
    handleSubmit,
    closeModal,
    init
  }
}

