<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <NavBar />
    
    <main class="py-8 md:py-12">
      <div class="container">
        <section class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-(--color-text) mb-2 transition-colors duration-300">{{ $t('provinces.title') }}</h1>
          <p class="text-base md:text-lg text-(--color-text-secondary) transition-colors duration-300">{{ $t('provinces.subtitle') }}</p>
        </section>

        <div class="max-w-2xl mx-auto mb-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('provinces.searchPlaceholder')"
              class="w-full px-6 pr-12 py-4 border-2 border-(--color-border) rounded-2xl text-base outline-none transition-all duration-300 bg-(--color-card-bg) text-(--color-text) shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] focus:border-primary focus:shadow-[0_0_0_2px_rgba(255,130,169,0.1)] dark:focus:shadow-[0_0_0_2px_rgba(68,109,146,0.2)]"
              @input="handleSearch"
              @focus="showSuggestions = true"
            />
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <div v-if="showSuggestions && filteredResults.length > 0" class="mt-2 bg-(--color-card-bg) rounded-xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-(--color-border) max-h-96 overflow-y-auto transition-colors duration-300">
            <button
              v-for="item in filteredResults.slice(0, 10)"
              :key="item"
              @click="selectLocation(item)"
              class="w-full px-6 py-3 text-left transition-colors duration-300 flex items-center gap-3 cursor-pointer border-none bg-transparent hover:bg-[rgba(255,130,169,0.1)]"
            >
              <svg class="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-(--color-text) transition-colors duration-300">{{ item }}</span>
            </button>
          </div>
        </div>

        <div class="flex gap-3 justify-center mb-8 flex-wrap">
          <button
            @click="activeTab = 'thailand'"
            class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer border-2 bg-(--color-card-bg) text-(--color-text-secondary) border-(--color-border) hover:border-primary"
            :class="activeTab === 'thailand' ? 'bg-primary text-white shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border-primary' : ''"
          >
            {{ $t('provinces.thailand') }}
          </button>
          <button
            @click="activeTab = 'international'"
            class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer border-2 bg-(--color-card-bg) text-(--color-text-secondary) border-(--color-border) hover:border-primary"
            :class="activeTab === 'international' ? 'bg-primary text-white shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border-primary' : ''"
          >
            {{ $t('provinces.international') }}
          </button>
        </div>

        <section class="mt-6">
          <div v-if="activeTab === 'thailand'">
            <div v-if="searchQuery" class="mb-6">
              <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ $t('provinces.searchResults', { count: filteredProvinces.length }) }}</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                <button
                  v-for="province in filteredProvinces"
                  :key="province"
                  @click="selectLocation(province)"
                  class="bg-(--color-card-bg) border-2 border-(--color-border) rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]"
                >
                  <h3 class="text-sm md:text-base font-medium text-(--color-text) leading-normal transition-colors duration-300">{{ province }}</h3>
                </button>
              </div>
            </div>

            <div v-else>
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ $t('provinces.popularDestinations') }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                  <button
                    v-for="province in popularProvinces"
                    :key="province"
                    @click="selectLocation(province)"
                    class="bg-linear-to-br from-primary to-secondary text-white border-none rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {{ province }}
                  </button>
                </div>
              </div>

              <div v-for="(group, regionName) in regionGroups" :key="regionName" class="mb-8">
                <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ regionName }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                  <button
                    v-for="province in group"
                    :key="province"
                    @click="selectLocation(province)"
                    class="bg-(--color-card-bg) border-2 border-(--color-border) rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]"
                  >
                    <h3 class="text-sm md:text-base font-medium text-(--color-text) leading-normal transition-colors duration-300">{{ province }}</h3>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div v-if="searchQuery" class="mb-6">
              <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ $t('provinces.searchResults', { count: filteredCountries.length }) }}</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                <button
                  v-for="country in filteredCountries"
                  :key="country"
                  @click="selectLocation(country)"
                  class="bg-(--color-card-bg) border-2 border-secondary rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:border-secondary hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]"
                >
                  <h3 class="text-sm md:text-base font-medium text-(--color-text) leading-normal transition-colors duration-300">{{ country }}</h3>
                </button>
              </div>
            </div>

            <div v-else>
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ $t('provinces.popularCountries') }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                  <button
                    v-for="country in popularCountries"
                    :key="country"
                    @click="selectLocation(country)"
                    class="bg-linear-to-br from-primary to-secondary text-white border-none rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {{ country }}
                  </button>
                </div>
              </div>

              <div class="mb-8">
                <h2 class="text-xl font-semibold text-(--color-text) mb-4 transition-colors duration-300">{{ $t('provinces.allCountries') }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                  <button
                    v-for="country in countries"
                    :key="country"
                    @click="selectLocation(country)"
                    class="bg-(--color-card-bg) border-2 border-secondary rounded-xl p-4 md:p-5 text-center cursor-pointer transition-all duration-300 hover:border-secondary hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]"
                  >
                    <h3 class="text-sm md:text-base font-medium text-(--color-text) leading-normal transition-colors duration-300">{{ country }}</h3>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const { tm } = useI18n()
const activeTab = ref('thailand')
const searchQuery = ref('')
const showSuggestions = ref(false)

const provinces = computed(() => {
  const list = tm('provinces.provinceList')
  return Array.isArray(list) ? list : []
})

const popularProvinces = computed(() => {
  const list = tm('provinces.popularProvinces')
  return Array.isArray(list) ? list : []
})

const regionGroups = computed(() => {
  const regions = tm('provinces.regions')
  const groups = tm('provinces.regionGroups')
  if (!regions || typeof regions !== 'object' || !groups || typeof groups !== 'object') {
    return {}
  }
  return {
    [regions.north]: Array.isArray(groups.north) ? groups.north : [],
    [regions.central]: Array.isArray(groups.central) ? groups.central : [],
    [regions.east]: Array.isArray(groups.east) ? groups.east : [],
    [regions.northeast]: Array.isArray(groups.northeast) ? groups.northeast : [],
    [regions.south]: Array.isArray(groups.south) ? groups.south : []
  }
})

const countries = computed(() => {
  const list = tm('provinces.countryList')
  return Array.isArray(list) ? list : []
})

const popularCountries = computed(() => {
  const list = tm('provinces.popularCountriesList')
  return Array.isArray(list) ? list : []
})

const filteredProvinces = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return provinces.filter(p => p.includes(query) || p.toLowerCase().includes(query))
})

const filteredCountries = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return countries.filter(c => c.includes(query) || c.toLowerCase().includes(query))
})

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  if (activeTab.value === 'thailand') {
    return filteredProvinces.value
  } else {
    return filteredCountries.value
  }
})

const handleSearch = () => {
  showSuggestions.value = searchQuery.value.length > 0
}

const selectLocation = (location) => {
  searchQuery.value = ''
  showSuggestions.value = false
  router.push({
    path: '/',
    query: { search: location }
  })
}
</script>
