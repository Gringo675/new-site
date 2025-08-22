<script setup>
const props = defineProps({
  title: String,
  description: String,
  type: String,
  isDialog: Boolean,
})

const emit = defineEmits(['close'])

const headerCss = {
  info: 'bg-orange-100',
  error: 'bg-red-200',
  success: 'bg-green-100',
}
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :close="!isDialog"
    :dismissible="!isDialog"
    :ui="{ header: headerCss[type] }"
  >
    <template
      #footer
      v-if="isDialog"
    >
      <div class="flex w-full justify-end gap-4">
        <UButton
          color="neutral"
          variant="outline"
          label="Отмена"
          @click="emit('close', false)"
        />
        <UButton
          color="success"
          variant="outline"
          class="px-7"
          label="ОК"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
