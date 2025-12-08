<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <NavBar />

    <main class="py-8">
      <div class="container">
        <SearchSection
          :display-value="displaySearchQuery"
          @update:model-value="updateSearchQuery"
          @search="handleSearch"
          @clear="clearSearch"
          @input="handleSearchInput"
        />

        <section>
          <LoadingState v-if="loading" />

          <EmptyState
            v-else-if="!loading && trips.length === 0"
            :has-search="!!searchQuery"
          />

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AllTripsCard
              v-for="trip in trips"
              :key="trip.id"
              :trip="trip"
              @click="goToTripDetail"
              @edit="handleEditTrip"
              @delete="handleDeleteTrip"
              @share="handleShare"
              @tag-click="handleTagClick"
            />
          </div>

          <PaginationSection
            :loading="loading"
            :trips-count="trips.length"
            :has-more="hasMore"
            :loading-more="loadingMore"
            :total-elements="totalElements"
            @load-more="loadMore"
          />
        </section>
      </div>
    </main>

    <TripFormModal
      :visible="showEditModal"
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
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import TripFormModal from '../components/dashboard/TripFormModal.vue'
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal.vue'
import SearchSection from '../components/all-trips/SearchSection.vue'
import AllTripsCard from '../components/all-trips/AllTripsCard.vue'
import EmptyState from '../components/all-trips/EmptyState.vue'
import PaginationSection from '../components/all-trips/PaginationSection.vue'
import LoadingState from '../components/all-trips/LoadingState.vue'
import { useTripList } from '../composables/useTripList'
import { useTripSearch } from '../composables/useTripSearch'
import { useTripManagement } from '../composables/useTripManagement'
import { useTripShare } from '../composables/useTripShare'

const route = useRoute()
const router = useRouter()

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
} = useTripList(12)

const handleSearchWithPage = (query) => {
  resetPage()
  fetchTrips(0, false, query, query)
}

const {
  searchQuery,
  displaySearchQuery,
  updateSearchQuery,
  handleSearch,
  handleSearchInput,
  clearSearch,
  handleTagClick
} = useTripSearch(handleSearchWithPage)

const {
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
} = useTripManagement(trips, currentPage, fetchTrips, searchQuery)

const { handleShare } = useTripShare()

const goToTripDetail = (tripId) => {
  router.push(`/trips/${tripId}`)
}

onMounted(() => {
  if (route.query.search) {
    updateSearchQuery(route.query.search)
    fetchTrips(0, false, route.query.search, route.query.search)
  } else {
    fetchTrips(0)
  }
})
</script>
