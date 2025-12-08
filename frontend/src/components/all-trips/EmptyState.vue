<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-state-icon">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      <h3 v-if="hasSearch" class="empty-state-title">{{ $t('allTrips.noTripsFound') }}</h3>
      <p v-if="hasSearch" class="empty-state-text">{{ $t('allTrips.noTripsFoundDesc') }}</p>
      <p v-else class="empty-state-text">{{ $t('allTrips.beFirstToShare') }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasSearch: {
    type: Boolean,
    default: false
  }
})
</script>

