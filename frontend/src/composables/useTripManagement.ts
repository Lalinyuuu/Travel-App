import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { tripService } from '../services/api'
import { useToast } from './useToast'
import type { Trip, TripSummary, FormData, CreateTripData, ApiError } from '../types'

export function useTripManagement(
  trips: Ref<TripSummary[]>,
  currentPage: Ref<number>,
  fetchTrips: (page: number, append: boolean, query: string | null) => void,
  searchQuery: Ref<string>
) {
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()

  const showEditModal: Ref<boolean> = ref(false)
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

  const handleEditTrip = async (trip: TripSummary): Promise<void> => {
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
      showEditModal.value = true
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.response?.status === 403) {
        toast.error(t('allTrips.canOnlyEditOwn'))
      } else {
        toast.error(t('allTrips.loadError'))
      }
    }
  }

  const handleDeleteTrip = (trip: TripSummary): void => {
    tripToDelete.value = trip
  }

  const confirmDelete = async (): Promise<void> => {
    if (!tripToDelete.value) return

    try {
      deleting.value = true
      await tripService.deleteTrip(tripToDelete.value.id)
      trips.value = trips.value.filter(t => t.id !== tripToDelete.value.id)
      tripToDelete.value = null
      toast.success(t('allTrips.tripDeleted'))
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.response?.status === 403) {
        toast.error(t('allTrips.canOnlyDeleteOwn'))
      } else if (apiError.response?.data?.error) {
        toast.error(apiError.response.data.error)
      } else {
        toast.error(t('allTrips.deleteError'))
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

      if (!editingTrip.value) return

      await tripService.updateTrip(editingTrip.value.id, tripData)
      toast.success(t('dashboard.tripUpdated'))

      closeModal()
      fetchTrips(currentPage.value, false, searchQuery.value || null)
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.code === 'ERR_NETWORK' || apiError.message === 'Network Error') {
        const errorMsg = t('allTrips.networkError')
        formError.value = errorMsg
        toast.error(errorMsg)
        return
      }
      
      if (apiError.response?.status === 403) {
        const errorMsg = t('allTrips.canOnlyEditOwn')
        formError.value = errorMsg
        toast.error(errorMsg)
      } else if (apiError.response?.data?.error) {
        formError.value = apiError.response.data.error
        toast.error(apiError.response.data.error)
      } else {
        const errorMsg = t('allTrips.saveError')
        formError.value = errorMsg
        toast.error(errorMsg)
      }
    } finally {
      submitting.value = false
    }
  }

  const closeModal = (): void => {
    showEditModal.value = false
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

  return {
    showEditModal,
    editingTrip,
    tripToDelete,
    deleting,
    submitting,
    formError,
    formData,
    handleEditTrip,
    handleDeleteTrip,
    confirmDelete,
    handleSubmit,
    closeModal
  }
}

