import { ref, computed, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { tripService } from '../services/api'
import { authService } from '../services/auth'
import { useToast } from './useToast'
import type { Trip, FormData, CreateTripData, ApiError } from '../types'

export function useTripDetail() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()

  const trip: Ref<Trip | null> = ref(null)
  const loading: Ref<boolean> = ref(true)
  const error: Ref<string | null> = ref(null)
  const currentImageIndex: Ref<number> = ref(0)
  const showDeleteModal: Ref<boolean> = ref(false)
  const showEditModal: Ref<boolean> = ref(false)
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

  const isOwner = computed(() => {
    if (!trip.value || !authService.isAuthenticated()) {
      return false
    }
    const currentUser = authService.getCurrentUser()
    if (!currentUser || !trip.value.authorId) {
      return false
    }
    return Number(currentUser.id) === Number(trip.value.authorId)
  })

  const fetchTrip = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      currentImageIndex.value = 0
      const tripId = route.params.id as string
      const response: Trip = await tripService.getTripById(tripId)
      trip.value = response
      
      if (trip.value && trip.value.tags) {
        const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี', 'ตราด', 'กาญจนบุรี', 'สตูล', 'ภูเก็ต', 'พังงา', 'กระบี่', 'ระยอง']
        for (const tag of trip.value.tags) {
          for (const province of provinces) {
            if (tag.includes(province)) {
              trip.value.province = province
              break
            }
          }
        }
      }
      loading.value = false
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.response?.status === 404) {
        error.value = t('trip.tripNotFound')
      } else if (apiError.response?.status === 403) {
        error.value = t('trip.noPermission')
      } else {
        error.value = apiError.response?.data?.message || apiError.response?.data?.error || t('trip.tripNotFound')
      }
      loading.value = false
    }
  }

  const handleEdit = (): void => {
    if (!authService.isAuthenticated()) {
      toast.error(t('trip.pleaseLoginToEdit'))
      router.push('/login')
      return
    }

    if (!isOwner.value) {
      toast.error(t('trip.canOnlyEditOwn'))
      return
    }

    if (!trip.value) return

    formData.value = {
      title: trip.value.title,
      description: trip.value.description || '',
      photos: trip.value.photos || [],
      tags: trip.value.tags || [],
      latitude: trip.value.latitude || null,
      longitude: trip.value.longitude || null
    }
    formError.value = ''
    showEditModal.value = true
  }

  const confirmDelete = (): void => {
    if (!authService.isAuthenticated()) {
      toast.error(t('trip.pleaseLoginToDelete'))
      router.push('/login')
      return
    }

    if (!isOwner.value) {
      toast.error(t('trip.canOnlyDeleteOwn'))
      return
    }

    showDeleteModal.value = true
  }

  const handleDelete = async (): Promise<void> => {
    if (!trip.value) return

    try {
      deleting.value = true
      await tripService.deleteTrip(trip.value.id)
      toast.success(t('trip.tripDeleted'))
      router.push('/trips')
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.response?.status === 401) {
        toast.error(t('trip.pleaseLoginAgain'))
        authService.clearAuthData()
        router.push('/login')
      } else if (apiError.response?.status === 403) {
        toast.error(t('trip.noPermissionToDelete'))
      } else if (apiError.response?.data?.error) {
        toast.error(apiError.response.data.error)
      } else {
        toast.error(t('trip.deleteError'))
      }
    } finally {
      deleting.value = false
      showDeleteModal.value = false
    }
  }

  const handleUpdate = async (data: CreateTripData): Promise<void> => {
    formError.value = ''
    
    if (!data.title) {
      formError.value = t('trip.titleRequired')
      return
    }
    
    if (!data.photos || data.photos.length === 0) {
      formError.value = t('trip.photoRequired')
      return
    }

    if (!trip.value) return

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

      await tripService.updateTrip(trip.value.id, tripData)
      toast.success(t('trip.tripUpdated'))
      closeEditModal()
      await fetchTrip()
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.response?.status === 401) {
        const errorMsg = t('trip.pleaseLoginAgain')
        formError.value = errorMsg
        toast.error(errorMsg)
        authService.clearAuthData()
        router.push('/login')
      } else if (apiError.response?.status === 403) {
        const errorMsg = t('trip.canOnlyEditOwn')
        formError.value = errorMsg
        toast.error(errorMsg)
      } else if (apiError.response?.data?.error) {
        formError.value = apiError.response.data.error
        toast.error(apiError.response.data.error)
      } else {
        const errorMsg = t('trip.saveError')
        formError.value = errorMsg
        toast.error(errorMsg)
      }
    } finally {
      submitting.value = false
    }
  }

  const closeEditModal = (): void => {
    showEditModal.value = false
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
    trip,
    loading,
    error,
    currentImageIndex,
    showDeleteModal,
    showEditModal,
    deleting,
    submitting,
    formError,
    formData,
    isOwner,
    fetchTrip,
    handleEdit,
    confirmDelete,
    handleDelete,
    handleUpdate,
    closeEditModal
  }
}

