<template>
  <div v-if="trip" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-1000 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-(--color-card-bg) rounded-xl p-8 md:p-6 sm:p-4 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" @click.stop>
      <h3 class="m-0 mb-4 text-2xl md:text-xl font-semibold text-(--color-text)">{{ $t('trip.deleteConfirm') }}</h3>
      <p class="m-0 mb-6 text-gray-6 dark:text-(--color-text-secondary)">{{ $t('trip.deleteConfirmMessage') }}</p>
      <p class="m-0 mb-6 text-gray-6 dark:text-(--color-text-secondary)"><strong>"{{ trip.title }}"</strong></p>
      <div class="flex gap-4 justify-end">
        <button @click="$emit('close')" class="btn btn-secondary">{{ $t('trip.cancel') }}</button>
        <button @click="$emit('confirm')" class="btn bg-red-4 hover:bg-red-5 text-white border-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="deleting">
          {{ deleting ? $t('trip.deleting') : $t('trip.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trip: {
    type: Object,
    default: null
  },
  deleting: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])
</script>


