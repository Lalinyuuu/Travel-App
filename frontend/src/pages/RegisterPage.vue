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
            <router-link to="/login" class="btn btn-secondary">{{ $t('nav.login') }}</router-link>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-(--color-text) mb-2 transition-colors duration-300">{{ $t('auth.register') }}</h2>
            <p class="text-sm text-(--color-text-secondary) transition-colors duration-300">สร้างบัญชีใหม่เพื่อเริ่มต้นการเดินทาง</p>
          </div>
          
          <form @submit.prevent="handleRegister" novalidate class="flex flex-col gap-5">
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
                  placeholder="your@email.com"
                  class="w-full pl-12 pr-4 py-3.5 border border-gray-2 dark:border-gray-4 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20"
                  :class="errors.email ? 'border-red-3 focus:border-red-3 focus:ring-red-3/10' : ''"
                />
              </div>
              <span v-if="errors.email" class="text-red-5 dark:text-red-3 text-sm flex items-center gap-1 font-semibold">
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
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.password')"
                  class="w-full pl-12 pr-12 py-3.5 border border-gray-2 dark:border-gray-4 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20"
                  :class="errors.password ? 'border-red-3 focus:border-red-3 focus:ring-red-3/10' : ''"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-5 dark:text-gray-4 hover:text-gray-7 dark:hover:text-gray-2 transition-colors duration-300"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L9.88 9.88m-3.29-3.29l3.29 3.29M12 12l.878.878M12 12l-.878-.878m0 0L9.88 9.88m1.242 1.242L12 12" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="text-red-5 dark:text-red-3 text-sm flex items-center gap-1 font-semibold">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.password }}
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <label for="confirmPassword" class="font-semibold text-(--color-text) text-sm transition-colors duration-300">{{ $t('auth.confirmPassword') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-4 dark:text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-12 py-3.5 border border-gray-2 dark:border-gray-4 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) focus:border-primary focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20"
                  :class="errors.confirmPassword ? 'border-red-3 focus:border-red-3 focus:ring-red-3/10' : ''"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-5 dark:text-gray-4 hover:text-gray-7 dark:hover:text-gray-2 transition-colors duration-300"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L9.88 9.88m-3.29-3.29l3.29 3.29M12 12l.878.878M12 12l-.878-.878m0 0L9.88 9.88m1.242 1.242L12 12" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="text-red-5 dark:text-red-3 text-sm flex items-center gap-1 font-semibold">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.confirmPassword }}
              </span>
            </div>

            <div v-if="error" class="px-4 py-3 rounded-xl text-sm bg-red-1 dark:bg-red-5/30 text-red-5 dark:text-red-3 border border-red-4 dark:border-red-4 flex items-center gap-2 font-semibold">
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ error }}
            </div>

            <div v-if="success" class="px-4 py-3 rounded-xl text-sm bg-green-2 dark:bg-green-5/40 text-green-5 dark:text-green-5 border border-green-4 dark:border-green-4 flex items-center gap-2 font-semibold">
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ success }}
            </div>

            <button type="submit" class="w-full py-3.5 px-6 bg-primary text-white rounded-xl font-semibold text-base shadow-lg shadow-primary/30 dark:shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-primary/30 transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:translate-y-0" :disabled="loading">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('auth.registering') }}
              </span>
              <span v-else>{{ $t('auth.registerButton') }}</span>
            </button>

            <div class="text-center mt-6 pt-6 border-t border-gray-1 dark:border-gray-4">
              <p class="text-(--color-text-secondary) text-sm transition-colors duration-300">
                {{ $t('auth.haveAccount') }}
                <router-link to="/login" class="text-primary no-underline font-semibold transition-colors duration-300 hover:underline ml-1">{{ $t('auth.signIn') }}</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/auth'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const toast = useToast()

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
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const errors = ref({})
const checkingEmail = ref(false)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Watch for email changes and check if it exists (with debounce)
let emailCheckTimeout = null
watch(email, async (newEmail) => {
  // Clear previous timeout
  if (emailCheckTimeout) {
    clearTimeout(emailCheckTimeout)
  }

  // Clear email error if email is empty
  if (!newEmail || newEmail.trim() === '') {
    if (errors.value.email && errors.value.email.includes('already exists')) {
      delete errors.value.email
    }
    return
  }

  // Only check if email format is valid
  if (!emailRegex.test(newEmail)) {
    return
  }

  // Debounce: wait 500ms after user stops typing
  emailCheckTimeout = setTimeout(async () => {
    try {
      checkingEmail.value = true
      const exists = await authService.checkEmailExists(newEmail)
      if (exists) {
        errors.value.email = 'Email already exists. Please use a different email.'
      } else {
        // Clear email exists error if email is available
        if (errors.value.email && errors.value.email.includes('already exists')) {
          delete errors.value.email
        }
      }
    } catch (err) {
      console.error('Error checking email:', err)
      // Don't show error if check fails, just log it
    } finally {
      checkingEmail.value = false
    }
  }, 500)
})

