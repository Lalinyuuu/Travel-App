<template>
  <section class="relative w-full mb-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[500px] min-h-[500px] max-h-[500px] rounded-2xl overflow-hidden shadow-xl max-md:h-auto max-md:min-h-[400px] max-md:max-h-none max-md:rounded-none max-sm:min-h-[350px]">
      <div class="relative overflow-hidden bg-(--color-background-light) h-[500px] min-h-[500px] max-h-[500px] flex flex-col shrink-0 max-md:h-[300px] max-md:min-h-[300px] max-md:max-h-[300px] max-sm:h-[250px] max-sm:min-h-[250px] max-sm:max-h-[250px]">
        <div class="w-full h-[500px] min-h-[500px] max-h-[500px] relative shrink-0 overflow-hidden aspect-video max-md:min-h-[300px] max-md:max-h-[300px] max-sm:min-h-[250px] max-sm:max-h-[250px]">
          <img
            v-if="currentSlide.image"
            :src="currentSlide.image"
            :alt="currentSlide.title"
            class="w-full h-full min-h-[500px] max-h-[500px] object-cover object-center block transition-transform duration-500 shrink-0 hover:scale-105 max-md:min-h-[300px] max-md:max-h-[300px] max-sm:min-h-[250px] max-sm:max-h-[250px]"
            loading="eager"
            decoding="async"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <div v-if="heroImageLoading" class="absolute inset-0 w-full h-[500px] min-h-[500px] max-h-[500px] flex items-center justify-center bg-[rgba(254,239,198,0.9)] dark:bg-[rgba(36,73,107,0.9)] z-20 shrink-0 max-md:min-h-[300px] max-md:max-h-[300px] max-sm:min-h-[250px] max-sm:max-h-[250px]">
            <div class="w-12 h-12 border-[5px] border-[rgba(255,130,169,0.2)] dark:border-[rgba(68,109,146,0.2)] border-t-primary dark:border-t-primary rounded-full animate-spin"></div>
          </div>
          <div v-if="!currentSlide.image && !heroImageLoading" class="w-full h-[500px] min-h-[500px] max-h-[500px] flex items-center justify-center text-[rgba(255,130,169,0.3)] dark:text-[rgba(68,109,146,0.5)] bg-(--color-background-light) shrink-0 max-md:min-h-[300px] max-md:max-h-[300px] max-sm:min-h-[250px] max-sm:max-h-[250px]">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
        <div class="flex justify-center gap-2 p-4 absolute bottom-0 left-0 right-0 z-15 bg-linear-to-t from-black/30 to-transparent">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full border-2 bg-transparent cursor-pointer transition-all duration-300 p-0 relative z-20"
            :class="currentIndex === index ? 'bg-primary border-primary w-8 rounded-md' : 'border-gray-6 dark:border-gray-3'"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
        <button @click="previousSlide" class="absolute top-1/2 -translate-y-1/2 left-5 dark:bg-[rgba(36,73,107,0.9)] border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 z-20 text-(--color-text) shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:-translate-y-1/2 hover:scale-110 hover:shadow-xl" :style="!isDark ? { backgroundColor: 'rgba(254, 239, 198, 0.9)' } : {}" :class="!isDark ? 'hover:bg-[#FEEFC6]' : 'hover:bg-white'" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="relative bg-(--color-background-light) p-12 flex flex-col justify-center h-[500px] min-h-[500px] max-h-[500px] z-10 transition-colors duration-300 max-md:p-10 max-md:px-6 max-md:mt-[-20px] max-md:rounded-t-[20px] max-md:h-auto max-md:min-h-auto max-md:max-h-none max-sm:p-8 max-sm:px-4 max-sm:mt-[-15px] max-sm:rounded-t-2xl">
        <div class="relative z-20 p-6 rounded-xl backdrop-blur-sm text-center dark:bg-[rgba(36,73,107,0.95)]" :style="!isDark ? { backgroundColor: '#FEEFC6' } : {}">
          <h1 class="m-0 mb-6 leading-tight">
            <span class="block text-4xl lg:text-5xl font-light dark:text-white mb-2 drop-shadow-sm transition-colors duration-300" :style="!isDark ? { color: '#24496b' } : {}">{{ currentSlide.titlePrefix }}</span>
            <span class="block text-5xl lg:text-6xl font-bold text-primary tracking-tight drop-shadow-sm transition-colors duration-300" :style="isDark ? { color: '#FEEFC6' } : {}">{{ currentSlide.titleBold }}</span>
          </h1>
          <p class="text-lg dark:text-white leading-relaxed mb-8 max-w-[500px] mx-auto font-medium drop-shadow-sm transition-colors duration-300" :style="!isDark ? { color: '#24496b' } : {}">{{ currentSlide.description }}</p>
          <button @click="handleCtaClick" class="bg-primary text-white border-none px-10 py-4 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-[0_10px_15px_-3px_rgba(255,130,169,0.3)] dark:shadow-[0_10px_15px_-3px_rgba(68,109,146,0.4)] relative z-20 mx-auto hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_20px_25px_-5px_rgba(255,130,169,0.4)] dark:hover:shadow-[0_20px_25px_-5px_rgba(68,109,146,0.5)]">
            {{ currentSlide.ctaText || 'ดูเพิ่มเติม' }}
          </button>
        </div>
        <button @click="nextSlide" class="absolute top-1/2 -translate-y-1/2 right-5 dark:bg-[rgba(36,73,107,0.9)] border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 z-20 text-(--color-text) shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:-translate-y-1/2 hover:scale-110 hover:shadow-xl" :style="!isDark ? { backgroundColor: 'rgba(254, 239, 198, 0.9)' } : {}" :class="!isDark ? 'hover:bg-[#FEEFC6]' : 'hover:bg-white'" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { tm } = useI18n()
