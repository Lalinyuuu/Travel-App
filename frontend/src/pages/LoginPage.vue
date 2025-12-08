<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <nav class="bg-(--color-navbar-bg) shadow-md dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)] py-4 transition-colors duration-300">
      <div class="container">
        <div class="flex justify-between items-center">
          <router-link to="/" class="text-primary no-underline transition-colors duration-300">
            <h1 class="text-2xl font-bold m-0">Travel Explorer</h1>
          </router-link>
          <div class="flex gap-4">
            <button 
              @click="toggleLanguage" 
              class="bg-transparent border-2 border-(--color-text-secondary) text-(--color-text-secondary) rounded-lg px-3 py-2 cursor-pointer flex items-center justify-center transition-all duration-300 font-semibold text-sm min-w-12 hover:border-primary hover:text-primary hover:scale-105"
              :aria-label="$t('common.language')"
              :title="$t('common.language')"
            >
              <span>{{ currentLocale.toUpperCase() }}</span>
            </button>
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
            <router-link to="/register" class="btn btn-primary">{{ $t('nav.register') }}</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-(--color-card-bg) rounded-2xl p-8 md:p-10 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)] border border-gray-2 dark:border-gray-4 transition-all duration-300">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-(--color-text) mb-2 transition-colors duration-300">{{ $t('auth.login') }}</h2>
            <p class="text-sm text-(--color-text-secondary) transition-colors duration-300">{{ $t('auth.welcomeBack') }}</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <label for="email" class="font-semibold text-(--color-text) text-sm transition-colors duration-300">{{ $t('auth.email') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-4 dark:text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  class="w-full pl-12 pr-4 py-3.5 border border-gray-2 dark:border-gray-4 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20"
                  :class="errors.email ? 'border-red-3 focus:border-red-3 focus:ring-red-3/10' : ''"
                />
              </div>
              <span v-if="errors.email" class="text-red-3 dark:text-red-2 text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.email }}
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="font-semibold text-(--color-text) text-sm transition-colors duration-300">{{ $t('auth.password') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-4 dark:text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-12 pr-4 py-3.5 border border-gray-2 dark:border-gray-4 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20"
                  :class="errors.password ? 'border-red-3 focus:border-red-3 focus:ring-red-3/10' : ''"
                />
              </div>
              <span v-if="errors.password" class="text-red-3 dark:text-red-2 text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.password }}
              </span>
            </div>

            <div v-if="error" class="px-4 py-3 rounded-xl text-sm bg-red-1 dark:bg-red-5/30 text-red-5 dark:text-red-3 border border-red-3 dark:border-red-4 flex items-center gap-2 font-medium">
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ error }}
            </div>

            <button type="submit" class="w-full py-3.5 px-6 bg-primary text-white rounded-xl font-semibold text-base shadow-lg shadow-primary/30 dark:shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-primary/30 transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:translate-y-0" :disabled="loading">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('auth.loggingIn') }}
              </span>
              <span v-else>{{ $t('auth.loginButton') }}</span>
            </button>

            <div class="text-center mt-6 pt-6 border-t border-gray-1 dark:border-gray-4">
              <p class="text-(--color-text-secondary) text-sm transition-colors duration-300">
                {{ $t('auth.noAccount') }}
                <router-link to="/register" class="text-primary no-underline font-semibold transition-colors duration-300 hover:underline ml-1">{{ $t('auth.signUp') }}</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/auth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()

const currentLocale = computed(() => locale.value)

const toggleLanguage = () => {
  const newLocale = locale.value === 'th' ? 'en' : 'th'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const handleThemeToggle = () => {
  toggleTheme()
}

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const errors = ref({})

const handleLogin = async () => {
  error.value = ''
  errors.value = {}

  if (!email.value) {
    errors.value.email = t('auth.emailRequired')
    return
  }
  if (!password.value) {
    errors.value.password = t('auth.passwordRequired')
    return
  }

  try {
    loading.value = true
    await authService.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = t('auth.invalidCredentials')
    }
  } finally {
    loading.value = false
  }
}
</script>
