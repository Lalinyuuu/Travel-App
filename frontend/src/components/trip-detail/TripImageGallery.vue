<template>
  <div class="mb-8 max-md:mb-6" v-if="photos && photos.length > 0">
    <div class="w-full h-[500px] max-md:h-[250px] max-sm:h-[200px] overflow-hidden rounded-lg md:rounded-xl mb-4 bg-gray-2 dark:bg-gray-7">
      <img :src="photos[currentIndex]" :alt="title" @error="handleImageError" class="w-full h-full object-cover" />
    </div>
    <div class="flex gap-4 max-md:gap-2 max-md:mt-3" v-if="photos.length > 1">
      <img
        v-for="(photo, index) in photos.slice(0, 4)"
        :key="index"
        :src="photo"
        :alt="`${title} - Image ${index + 1}`"
        @click="$emit('update:currentIndex', index)"
        @error="handleImageError"
        class="w-[150px] h-[150px] max-md:w-20 max-md:h-20 max-sm:w-[60px] max-sm:h-[60px] object-cover rounded-lg cursor-pointer transition-all duration-300 bg-gray-2 dark:bg-gray-7 border-4 border-transparent opacity-70 hover:scale-105 hover:opacity-100"
        :class="{ 'border-blue-3 opacity-100 scale-105': currentIndex === index }"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:currentIndex'])

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>