const { isDark } = useTheme()

const slideImages = [
  '/images/hero/landing-thai.avif',
  '/images/hero/landing-world.avif',
  '/images/hero/landing-island.jpg',
  '/images/hero/landing-culture.jpg'
]

const slideActions = [
  () => router.push('/trips'),
  () => router.push('/trips'),
  () => {
    router.push('/')
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"]')
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  },
  () => router.push('/trips')
]

const slides = computed(() => {
  const heroSlides = tm('hero.slides')
  if (!Array.isArray(heroSlides)) {
    return []
  }
  return heroSlides.map((slide, index) => ({
    image: slideImages[index],
    titlePrefix: slide.titlePrefix,
    titleBold: slide.titleBold,
    description: slide.description,
    ctaText: slide.ctaText,
    ctaAction: slideActions[index]
  }))
})

const currentIndex = ref(0)
const heroImageLoading = ref(true)
let autoSlideInterval = null

const currentSlide = computed(() => slides.value[currentIndex.value])

const handleImageLoad = () => {
  heroImageLoading.value = false
}

const handleImageError = () => {
  heroImageLoading.value = false
  console.error('Failed to load hero image:', currentSlide.value.image)
}

const preloadNextImage = () => {
  const nextIndex = (currentIndex.value + 1) % slides.value.length
  const nextSlide = slides.value[nextIndex]
  if (nextSlide && nextSlide.image) {
    const img = new Image()
    img.src = nextSlide.image
  }
}

const nextSlide = () => {
  if (slides.value.length <= 1) return
  heroImageLoading.value = true
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  preloadNextImage()
  resetAutoSlide()
}

const previousSlide = () => {
  if (slides.value.length <= 1) return
  heroImageLoading.value = true
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  preloadNextImage()
  resetAutoSlide()
}

const goToSlide = (index) => {
  if (index !== currentIndex.value && index >= 0 && index < slides.value.length) {
    heroImageLoading.value = true
    currentIndex.value = index
    preloadNextImage()
    resetAutoSlide()
  }
}

const handleCtaClick = (e) => {
  e.stopPropagation()
  if (currentSlide.value.ctaAction) {
    currentSlide.value.ctaAction()
  }
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

const resetAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
  startAutoSlide()
}

onMounted(() => {
  if (slides.value[0] && slides.value[0].image) {
    const img = new Image()
    img.src = slides.value[0].image
    img.onload = () => {
      heroImageLoading.value = false
    }
  }
  preloadNextImage()
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})
</script>

