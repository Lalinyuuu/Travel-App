<template>
  <section class="mb-10 mt-6">
    <h2 class="text-3xl md:text-4xl font-bold text-(--color-text) mb-6 transition-colors duration-300">{{ $t('allTrips.title') }}</h2>
    <div class="flex flex-col md:flex-row items-stretch gap-4 max-w-3xl">
      <div class="flex-1 relative">
        <input
          type="text"
          :model-value="displayValue"
          @update:model-value="$emit('update:modelValue', $event)"
          :placeholder="$t('allTrips.searchPlaceholder')"
          class="w-full px-5 py-4 pr-12 border-2 border-gray-3 dark:border-gray-6 rounded-xl text-base outline-none transition-all duration-300 bg-white dark:bg-(--color-card-bg) text-(--color-text) shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:focus:shadow-[0_0_0_3px_rgba(68,109,146,0.2)]"
          @keyup.enter="$emit('search')"
          @input="$emit('input')"
        />
        <button
          v-if="displayValue"
          @click="$emit('clear')"
          class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-2 flex items-center justify-center text-gray-4 dark:text-gray-3 hover:text-primary dark:hover:text-primary transition-colors duration-200"
          :title="$t('allTrips.clearSearch')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <button @click="$emit('search')" class="btn btn-primary px-8 py-4 text-base rounded-xl font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300">{{ $t('allTrips.search') }}</button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  displayValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'search', 'clear', 'input'])
</script>

