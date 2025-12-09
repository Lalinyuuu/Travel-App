<template>
  <div class="mb-8">
    <h2 class="text-2xl md:text-xl font-semibold text-gray-7 dark:text-(--color-text) mb-4">{{ $t('trip.details') }}</h2>
    <p v-if="translatedDescription" class="text-base md:text-sm leading-relaxed text-gray-6 dark:text-(--color-text-secondary) whitespace-pre-line">{{ translatedDescription }}</p>
    <p v-else class="text-base md:text-sm leading-relaxed text-gray-4 dark:text-gray-4 italic">{{ $t('trip.noDescription') }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTripTranslation } from '../../composables/useTripTranslation'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})

const { getTranslatedDescription } = useTripTranslation()

const translatedDescription = computed(() => {
  if (props.trip) {
    return getTranslatedDescription(props.trip)
  }
  return props.description
})
</script>


