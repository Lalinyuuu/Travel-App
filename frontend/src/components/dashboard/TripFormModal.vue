<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-1000 p-4" @click="$emit('close')">
    <div class="modal-form-bg rounded-xl p-8 md:p-6 sm:p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="m-0 text-2xl md:text-xl text-(--color-text) transition-colors duration-300">{{ editingTrip ? $t('trip.edit') : $t('dashboard.addTrip') }}</h2>
        <button @click="$emit('close')" class="bg-transparent border-none text-3xl text-(--color-text-secondary) cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center transition-colors duration-300 hover:text-(--color-text)">&times;</button>
      </div>
      <form @submit.prevent="$emit('submit', formData)" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-(--color-text) transition-colors duration-300">{{ $t('trip.title') }} *</label>
          <input v-model="formData.title" required class="modal-form-input px-3 py-2.5 border-2 rounded-md text-base font-inherit text-(--color-text) transition-all duration-300 focus:outline-none focus:border-primary md:text-sm" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-(--color-text) transition-colors duration-300">{{ $t('trip.description') }}</label>
          <textarea v-model="formData.description" rows="5" class="modal-form-input px-3 py-2.5 border-2 rounded-md text-base font-inherit text-(--color-text) transition-all duration-300 focus:outline-none focus:border-primary md:text-sm"></textarea>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-(--color-text) transition-colors duration-300">{{ $t('trip.photos') }} (URLs, {{ $t('trip.addPhoto') }}) *</label>
          <textarea
            v-model="photosText"
            rows="4"
            required
            class="modal-form-input px-3 py-2.5 border-2 rounded-md text-base font-inherit text-(--color-text) transition-all duration-300 focus:outline-none focus:border-primary md:text-sm"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          ></textarea>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-(--color-text) transition-colors duration-300">{{ $t('trip.tags') }}</label>
          <input
            v-model="tagsText"
            class="modal-form-input px-3 py-2.5 border-2 rounded-md text-base font-inherit text-(--color-text) transition-all duration-300 focus:outline-none focus:border-primary md:text-sm"
            :placeholder="$t('trip.tags')"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-(--color-text) transition-colors duration-300">{{ $t('trip.location') }}</label>
          <div class="relative flex items-center">
            <input
              v-model="locationSearch"
              type="text"
              class="modal-form-input px-3 py-2.5 pr-10 border-2 rounded-md text-base font-inherit text-(--color-text) transition-all duration-300 focus:outline-none focus:border-primary md:text-sm w-full"
              :placeholder="$t('trip.searchLocation')"
              @input="handleLocationSearch"
              @focus="showMapPicker = true"
            />
            <button
              v-if="locationSearch"
              @click="clearLocation"
              type="button"
              class="absolute right-2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-(--color-text-secondary) transition-colors duration-200 hover:text-(--color-text)"
              :title="$t('landing.clearSearch')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div v-if="locationSearchResults.length > 0" class="modal-form-bg modal-form-border mt-2 border rounded-lg max-h-[200px] md:max-h-[150px] overflow-y-auto shadow-md dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <div
              v-for="place in locationSearchResults"
              :key="place.place_id"
              @click="selectLocation(place)"
              class="modal-form-border flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 border-b last:border-b-0 hover:bg-(--color-background-light)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 text-primary transition-colors duration-300">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div class="flex-1">
                <div class="text-sm text-(--color-text) transition-colors duration-300">{{ place.description }}</div>
              </div>
            </div>
          </div>
          <div v-if="showMapPicker && (formData.latitude && formData.longitude)" class="modal-form-border mt-4 border rounded-lg overflow-hidden transition-colors duration-300">
            <div class="flex justify-between items-center px-4 py-3 bg-(--color-background-light) border-b border-(--color-border) text-sm text-(--color-text-secondary) transition-colors duration-300">
              <span>{{ $t('trip.location') }}</span>
              <button @click="showMapPicker = false" class="bg-transparent border-none text-2xl text-(--color-text-secondary) cursor-pointer leading-none p-0 w-6 h-6 flex items-center justify-center transition-colors duration-300 hover:text-(--color-text)">×</button>
            </div>
            <div ref="mapPickerContainer" class="w-full h-[300px] md:h-[250px]"></div>
          </div>
          <div v-if="formData.latitude && formData.longitude" class="mt-2 px-2 py-2 bg-(--color-background-light) rounded-md text-sm text-(--color-text-secondary) flex justify-between items-center transition-colors duration-300">
            <span>{{ $t('trip.location') }}: {{ formData.latitude.toFixed(6) }}, {{ formData.longitude.toFixed(6) }}</span>
            <button @click="clearLocation" type="button" class="bg-transparent border-none text-primary cursor-pointer text-sm underline p-0 transition-colors duration-300 hover:text-secondary">{{ $t('trip.cancel') }}</button>
          </div>
        </div>
        <div v-if="formError" class="bg-red-1 dark:bg-blue-1/20 text-red-4 dark:text-primary px-3 py-3 rounded-lg text-sm transition-colors duration-300">{{ formError }}</div>
        <div class="flex gap-4 justify-end mt-4">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">{{ $t('trip.cancel') }}</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? $t('trip.saving') : $t('trip.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocationSearch } from '../../composables/useLocationSearch'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editingTrip: {
    type: Object,
    default: null
  },
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      photos: [],
      tags: [],
      latitude: null,
      longitude: null
    })
  },
  formError: {
    type: String,
    default: ''
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  title: '',
  description: '',
  photos: [],
  tags: [],
  latitude: null,
  longitude: null
})

const {
  locationSearch,
  locationSearchResults,
  showMapPicker,
  mapPickerContainer,
  handleLocationSearch,
  selectLocation,
  clearLocation,
  reset: resetLocation,
  initMapPicker
} = useLocationSearch(formData)

const photosText = computed({
  get: () => formData.value.photos.join('\n'),
  set: (value) => {
    formData.value.photos = value.split('\n').filter(url => url.trim())
  }
})

const tagsText = computed({
  get: () => formData.value.tags.join(', '),
  set: (value) => {
    formData.value.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      title: newData.title || '',
      description: newData.description || '',
      photos: newData.photos || [],
      tags: newData.tags || [],
      latitude: newData.latitude || null,
      longitude: newData.longitude || null
    }
    if (newData.latitude && newData.longitude) {
      locationSearch.value = `${newData.latitude.toFixed(6)}, ${newData.longitude.toFixed(6)}`
    } else {
      locationSearch.value = ''
    }
  }
}, { immediate: true, deep: true })

watch([() => props.visible, () => showMapPicker.value, () => formData.value.latitude, () => formData.value.longitude], ([visible, mapVisible, lat, lng]) => {
  if (visible && mapVisible && lat && lng) {
    nextTick(() => {
      initMapPicker()
    })
  }
})

watch(() => props.visible, (visible) => {
  if (!visible) {
    resetLocation()
  }
})
</script>


