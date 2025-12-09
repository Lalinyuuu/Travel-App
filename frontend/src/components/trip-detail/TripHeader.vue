<template>
  <div class="flex justify-between items-start mb-6 gap-6 flex-wrap md:flex-col md:items-start md:gap-4">
    <h1 class="text-3xl md:text-2xl sm:text-xl font-bold text-gray-7 dark:text-(--color-text) m-0 flex-1 leading-tight transition-colors duration-300">{{ translatedTitle }}</h1>
    <span v-if="trip.province" class="text-base md:text-sm sm:text-xs text-white bg-province-tag px-4 py-2 md:px-3 md:py-1.5 sm:px-2 sm:py-1 rounded-xl whitespace-nowrap font-medium transition-colors duration-300">{{ translateTag(trip.province) }}</span>
  </div>
  <p v-if="trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at" class="text-sm my-2 mb-4 transition-colors duration-300" style="color: var(--color-timestamp);">
    {{ $t('trip.updated') }}: {{ formatDate(trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at) }}
  </p>
</template>

<script setup>
import { computed } from 'vue'
import { useDateFormat } from '../../composables/useDateFormat'
import { useTagTranslation } from '../../composables/useTagTranslation'
import { useTripTranslation } from '../../composables/useTripTranslation'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

const { formatDate } = useDateFormat()
const { translateTag } = useTagTranslation()
const { getTranslatedTitle } = useTripTranslation()

const translatedTitle = computed(() => getTranslatedTitle(props.trip))
</script>


