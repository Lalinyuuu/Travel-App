<template>
  <div v-if="!loading && tripsCount > 0" class="pagination-section">
    <button
      v-if="hasMore"
      @click="$emit('loadMore')"
      class="btn btn-primary load-more-btn"
      :disabled="loadingMore"
    >
      {{ loadingMore ? $t('allTrips.loadingMore') : $t('allTrips.loadMore') }}
    </button>
    <div v-if="!hasMore && tripsCount > 0" class="pagination-info">
      <p>{{ $t('allTrips.showing', { count: tripsCount, total: totalElements }) }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tripsCount: {
    type: Number,
    default: 0
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  totalElements: {
    type: Number,
    default: 0
  }
})

defineEmits(['loadMore'])
</script>

