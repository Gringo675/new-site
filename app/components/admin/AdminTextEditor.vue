<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  fieldName: {
    type: String,
    default: 'Текст',
  },
  title: {
    type: String,
    default: 'Текст',
  },
})

const emit = defineEmits(['close'])

const value = ref(props.modelValue)

const onSave = () => {
  emit('close', value.value)
}

const onCancel = () => {
  emit('close', undefined)
}

defineShortcuts({
  escape: {
    handler: onCancel,
  },
})
</script>

<template>
  <UModal
    :title="props.title"
    :dismissible="false"
    :ui="{
      content: 'max-w-xl',
      body: 'sm:p-4',
    }">
    <template #body>
      <UTextarea
        v-if="['description', 'characteristics'].includes(props.fieldName)"
        v-model.lazy="value"
        autofocus
        class="w-full"
        :rows="10"
        @keydown.escape="onCancel" />
      <UInput
        v-else
        v-model="value"
        autofocus
        class="w-full"
        @keydown.escape="onCancel"
        @keydown.enter="onSave" />
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-x-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="neutral"
          @click="onCancel" />
        <UButton
          label="Сохранить"
          variant="subtle"
          color="neutral"
          class="px-8"
          @click="onSave" />
      </div>
    </template>
  </UModal>
</template>
