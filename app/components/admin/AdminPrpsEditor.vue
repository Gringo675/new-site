<script setup>
//
const props = defineProps({
  pGroup: Array,
  pGroupName: String,
  activeIds: Array,
  options: Object,
})
// const emit = defineEmits(['update:activeIds'])
// локальная копия
const pGroup = ref(
  JSON.parse(JSON.stringify(props.pGroup)).map(item => ({
    ...item,
    active: props.activeIds.includes(item.id),
  })),
)

const activeItems = computed(() => pGroup.value.filter(item => item.active))
const toggleActive = item => {
  if (!props.options.multiple) {
    // Single mode: deactivate all others
    pGroup.value.forEach(i => (i.active = false))
    item.active = true
  } else {
    // Multiple mode: toggle as normal
    item.active = !item.active
  }
}

const filter = ref('')
const filteredPrps = computed(() => {
  return pGroup.value.filter(item => item.name.toLowerCase().includes(filter.value.toLowerCase()))
})
const haveHiddenItems = computed(() => pGroup.value.length !== filteredPrps.value.length)

const prpsWrapper = useTemplateRef('prpsWrapper')
const fixHeight = () => {
  // закрепляем высоту формы, чтобы не было скачков при фильтрации
  if (prpsWrapper.value) {
    prpsWrapper.value.style.height = `${prpsWrapper.value.scrollHeight}px`
  }
}

// d&d start
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
      pGroup.value.splice(targetIndex, 0, pGroup.value.splice(draggableElementIndex.value, 1)[0])
      draggableElementIndex.value = targetIndex
      this.isCoolDown = true
      setTimeout(() => (this.isCoolDown = false), this.coolDownValue)
    }, this.timerValue)
  },
}
// d&d end

const addItem = index => {
  console.log(`index: ${JSON.stringify(index, null, 2)}`)
}
const deleteItem = async index => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: ``,
    isDialog: true,
  })
  // if (proceed)
}

// вешаем горячую клавишу
defineShortcuts({
  escape: {
    usingInput: 'filterInput',
    handler: () => (filter.value = ''),
  },
})
</script>

<template>
  <UModal
    :title="props.pGroupName"
    :dismissible="false"
    @after:enter="fixHeight"
    :ui="{
      content: 'max-w-xl',
    }">
    <template #description>
      <div class="m-2">
        {{ options.multiple ? 'Выбраны:' : 'Выбран:' }} {{ activeItems.map(i => i.name).join(', ') }}
      </div></template
    >
    <template #body>
      <UInput
        v-model="filter"
        autofocus
        placeholder="Filter..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />
      <div
        ref="prpsWrapper"
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
