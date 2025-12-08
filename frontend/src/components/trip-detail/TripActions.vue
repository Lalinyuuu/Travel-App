<template>
  <div v-if="isOwner" class="flex gap-4 mt-8 pt-8 border-t border-gray-2 dark:border-gray-7 flex-wrap max-md:flex-col">
    <button @click="$emit('edit')" class="btn btn-primary min-w-[120px] max-md:w-full">
      {{ $t('trip.editTrip') }}
    </button>
    <button @click="$emit('delete')" class="btn bg-red-4 hover:bg-red-5 text-white border-none min-w-[120px] max-md:w-full">
      {{ $t('trip.deleteTrip') }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  isOwner: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])
</script>


