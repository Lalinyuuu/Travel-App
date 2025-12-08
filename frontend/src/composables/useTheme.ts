import { ref, type Ref } from 'vue'
import type { Theme } from '../types'

const isDark: Ref<boolean> = ref(false)

const loadTheme = (): void => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

const applyTheme = (): void => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

if (typeof window !== 'undefined') {
  loadTheme()
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e: MediaQueryListEvent): void => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      applyTheme()
    }
  }
  mediaQuery.addEventListener('change', handleChange)
}

export function useTheme() {
  const toggleTheme = (): void => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const setTheme = (theme: Theme): void => {
    isDark.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}

