<template>
  <div class="min-h-screen bg-(--color-background)">
    <NavBar />

    <main class="py-8 md:py-8">
      <div class="container">
        <div v-if="loading" class="text-center py-16">
          <p>{{ $t('trip.loading') }}</p>
        </div>

        <div v-else-if="error" class="text-center py-16">
          <div>
            <h3 class="text-red-4 mb-4">{{ $t('trip.tripNotFound') }}</h3>
            <p>{{ error }}</p>
            <router-link to="/" class="btn btn-primary mt-4">{{ $t('trip.goHome') }}</router-link>
          </div>
        </div>

        <div v-else-if="trip" class="bg-white dark:bg-(--color-card-bg) rounded-xl overflow-hidden shadow-md p-8 md:p-8">
          <router-link to="/" class="inline-flex items-center gap-2 text-blue-4 no-underline mb-8 font-medium transition-colors duration-300 hover:text-blue-5 text-sm md:text-base">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ $t('trip.back') }}
          </router-link>

          <TripImageGallery
            :photos="trip.photos"
            :title="translatedTitle"
            v-model:current-index="currentImageIndex"
          />

          <div class="p-0">
            <TripHeader :trip="trip" />

            <TripActions
              :is-owner="isOwner"
              @edit="handleEdit"
              @delete="confirmDelete"
            />

            <TripTags :tags="trip.tags" />

            <TripDescription :trip="trip" :description="trip.description" />

            <TripMap
              :latitude="trip.latitude"
              :longitude="trip.longitude"
              :title="translatedTitle"
            />
          </div>
        </div>
      </div>
    </main>

    <DeleteConfirmModal
      v-if="showDeleteModal"
      :trip="trip"
      :deleting="deleting"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <TripFormModal
      v-if="showEditModal"
      :visible="showEditModal"
      :editing-trip="trip"
      :initial-data="formData"
      :form-error="formError"
      :submitting="submitting"
      @close="closeEditModal"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import TripFormModal from '../components/dashboard/TripFormModal.vue'
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal.vue'
import TripImageGallery from '../components/trip-detail/TripImageGallery.vue'
import TripMap from '../components/trip-detail/TripMap.vue'
import TripHeader from '../components/trip-detail/TripHeader.vue'
import TripTags from '../components/trip-detail/TripTags.vue'
import TripDescription from '../components/trip-detail/TripDescription.vue'
import TripActions from '../components/trip-detail/TripActions.vue'
import { useTripDetail } from '../composables/useTripDetail'
import { useTripTranslation } from '../composables/useTripTranslation'

const {
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
} = useTripDetail()

const { getTranslatedTitle } = useTripTranslation()
const translatedTitle = computed(() => trip.value ? getTranslatedTitle(trip.value) : '')

onMounted(() => {
  fetchTrip()
})
</script>

