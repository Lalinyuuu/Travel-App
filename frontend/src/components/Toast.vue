<template>
  <Teleport to="body">
    <div class="fixed top-24 right-5 md:right-5 md:left-10 md:max-w-none z-50 flex flex-col gap-3 max-w-[400px] w-full">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 p-4 rounded-lg shadow-lg animate-[slideIn_0.3s_ease-out]"
          :class="{
            'bg-green-1 dark:bg-green-2 border-l-4 border-green-4 dark:border-green-3': toast.type === 'success',
            'bg-red-1 dark:bg-red-2 border-l-4 border-red-4 dark:border-red-3': toast.type === 'error',
            'bg-yellow-1 dark:bg-yellow-2 border-l-4 border-yellow-4 dark:border-yellow-3': toast.type === 'warning',
            'bg-blue-1 dark:bg-blue-2 border-l-4 border-blue-4 dark:border-blue-3': toast.type === 'info',
            'bg-white dark:bg-gray-9': toast.type !== 'error' && toast.type !== 'success' && toast.type !== 'warning' && toast.type !== 'info'
          }"
        >
          <div class="shrink-0 flex items-center justify-center"
            :class="{
              'text-green-4 dark:text-green-3': toast.type === 'success',
              'text-red-4 dark:text-red-3': toast.type === 'error',
              'text-yellow-4 dark:text-yellow-3': toast.type === 'warning',
              'text-blue-4 dark:text-blue-3': toast.type === 'info'
            }"
          >
            <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="flex-1">
            <p class="m-0 text-sm leading-snug font-semibold"
              :class="{
                'text-green-5 dark:text-green-4': toast.type === 'success',
                'text-red-5 dark:text-red-4': toast.type === 'error',
                'text-yellow-5 dark:text-yellow-4': toast.type === 'warning',
                'text-blue-5 dark:text-blue-4': toast.type === 'info',
                'text-gray-7 dark:text-gray-2': !toast.type || (toast.type !== 'error' && toast.type !== 'success' && toast.type !== 'warning' && toast.type !== 'info')
              }"
            >{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="shrink-0 bg-transparent border-none cursor-pointer p-1 text-gray-4 dark:text-gray-3 flex items-center justify-center transition-colors duration-200 hover:text-gray-7 dark:hover:text-gray-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastIdCounter = 0

const addToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastIdCounter
  const toast = { id, message, type }
  toasts.value.push(toast)

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

onMounted(() => {
  window.toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration)
  }
})

onUnmounted(() => {
  delete window.toast
})

defineExpose({ addToast, removeToast })
</script>

<style>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

