<script setup>
//
const props = defineProps({
  pGroup: Array,
  pGroupName: String,
  activeIds: Array,
  options: Object,
})
const emit = defineEmits(['update:activeIds'])

const addItem = () => {}
const deleteItem = async () => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: ``,
    isDialog: true,
  })
  // if (proceed)
}

const dropdownMenu = [
  {
    label: 'Добавить ниже',
    icon: 'i-heroicons-plus',
    onClick: () => addItem(),
  },
  {
    label: 'Удалить',
    color: 'error',
    variant: 'ghost',
    size: 'sm',
    icon: 'i-heroicons-trash',
    onClick: () => deleteItem(),
  },
]
</script>

<template>
  <UModal
    :title="props.pGroupName"
    :dismissible="false"
    :ui="{
      content: 'max-w-xl',
    }">
    <template #body>
      <div class="flex flex-col gap-2">
        <div
          v-for="(prp, i) in props.pGroup"
          :key="prp.id"
          class="flex">
          <UInput
            v-model.lazy="prp.name"
            placeholder="Введите значение"
            class="w-full" />
          <UDropdownMenu
            :items="dropdownMenu"
            :ui="{ content: 'w-48' }">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-ellipsis-vertical" />
          </UDropdownMenu>
        </div>
      </div>
    </template>
  </UModal>
</template>
