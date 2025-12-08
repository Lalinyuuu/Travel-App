<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <NavBar />
    
    <main class="py-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 class="text-3xl md:text-4xl font-bold text-(--color-text) m-0">{{ $t('dashboard.title') }}</h1>
          <button @click="openCreateModal" class="btn btn-primary px-4 py-2">
            {{ $t('dashboard.addTrip') }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-16 text-(--color-text-secondary)">
          <p>{{ $t('dashboard.loading') }}</p>
        </div>

        <div v-else-if="!loading && trips.length === 0" class="flex justify-center items-center min-h-[400px] py-16">
          <div class="text-center text-(--color-text-secondary)">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-6 opacity-50">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h3 class="text-2xl mb-2 text-(--color-text)">{{ $t('dashboard.noTrips') }}</h3>
            <p class="text-base mb-4">{{ $t('dashboard.noTripsDesc') }}</p>
            <button @click="openCreateModal" class="btn btn-primary">
              {{ $t('dashboard.addTrip') }}
            </button>
          </div>
        </div>

        <div v-else class="mt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <TripCard
              v-for="trip in trips"
              :key="trip.id"
              :trip="trip"
              @edit="editTrip"
              @delete="confirmDelete"
            />
          </div>

          <div v-if="hasMore" class="text-center py-8">
            <button @click="loadMore" class="btn btn-primary px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed" :disabled="loadingMore">
              {{ loadingMore ? $t('dashboard.loadingMore') : $t('dashboard.loadMore') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <TripFormModal
      :visible="showCreateModal || !!editingTrip"
      :editing-trip="editingTrip"
      :initial-data="formData"
      :form-error="formError"
      :submitting="submitting"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <DeleteConfirmModal
      :trip="tripToDelete"
      :deleting="deleting"
      @close="tripToDelete = null"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import TripCard from '../components/dashboard/TripCard.vue'
import TripFormModal from '../components/dashboard/TripFormModal.vue'
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal.vue'
import { useDashboard } from '../composables/useDashboard'

const {
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
  loadMore,
  openCreateModal,
  editTrip,
  confirmDelete,
  handleDelete,
  handleSubmit,
  closeModal,
  init
} = useDashboard()

onMounted(() => {
  init()
})
</script>
