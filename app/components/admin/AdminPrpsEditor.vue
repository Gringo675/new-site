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

const filter = ref('')
const filteredPrps = computed(() => {
  if (!filter.value) return props.pGroup.map(item => ({ ...item, filtered: true }))
  return props.pGroup.filter(item => item.name.toLowerCase().includes(filter.value.toLowerCase()))
})

// d&d start
const propsWrapper = useTemplateRef('propsWrapper')
onMounted(() => {
  // закрепляем высоту формы, чтобы не было скачков при фильтрации
  // propsWrapper.value.style.height = `${propsWrapper.value.scrollHeight}px`
})
const draggableElementIndex = ref(null)
const handleDragStart = ev => {
  if (ev.target.dataset?.draggable === undefined) return
  draggableElementIndex.value = Number(ev.target.parentElement.dataset.index)
  ev.dataTransfer.setDragImage(ev.target.parentElement, 290, 20)
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
</script>

<template>
  <UModal
    :title="props.pGroupName"
    :dismissible="false"
    :ui="{
      content: 'max-w-xl',
    }">
    <template #body>
      <!--  <div class="flex flex-col gap-2">
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
      </div> -->
      <div
        ref="propsWrapper"
        class="overflow-auto bg-amber-100 p-5"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragenter="handleDragEnter"
        @dragover="handleDragOver">
        <TransitionGroup name="transition-props-editor">
          <template
            v-for="(prp, i) in filteredPrps"
            :key="prp.id">
            <div
              v-if="prp.filtered"
              :data-index="i"
              :class="{ 'opacity-20': draggableElementIndex === i }"
              class="float-left m-2 flex items-center rounded-lg border border-orange-700 bg-orange-200 p-2 transition-opacity duration-300">
              <UCheckbox v-model="prp.selected" />
              <input
                type="text"
                v-model.lazy="prp.name"
                class="ml-2 w-48 rounded-xs bg-orange-100 px-1 outline-hidden" />
              <img
                @click="deleteItem(i)"
                class="ml-2 inline cursor-pointer select-none"
                src="/img/icons/trash.svg" />
              <img
                @click="addItem(i)"
                class="mx-2 inline cursor-pointer select-none"
                :class="{ 'pointer-events-none opacity-40': haveHiddenItems }"
                src="/img/icons/file-plus.svg" />
              <img
                class="inline cursor-move select-none"
                :class="{ 'pointer-events-none opacity-40': haveHiddenItems }"
                src="/img/icons/arrows-move.svg"
                data-draggable />
            </div>
          </template>
        </TransitionGroup>
      </div>
    </template>
  </UModal>
</template>
