<template>
  <div class="flex justify-between items-start mb-6 gap-4 flex-wrap md:flex-col md:items-start md:gap-3">
    <h1 class="text-3xl md:text-2xl sm:text-xl font-bold text-gray-7 m-0 flex-1 leading-tight">{{ trip.title }}</h1>
    <span v-if="trip.province" class="text-base md:text-sm sm:text-xs text-white bg-(--color-province-tag) px-4 py-2 md:px-3 md:py-1.5 sm:px-2 sm:py-1 rounded-xl whitespace-nowrap font-medium transition-colors duration-300">{{ translateTag(trip.province) }}</span>
  </div>
  <p v-if="trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at" class="text-sm text-gray-4 my-2 mb-4">
    {{ $t('trip.updated') }}: {{ formatDate(trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at) }}
  </p>
</template>

<script setup>
import { useDateFormat } from '../../composables/useDateFormat'
import { useTagTranslation } from '../../composables/useTagTranslation'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

const { formatDate } = useDateFormat()
const { translateTag } = useTagTranslation()
</script>


