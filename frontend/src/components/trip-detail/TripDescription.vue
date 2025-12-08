<template>
  <div class="mb-8">
    <h2 class="text-2xl md:text-xl font-semibold text-gray-7 dark:text-(--color-text) mb-4">{{ $t('trip.details') }}</h2>
    <p v-if="description" class="text-base md:text-sm leading-relaxed text-gray-6 dark:text-(--color-text-secondary) whitespace-pre-line">{{ description }}</p>
    <p v-else class="text-base md:text-sm leading-relaxed text-gray-4 dark:text-gray-4 italic">{{ $t('trip.noDescription') }}</p>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: ''
  }
})
</script>


