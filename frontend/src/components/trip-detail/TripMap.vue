<template>
  <div class="mt-12 pt-8 border-t border-gray-2 dark:border-gray-7 max-md:mt-8 max-md:pt-6">
    <h2 class="text-2xl md:text-xl font-semibold text-gray-7 dark:text-(--color-text) mb-4">{{ $t('trip.locationTitle') }}</h2>
    <div v-if="latitude && longitude" class="rounded-lg overflow-hidden mb-4">
      <div ref="mapContainer" class="w-full h-[400px] md:h-[300px] sm:h-[250px] rounded-lg"></div>
      <a
        :href="`https://www.google.com/maps?q=${latitude},${longitude}`"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary mt-4"
      >
        {{ $t('trip.openInGoogleMaps') }}
      </a>
    </div>
    <div v-else class="p-8 md:p-6 text-center bg-gray-1 dark:bg-gray-8 rounded-lg text-gray-6 dark:text-gray-3">
      <p>{{ $t('trip.noLocationData') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  latitude: {
    type: [Number, String],
    default: null
  },
  longitude: {
    type: [Number, String],
    default: null
  },
  title: {
    type: String,
    default: 'Trip Location'
  }
})

const mapContainer = ref(null)
const map = ref(null)

const initMap = async () => {
  if (!props.latitude || !props.longitude) {
    return
  }

  await nextTick()
  
  if (!mapContainer.value) {
    setTimeout(() => initMap(), 200)
    return
  }

  if (typeof google === 'undefined' || !google.maps) {
    const checkGoogleMaps = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps) {
        clearInterval(checkGoogleMaps)
        initMap()
      }
    }, 100)
    
    setTimeout(() => {
      clearInterval(checkGoogleMaps)
    }, 10000)
    return
  }

  if (map.value) {
    return
  }

  try {
    const position = {
      lat: parseFloat(props.latitude),
      lng: parseFloat(props.longitude)
    }

    if (isNaN(position.lat) || isNaN(position.lng)) {
      console.error('Invalid coordinates:', props.latitude, props.longitude)
      return
    }

    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || null
    
    const mapOptions = {
      center: position,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    }

    if (mapId) {
      mapOptions.mapId = mapId
    }

    map.value = new google.maps.Map(mapContainer.value, mapOptions)

    if (mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      new google.maps.marker.AdvancedMarkerElement({
        map: map.value,
        position: position,
        title: props.title
      })
    } else {
      new google.maps.Marker({
        position: position,
        map: map.value,
        title: props.title,
        animation: google.maps.Animation.DROP
      })
    }
  } catch (err) {
    console.error('Error initializing Google Maps:', err)
  }
}

watch(() => [props.latitude, props.longitude], async ([lat, lng]) => {
  if (lat && lng) {
    if (map.value) {
      map.value = null
    }
    await initMap()
  }
}, { immediate: false })

onMounted(() => {
  if (props.latitude && props.longitude) {
    initMap()
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value = null
  }
})
</script>


