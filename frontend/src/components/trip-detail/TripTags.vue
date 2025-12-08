<template>
  <div class="flex flex-wrap gap-2 md:gap-1.5 mt-6 mb-8" v-if="tags && tags.length > 0">
    <button
      v-for="(tag, index) in tags"
      :key="index"
      class="text-sm md:text-xs sm:text-xs text-[#ffee98] bg-secondary px-4 py-2 md:px-3 md:py-1.5 sm:px-2 sm:py-1 rounded-full border border-[rgba(127,149,209,0.2)] font-medium cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,130,169,0.3)] active:translate-y-0"
      @click="handleTagClick(tag)"
      type="button"
    >
      {{ translateTag(tag) }}
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTagTranslation } from '../../composables/useTagTranslation'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const { translateTag } = useTagTranslation()

const handleTagClick = (tag) => {
  router.push({
    path: '/',
    query: { search: tag }
  })
}
</script>


