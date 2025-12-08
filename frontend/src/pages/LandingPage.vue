<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <NavBar />
    <HeroSection />
    <ServiceCards />
    
    <main class="py-8">
      <div class="container">
        <section class="text-center mb-12 py-8">
          <h2 class="text-3xl md:text-4xl font-bold text-secondary mb-6 transition-colors duration-300">{{ $t('landing.searchTitle') }}</h2>
          <div class="flex flex-col md:flex-row items-center gap-4 max-w-2xl mx-auto">
            <div class="flex-1 relative w-full">
              <input
                type="text"
                v-model="displaySearchQuery"
                :placeholder="$t('landing.searchPlaceholder')"
                class="w-full px-4 pr-10 py-3 border-2 border-(--color-border) rounded-xl text-base outline-none transition-all duration-300 bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:shadow-[0_0_0_2px_rgba(255,130,169,0.1)] dark:focus:shadow-[0_0_0_2px_rgba(68,109,146,0.2)]"
                @keyup.enter="handleSearch"
                @input="handleSearchInput"
              />
              <button
                v-if="displaySearchQuery"
                @click="clearSearch"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-6 hover:text-primary transition-colors duration-300"
                :title="$t('landing.clearSearch')"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button @click="handleSearch" class="btn btn-primary whitespace-nowrap px-6 py-3 rounded-xl font-semibold">{{ $t('landing.search') }}</button>
          </div>
        </section>

        <section>
          <div v-if="loading" class="text-center py-16 text-(--color-text-secondary)">
            <p>{{ $t('landing.loading') }}</p>
          </div>

          <div v-else-if="!loading && trips.length === 0" class="flex justify-center items-center min-h-[400px] py-16">
            <div class="text-center text-(--color-text-secondary)">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-6 opacity-50">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <h3 v-if="displaySearchQuery" class="text-2xl mb-2 text-(--color-text)">{{ $t('landing.noTripsFound') }}</h3>
              <p v-if="displaySearchQuery" class="text-base">{{ $t('landing.noTripsFoundDesc') }}</p>
              <p v-else class="text-base">{{ $t('landing.beFirstToShare') }}</p>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div
              v-for="trip in trips"
              :key="trip.id"
              class="bg-(--color-card-bg) rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col relative cursor-pointer border border-(--color-border) hover:-translate-y-1 hover:shadow-xl dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]"
              @click="goToTripDetail(trip.id)"
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
                  <span v-if="trip.province" class="text-sm text-white bg-(--color-province-tag) px-3 py-1 rounded-xl whitespace-nowrap shrink-0 font-medium transition-colors duration-300">{{ translateTag(trip.province) }}</span>
                </div>
                <p v-if="trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at" class="text-xs text-gray-4 my-2">
                  {{ $t('landing.updated') }}: {{ formatDate(trip.updatedAt || trip.updated_at || trip.createdAt || trip.created_at) }}
                </p>
                <p class="text-sm text-(--color-text-secondary) mb-4 line-clamp-3 flex-1 min-h-18 leading-relaxed">{{ trip.shortDescription }}</p>
                <div class="mt-auto flex flex-col gap-4 shrink-0">
                  <div class="h-[120px] overflow-y-auto" v-if="trip.tags && trip.tags.length > 0">
                    <div class="flex flex-wrap items-start gap-2">
                      <span
                        v-for="(tag, index) in trip.tags"
                        :key="index"
                        class="text-xs text-white bg-secondary px-3 py-1 rounded-lg border border-(--color-border) cursor-pointer transition-all duration-300 inline-block hover:bg-[#6b85c4] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(127,149,209,0.3)]"
                        @click.stop="handleTagClick(tag)"
                      >
                        {{ translateTag(tag) }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="h-[120px]"></div>
                  <div class="flex justify-end">
                    <router-link
                      :to="`/trips/${trip.id}`"
                      class="text-center bg-primary text-white border-none px-6 py-2.5 rounded-lg font-medium transition-all duration-300 no-underline hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(255,130,169,0.3)] dark:hover:shadow-[0_10px_15px_-3px_rgba(68,109,146,0.4)]"
                      @click.stop
                    >
                      {{ $t('landing.viewDetail') }}
                    </router-link>
                  </div>
                </div>
              </div>
              <button class="absolute right-4 top-4 bg-white/90 dark:bg-[rgba(36,73,107,0.9)] border-none cursor-pointer p-2 text-primary flex items-center justify-center rounded-full transition-all duration-300 z-10 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] hover:bg-[#FFC0BE] dark:hover:bg-secondary hover:scale-110 hover:shadow-[0_10px_15px_-3px_rgba(255,130,169,0.2)] dark:hover:shadow-[0_10px_15px_-3px_rgba(68,109,146,0.3)]" @click.stop="handleShare(trip)" :title="$t('landing.shareLink')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="!loading && trips.length > 0" class="text-center py-8">
            <button
              v-if="hasMore"
              @click="loadMore"
              class="btn btn-primary px-8 py-3 text-base rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="loadingMore"
            >
              {{ loadingMore ? $t('landing.loadingMore') : $t('landing.loadMore') }}
            </button>
            <div v-if="!hasMore && trips.length > 0" class="text-(--color-text-secondary) text-sm mt-4">
              <p>{{ $t('landing.showing', { count: trips.length, total: totalElements }) }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import ServiceCards from '../components/ServiceCards.vue'
import { useLanding } from '../composables/useLanding'
import { useDateFormat } from '../composables/useDateFormat'
import { useTagTranslation } from '../composables/useTagTranslation'

const { t } = useI18n()
const { formatDate } = useDateFormat()
const { translateTag } = useTagTranslation()

const {
  trips,
  loading,
  loadingMore,
  hasMore,
  totalElements,
  displaySearchQuery,
  updateSearchQuery,
  handleSearch,
  handleSearchInput,
  clearSearch,
  handleTagClick,
  handleShare,
  handleImageError,
  goToTripDetail,
  loadMore,
  init
} = useLanding()

onMounted(() => {
  init()
})
</script>
