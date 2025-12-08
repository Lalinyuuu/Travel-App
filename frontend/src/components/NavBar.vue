<template>
  <nav class="bg-(--color-navbar-bg) shadow-md dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)] sticky top-0 z-50 py-4 transition-colors duration-300">
    <div class="container">
      <div class="flex justify-between items-center gap-8">
        <router-link to="/" class="text-primary no-underline transition-colors duration-300" @click="handleLogoClick">
          <h1 class="text-2xl font-bold m-0">Travel Explorer</h1>
        </router-link>
        
        <button 
          class="md:block lg:hidden bg-transparent border-none cursor-pointer p-2 z-101"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
        >
          <span class="flex flex-col gap-1 w-6 h-[18px] relative" :class="{ 'active': mobileMenuOpen }">
            <span class="block w-full h-0.5 bg-(--color-text) rounded transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''"></span>
            <span class="block w-full h-0.5 bg-(--color-text) rounded transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''"></span>
            <span class="block w-full h-0.5 bg-(--color-text) rounded transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''"></span>
          </span>
        </button>
        
        <div class="hidden lg:flex gap-8 items-center flex-1 justify-center" :class="mobileMenuOpen ? 'fixed top-[70px] left-0 right-0 bg-(--color-navbar-bg) shadow-md dark:shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex-col p-4 gap-0 -translate-y-full opacity-0 invisible transition-all duration-300 z-100 lg:translate-y-0 lg:opacity-100 lg:visible lg:static lg:flex-row lg:shadow-none' : ''">
          <router-link to="/" class="text-(--color-text-secondary) no-underline font-medium text-[0.95rem] py-2 relative transition-colors duration-300 hover:text-primary" @click="closeMobileMenu">{{ $t('nav.home') }}</router-link>
          <router-link to="/trips" class="text-(--color-text-secondary) no-underline font-medium text-[0.95rem] py-2 relative transition-colors duration-300 hover:text-primary" @click="closeMobileMenu">{{ $t('nav.allTrips') }}</router-link>
          <router-link to="/provinces" class="text-(--color-text-secondary) no-underline font-medium text-[0.95rem] py-2 relative transition-colors duration-300 hover:text-primary" @click="closeMobileMenu">{{ $t('nav.places') }}</router-link>
          <router-link to="/about" class="text-(--color-text-secondary) no-underline font-medium text-[0.95rem] py-2 relative transition-colors duration-300 hover:text-primary" @click="closeMobileMenu">{{ $t('nav.about') }}</router-link>
        </div>

        <div class="hidden lg:flex gap-4 items-center" :class="mobileMenuOpen ? 'fixed bottom-0 left-0 right-0 bg-(--color-navbar-bg) shadow-[0_-4px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_rgba(0,0,0,0.3)] p-4 flex-col gap-3 translate-y-full opacity-0 invisible transition-all duration-300 z-100 lg:translate-y-0 lg:opacity-100 lg:visible lg:static lg:flex-row lg:shadow-none' : ''">
          <div class="flex items-center">
            <button 
              @click="toggleLanguage" 
              class="bg-transparent border-2 border-(--color-text-secondary) text-(--color-text-secondary) rounded-lg px-3 py-2 cursor-pointer flex items-center justify-center transition-all duration-300 font-semibold text-sm min-w-12 hover:border-primary hover:text-primary hover:scale-105"
              :aria-label="$t('common.language')"
              :title="$t('common.language')"
            >
              <span class="block">{{ currentLocale.toUpperCase() }}</span>
            </button>
          </div>
          <button 
            @click="handleThemeToggle" 
            class="bg-transparent border-2 border-(--color-text-secondary) text-(--color-text-secondary) rounded-lg p-2 cursor-pointer flex items-center justify-center transition-all duration-300 w-10 h-10 hover:border-primary hover:text-primary hover:scale-110"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="btn btn-secondary w-full lg:w-auto" @click="closeMobileMenu">{{ $t('nav.dashboard') }}</router-link>
            <button @click="handleLogout" class="btn btn-outline w-full lg:w-auto">{{ $t('nav.logout') }}</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-secondary w-full lg:w-auto" @click="closeMobileMenu">{{ $t('nav.login') }}</router-link>
            <router-link to="/register" class="btn btn-primary w-full lg:w-auto" @click="closeMobileMenu">{{ $t('nav.register') }}</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/auth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { locale } = useI18n()
const isAuthenticated = ref(false)
const mobileMenuOpen = ref(false)
const { isDark, toggleTheme } = useTheme()

const currentLocale = computed(() => locale.value)

const toggleLanguage = () => {
  const newLocale = locale.value === 'th' ? 'en' : 'th'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  closeMobileMenu()
}

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated()
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogoClick = () => {
  closeMobileMenu()
  router.push({ path: '/', query: {} })
}

const handleThemeToggle = () => {
  toggleTheme()
  closeMobileMenu()
}

const handleLogout = async () => {
  try {
    await authService.logout()
    isAuthenticated.value = false
    mobileMenuOpen.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})

router.afterEach(() => {
  checkAuth()
})

watch(() => router.currentRoute.value.path, () => {
  checkAuth()
})
</script>

