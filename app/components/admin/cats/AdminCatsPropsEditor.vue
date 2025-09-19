<script setup>
import propsEditor from '~/composables/admin/cats/propsEditor'
import catsG from '~/composables/admin/cats/catsG'
import propsG from '~/composables/admin/cats/propsG'
import catFields from '~/composables/admin/cats/catFields'

const cat = catsG.getCat(propsEditor.indexes)
const pGroup = ref(JSON.parse(JSON.stringify(propsG.items[propsEditor.groupName]))) // локальная копия
const { groupID, nameRU: groupNameRU } = catFields.find(field => field.name === propsEditor.groupName)

const catSelectedIds = cat[propsEditor.groupName]?.split(',').map(Number) ?? []
for (const item of pGroup.value) {
  item.selected = catSelectedIds.includes(item.id)
  item.filtered = true
}

const filter = ref('')
watch(filter, () => {
  for (const item of pGroup.value) {
    item.filtered = item.name.toLowerCase().includes(filter.value.toLowerCase())
  }
})

// закрепляем высоту формы, чтобы не было скачков при фильтрации
const propsWrapper = ref(null)
onMounted(() => {
  propsWrapper.value.style.height = `${propsWrapper.value.scrollHeight}px`
})
// вешаем горячую клавишу
defineShortcuts({
  escape: {
    usingInput: 'filterInput',
    handler: () => (filter.value = ''),
  },
})

const haveHiddenItems = computed(() => pGroup.value.some(item => item.filtered === false))

const editorSelected = computed(() => pGroup.value.filter(item => item.selected))

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

const deleteItem = async i => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: `<p>Параметр "${pGroup.value[i].name}" будет помечен на удаление. Окончательное удаление произойдет после принятия изменений в форме.</p><p>Продолжить?</p>`,
    isDialog: true,
  })
  if (proceed) pGroup.value.splice(i, 1)
}

const addItem = i => {
  const newItem = {
    group_id: groupID,
    name: '',
    filtered: true,
    selected: false,
    id: Math.floor(Math.random() * -10000), // random 4-digit negative number
  }
  pGroup.value.splice(i + 1, 0, newItem)
}

const handleOK = async () => {
  // проверяем пустые значения name
  if (pGroup.value.some(item => item.name === '')) {
    showMessage({
      type: 'error',
      title: 'Действие отменено',
      description: 'Не все имена параметров заполнены!',
    })
    return
  }

  const changesSaved = await propsG.handleChanges(propsEditor.groupName, pGroup.value)
  if (!changesSaved) {
    showNotice({ title: 'Ошибка при сохранении изменений!', type: 'error' })
    return
  }
  // для добавленных значений (с id < 0) нужно найти реальный id (актуальные значения уже есть в propsG.items)
  const selectedString = editorSelected.value
    .map(item => (item.id > 0 ? item.id : propsG.items[propsEditor.groupName].find(i => i.name === item.name).id))
    .join(',')
  if (selectedString !== cat[propsEditor.groupName]) {
    cat[propsEditor.groupName] = selectedString
    catsG.handleChanges(cat.id, propsEditor.groupName, selectedString)
  }
  propsEditor.hide()
}
</script>

<template>
  <HelperModalWrapper>
    <div
      class="modal-form flex max-h-[95%] w-96 max-w-[95%] flex-col justify-start overflow-auto rounded-xl border border-amber-900">
      <div class="flex flex-row items-center justify-between bg-orange-300 p-2.5">
        <div class="size max-w-full overflow-hidden text-xl text-ellipsis whitespace-nowrap">
          {{ groupNameRU }}
        </div>

        <button
          @click="propsEditor.hide"
          class="inline-flex opacity-70 hover:opacity-100 focus:outline-hidden focus-visible:outline-0">
          <UIcon
            name="i-heroicons-x-circle"
            class="h-8 w-8" />
        </button>
      </div>
      <div class="bg-lime-200">
        <div class="relative m-2">
          <UInput
            v-model="filter"
            name="filterInput"
            autofocus
            icon="i-heroicons-magnifying-glass-20-solid"
            color="white"
            :trailing="false"
            placeholder="Фильтр..."
            class="m-2" />
          <UButton
            v-show="filter.length > 0"
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-x-circle"
            @click="filter = ''"
            class="absolute top-1.5 right-4" />
        </div>

        <div class="m-2">
          Выбраны: {{ editorSelected.length ? editorSelected.map(item => item.name).join(', ') : 'нет' }}
        </div>
      </div>
      <div
        ref="propsWrapper"
        class="overflow-auto bg-amber-100 p-5"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragenter="handleDragEnter"
        @dragover="handleDragOver">
        <TransitionGroup name="transition-props-editor">
          <template
            v-for="(item, i) in pGroup"
            :key="item.id">
            <div
              v-if="item.filtered"
              :data-index="i"
              :class="{ 'opacity-20': draggableElementIndex === i }"
              class="float-left m-2 flex items-center rounded-lg border border-orange-700 bg-orange-200 p-2 transition-opacity duration-300">
              <UCheckbox v-model="item.selected" />
              <input
                type="text"
                v-model.lazy="item.name"
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
      <div class="flex justify-end gap-4 bg-orange-200 p-2.5">
        <UButton
          label="Отмена"
          variant="outline"
          color="secondary"
          @click="propsEditor.hide()" />
        <UButton
          label="Ok"
          color="secondary"
          class="mr-4 px-8"
          @click="handleOK" />
      </div>
    </div>
  </HelperModalWrapper>
</template>