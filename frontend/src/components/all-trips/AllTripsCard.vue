<template>
  <div
    class="bg-(--color-card-bg) rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col relative cursor-pointer border border-(--color-border) hover:-translate-y-1 hover:shadow-xl dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]"
    @click="$emit('click', trip.id)"
  >
    <div class="w-full h-64 min-h-64 max-h-64 overflow-hidden bg-(--color-background-light) relative shrink-0 rounded-t-xl">
      <img
        v-if="trip.coverImage"
        :src="trip.coverImage"
        :alt="trip.title"
        class="w-full h-full object-cover block transition-opacity duration-300"
        loading="lazy"
        decoding="async"
        @error="handleImageError($event)"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-4">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    </div>
    <div class="p-6 flex-1 flex flex-col min-w-0 bg-(--color-card-bg) shrink-0">
      <div class="flex justify-between items-start mb-3 gap-4">
        <h3 class="text-xl font-semibold text-(--color-text) m-0 flex-1 line-clamp-2 leading-tight">{{ trip.title }}</h3>
        <span v-if="trip.province" class="text-sm text-white bg-province-tag px-3 py-1 rounded-xl whitespace-nowrap shrink-0 font-medium transition-colors duration-300">{{ translateTag(trip.province) }}</span>
      </div>
      <p v-if="trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at" class="text-xs text-gray-4 my-2">
        {{ $t('allTrips.updated') }}: {{ formatDate(trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at) }}
      </p>
      <p class="text-sm text-(--color-text-secondary) mb-4 line-clamp-3 flex-1 min-h-18 leading-relaxed">{{ trip.shortDescription }}</p>
      <div class="mt-auto flex flex-col gap-4 shrink-0">
        <div class="h-[120px] overflow-y-auto" v-if="trip.tags && trip.tags.length > 0">
          <div class="flex flex-wrap items-start gap-2">
            <span
              v-for="(tag, index) in trip.tags"
              :key="index"
              class="text-xs text-white bg-secondary px-3 py-1 rounded-lg border border-(--color-border) cursor-pointer transition-all duration-300 inline-block hover:bg-[#6b85c4] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(127,149,209,0.3)]"
              @click.stop="$emit('tagClick', tag)"
            >
              {{ translateTag(tag) }}
            </span>
          </div>
        </div>
        <div v-else class="h-[120px]"></div>
        <div class="flex justify-between items-end gap-2">
          <div v-if="isOwner" class="flex gap-2" @click.stop>
            <button @click="$emit('edit', trip)" class="btn btn-outline px-3 py-1.5 text-sm">
              {{ $t('allTrips.edit') }}
            </button>
            <button @click="$emit('delete', trip)" class="px-3 py-1.5 text-sm text-white border-none rounded-md font-medium transition-colors duration-300 bg-red-4 dark:bg-primary hover:bg-red-5 dark:hover:bg-secondary">
              {{ $t('allTrips.delete') }}
            </button>
          </div>
          <div v-else></div>
          <router-link
            :to="`/trips/${trip.id}`"
            class="text-center bg-primary text-white border-none px-6 py-2.5 rounded-lg font-medium transition-all duration-300 no-underline hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(255,130,169,0.3)] dark:hover:shadow-[0_10px_15px_-3px_rgba(68,109,146,0.4)]"
            @click.stop
          >
            {{ $t('allTrips.viewDetail') }}
          </router-link>
        </div>
      </div>
    </div>
    <button class="absolute right-4 top-4 bg-white/90 dark:bg-[rgba(36,73,107,0.9)] border-none cursor-pointer p-2 text-primary flex items-center justify-center rounded-full transition-all duration-300 z-10 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] hover:bg-[#FFC0BE] dark:hover:bg-secondary hover:scale-110 hover:shadow-[0_10px_15px_-3px_rgba(255,130,169,0.2)] dark:hover:shadow-[0_10px_15px_-3px_rgba(68,109,146,0.3)]" @click.stop="$emit('share', trip)" :title="$t('allTrips.shareLink')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authService } from '../../services/auth'
import { useDateFormat } from '../../composables/useDateFormat'
import { useTagTranslation } from '../../composables/useTagTranslation'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'edit', 'delete', 'share', 'tagClick'])

const { formatDateFull } = useDateFormat()
const { translateTag } = useTagTranslation()

const isOwner = computed(() => {
  const currentUser = authService.getCurrentUser()
  if (!currentUser || !props.trip.authorId) {
    return false
  }
  return currentUser.id === props.trip.authorId
})

const formatDate = (dateString) => {
  return formatDateFull(dateString)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const container = event.target.closest('.trip-image-container')
  if (container) {
    const placeholder = container.querySelector('.trip-image-placeholder')
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }
}
</script>

