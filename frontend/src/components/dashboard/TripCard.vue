<template>
  <div class="bg-(--color-card-bg) rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
    <div class="w-full h-48 md:h-44 sm:h-40 overflow-hidden bg-gray-2 dark:bg-(--color-background-light) transition-colors duration-300">
      <img
        v-if="trip.coverImage"
        :src="trip.coverImage"
        :alt="trip.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-4 dark:text-(--color-text-secondary) transition-colors duration-300">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    </div>
    <div class="p-6 md:p-4 sm:p-3.5">
      <h3 class="text-xl md:text-lg font-semibold text-(--color-text) m-0 mb-2 transition-colors duration-300">{{ translatedTitle }}</h3>
      <p v-if="trip.province" class="text-sm text-primary mb-2 transition-colors duration-300">{{ translateTag(trip.province) }}</p>
      <p class="text-sm text-(--color-text-secondary) mb-2 line-clamp-2 transition-colors duration-300">{{ translatedShortDescription }}</p>
      <p v-if="trip.updatedAt" class="text-xs text-(--color-text-secondary) mb-4 transition-colors duration-300">{{ $t('landing.updated') }}: {{ formatDate(trip.updatedAt) }}</p>
      <div class="flex gap-2 flex-wrap md:flex-col">
        <router-link :to="`/trips/${trip.id}`" class="btn btn-outline px-3 py-1.5 text-sm md:w-full">
          {{ $t('landing.viewDetail') }}
        </router-link>
        <button 
          v-if="isOwner" 
          @click="$emit('edit', trip)" 
          class="btn btn-primary px-3 py-1.5 text-sm md:w-full"
        >
          {{ $t('trip.edit') }}
        </button>
        <button 
          v-if="isOwner" 
          @click="$emit('delete', trip)" 
          class="px-3 py-1.5 text-sm text-white border-none rounded-md font-medium transition-colors duration-300 bg-red-4 dark:bg-primary hover:bg-red-5 dark:hover:bg-secondary md:w-full"
        >
          {{ $t('trip.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authService } from '../../services/auth'
import { useDateFormat } from '../../composables/useDateFormat'
import { useTagTranslation } from '../../composables/useTagTranslation'
import { useTripTranslation } from '../../composables/useTripTranslation'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const { formatDate } = useDateFormat()
const { translateTag } = useTagTranslation()
const { getTranslatedTitle, getTranslatedShortDescription } = useTripTranslation()

const translatedTitle = computed(() => getTranslatedTitle(props.trip))
const translatedShortDescription = computed(() => getTranslatedShortDescription(props.trip))

const isOwner = computed(() => {
  const currentUser = authService.getCurrentUser()
  if (!currentUser || !props.trip.authorId) {
    return false
  }
  return Number(currentUser.id) === Number(props.trip.authorId)
})
</script>


