<script setup>
//
const props = defineProps({
  pGroup: Array,
  pGroupName: String,
  activeIds: Array,
  options: Object,
})

const emit = defineEmits(['close'])
// const emit = defineEmits(['update:activeIds'])
// локальная копия
const pGroupLocal = ref(
  JSON.parse(JSON.stringify(props.pGroup)).map(item => ({
    ...item,
    active: props.activeIds.includes(item.id),
  })),
)

const activeItems = computed(() => pGroupLocal.value.filter(item => item.active))
const toggleActive = item => {
  if (!props.options.multiple) {
    // Single mode: deactivate all others
    pGroupLocal.value.forEach(i => (i.active = false))
    item.active = true
  } else {
    // Multiple mode: toggle as normal
    item.active = !item.active
  }
}

const filter = ref('')
const filteredPrps = computed(() => {
  return pGroupLocal.value.filter(item => item.name.toLowerCase().includes(filter.value.toLowerCase()))
})
const haveHiddenItems = computed(() => pGroupLocal.value.length !== filteredPrps.value.length)

//#region d&d
const draggableElementIndex = ref(null)
const handleDragStart = ev => {
  const dragHandler = ev.target.closest('[data-drag-handler]')
  if (!dragHandler) return
  if (haveHiddenItems.value)
    return showMessage({
      title: 'Есть скрытые элементы!',
      description: 'Пожалуйста, сбросьте фильтр, прежде чем перетаскивать элементы.',
    })
  const draggableElement = dragHandler.parentElement
  draggableElementIndex.value = Number(draggableElement.dataset.index)

  const rect = draggableElement.getBoundingClientRect()
  const xOffset = ev.clientX - rect.left
  const yOffset = ev.clientY - rect.top
  ev.dataTransfer.setDragImage(draggableElement, xOffset, yOffset)
}
const handleDragEnd = () => {
  draggableElementIndex.value = null
}
const handleDragEnter = ev => {
  ev.preventDefault()
  if (draggableElementIndex.value === null) return
  const currentIndex = Number(ev.target.dataset?.index)
  if (isNaN(currentIndex) || currentIndex === draggableElementIndex.value) return
  changeArrayDebounced.go(currentIndex)
}
const handleDragOver = ev => {
  if (draggableElementIndex.value === null) return
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}
const changeArrayDebounced = {
  timerValue: 500,
  coolDownValue: 500,
  timer: null,
  isCoolDown: false,
  go(targetIndex) {
    if (this.isCoolDown) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      pGroupLocal.value.splice(targetIndex, 0, pGroupLocal.value.splice(draggableElementIndex.value, 1)[0])
      draggableElementIndex.value = targetIndex
      this.isCoolDown = true
      setTimeout(() => (this.isCoolDown = false), this.coolDownValue)
    }, this.timerValue)
  },
}
//#endregion

const addItem = index => {
  const item = filteredPrps.value[index]
  const actualIndex = pGroupLocal.value.indexOf(item)
  pGroupLocal.value.splice(actualIndex + 1, 0, {
    group_id: item.group_id,
    id: `temp_${Date.now()}`,
    name: '',
    active: false,
  })
}
const deleteItem = async index => {
  const item = filteredPrps.value[index]
  const actualIndex = pGroupLocal.value.indexOf(item)
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: `Вы уверены, что хотите удалить свойство "${item.name}"?`,
    isDialog: true,
  })
  if (proceed) {
    pGroupLocal.value.splice(actualIndex, 1)
  }
}

const handleOK = async () => {
  if (pGroupLocal.value.some(item => item.name === '')) {
    showMessage({
      type: 'error',
      title: 'Действие отменено',
      description: 'Не все названия заполнены!',
    })
    return
  }

  const oldItems = props.pGroup
  const newItems = pGroupLocal.value

  newItems.forEach((item, i) => {
    item.ordering = i + 1
  })

  const changedItems = []

  newItems
    .filter(item => typeof item.id === 'string' && item.id.startsWith('temp_'))
    .forEach(item => {
      item.isNew = true
      changedItems.push(item)
    })

  oldItems.forEach(oldItem => {
    const newItem = newItems.find(newItem => newItem.id === oldItem.id)
    if (newItem === undefined) {
      oldItem.isDel = true
      changedItems.push(oldItem)
    } else {
      if (oldItem.name !== newItem.name || oldItem.ordering !== newItem.ordering) {
        newItem.isChanged = true
        changedItems.push(newItem)
      }
    }
  })

  if (changedItems.length) {
    const success = await myFetch('/api/admin/setProperties', {
      method: 'post',
      payload: changedItems,
    })
    if (!success) {
      showNotice({ title: 'Ошибка при сохранении изменений!', type: 'error' })
      return
    }
  }

  emit('close', {
    hasChanges: changedItems.length > 0,
    activeIds: activeItems.value.map(item => item.id),
  })
}
</script>

<template>
  <UModal
    :title="props.pGroupName"
    :dismissible="false"
    :ui="{
      content: 'max-w-xl h-screen',
      body: 'sm:p-4',
    }">
    <template #description>
      <div class="m-2">{{ options.multiple ? 'Выбраны:' : 'Выбран:' }} {{ activeItems.map(i => i.name).join(', ') }}</div>
    </template>
    <template #body>
      <div class="flex h-full flex-col">
        <UInput
          v-model="filter"
          autofocus
          placeholder="Filter..."
          icon="i-lucide-filter"
          class="mb-2 w-80"
          type="search" />
        <div class="grow overflow-auto">
          <div
            class="flex flex-col items-center overflow-auto p-5"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @dragenter="handleDragEnter"
            @dragover="handleDragOver">
            <TransitionGroup name="transition-props-editor">
              <div
                v-for="(prp, i) in filteredPrps"
                :key="prp.id"
                :data-index="i"
                :class="{ 'opacity-60': draggableElementIndex === i }"
                class="m-2 flex items-center gap-2 rounded-lg border border-gray-600 bg-violet-300 p-2 transition-opacity duration-300">
                <UCheckbox
                  :ui="{
                    base: 'bg-violet-200', // Unchecked state
                  }"
                  :model-value="prp.active"
                  @update:model-value="toggleActive(prp)" />
                <input
                  type="text"
                  placeholder="Укажите название свойства"
                  v-model.lazy="prp.name"
                  class="w-78 rounded-sm bg-gray-100 px-2 outline-hidden" />
                <div
                  draggable="true"
                  data-drag-handler
                  class="">
                  <UDropdownMenu
                    :items="[
                      {
                        label: 'Добавить ниже',
                        icon: 'i-heroicons-plus',
                        onClick: () => addItem(i),
                      },
                      {
                        label: 'Удалить',
                        color: 'error',
                        variant: 'ghost',
                        size: 'sm',
                        icon: 'i-heroicons-trash',
                        onClick: () => deleteItem(i),
                      },
                    ]"
                    :ui="{ content: 'w-48' }">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-ellipsis-vertical" />
                  </UDropdownMenu>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-x-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="neutral"
          @click="emit('close')" />
        <UButton
          label="Сохранить"
          variant="subtle"
          color="neutral"
          class="px-8"
          @click="handleOK" />
      </div>
    </template>
  </UModal>
</template>

<style>
.transition-props-editor-move,
.transition-props-editor-enter-active,
.transition-props-editor-leave-active {
  transition: all 300ms ease;
}
.transition-props-editor-enter-from,
.transition-props-editor-leave-to {
  opacity: 0;
  transform: scaleY(0.1);
}
/* .transition-props-editor-leave-active {
  position: absolute;
} */
</style>
