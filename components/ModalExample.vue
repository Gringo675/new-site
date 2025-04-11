<script setup>
const props = defineProps({
  count: Number,
})

const emit = defineEmits({ close: Boolean })
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', true) }"
    :dismissible="false"
    :title="`This modal was opened programmatically ${count} times`"
  >
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Dismiss"
          @click="emit('close', false)"
        />
        <UButton
          label="Success"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