// Watch for password mismatch in real-time
watch([password, confirmPassword], () => {
  if (confirmPassword.value && password.value && password.value !== confirmPassword.value) {
    errors.value.confirmPassword = t('auth.passwordsNotMatch')
  } else if (confirmPassword.value && password.value && password.value === confirmPassword.value) {
    // Clear error if passwords match
    if (errors.value.confirmPassword === t('auth.passwordsNotMatch')) {
      delete errors.value.confirmPassword
    }
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = t('auth.emailRequired')
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = t('auth.emailRequired')
    return false
  }

  if (!password.value) {
    errors.value.password = t('auth.passwordRequired')
    return false
  }
  
  if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
    return false
  }

  // Password strength validation (matching backend requirements)
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasDigit = /[0-9]/.test(password.value)
  
  if (!hasUpperCase || !hasLowerCase || !hasDigit) {
    errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
    return false
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = t('auth.confirmPasswordRequired')
    return false
  }

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = t('auth.passwordsNotMatch')
    return false
  }

  return true
}

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  errors.value = {}
  
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    await authService.register(email.value, password.value)
    success.value = 'Account created successfully. Please log in.'
    
    toast.success(t('auth.register') + ' ' + t('auth.signIn'))
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('Registration error details:', err)
    console.error('Error response:', err.response)
    console.error('Error response data:', err.response?.data)
    
    // Extract error message from response
    let errorMessage = ''
    if (err.response?.data) {
      // Handle different response formats
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data
      } else if (err.response.data.error) {
        errorMessage = err.response.data.error
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message
      } else {
        // Try to get first error from validation errors object
        const errorKeys = Object.keys(err.response.data)
        if (errorKeys.length > 0) {
          errorMessage = err.response.data[errorKeys[0]]
        }
      }
    }
    
    // Fallback to axios error message
    if (!errorMessage) {
      errorMessage = err.message || t('auth.register') + ' error'
    }
    
    console.log('Extracted error message:', errorMessage)
    
    // Route error to appropriate field or general error
    if (err.response?.status === 400) {
      const lowerMessage = errorMessage.toLowerCase()
      console.log('Checking error message for email:', lowerMessage)
      // Check for email-related errors (more comprehensive check)
      if (lowerMessage.includes('email') || 
          lowerMessage.includes('already') || 
          lowerMessage.includes('exists') ||
          lowerMessage.includes('duplicate') ||
          lowerMessage.includes('use a different')) {
        console.log('Setting email error:', errorMessage)
        errors.value.email = errorMessage
        error.value = ''
      } else if (lowerMessage.includes('password')) {
        errors.value.password = errorMessage
        error.value = ''
      } else {
        error.value = errorMessage
      }
    } else {
      // Also check for email errors even if status is not 400
      const lowerMessage = errorMessage.toLowerCase()
      if (lowerMessage.includes('email') || 
          lowerMessage.includes('already') || 
          lowerMessage.includes('exists') ||
          lowerMessage.includes('duplicate') ||
          lowerMessage.includes('use a different')) {
        errors.value.email = errorMessage
        error.value = ''
      } else {
        error.value = errorMessage
      }
    }
    
    console.log('Final errors object:', errors.value)
    console.log('Final error value:', error.value)
    
    const displayError = error.value || errors.value.email || errors.value.password || t('auth.register') + ' error'
    toast.error(displayError)
  } finally {
    loading.value = false
  }
}
</script>
