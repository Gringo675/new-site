<script setup>
import propsEditor from '~/composables/admin/cats/propsEditor'
import catsG from '~/composables/admin/cats/catsG'
import propsG from '~/composables/admin/cats/propsG'
import catFields from '~/composables/admin/cats/catFields'

const cat = catsG.getCat(propsEditor.indexes)
const pGroup = ref(JSON.parse(JSON.stringify(propsG.items[propsEditor.groupName]))) // локальная копия
const { groupID, nameRU: groupNameRU } = catFields.find(field => field.name === propsEditor.groupName)

const catSelectedIds = cat[propsEditor.groupName].split(',').map(Number)
for (const item of pGroup.value) item.selected = catSelectedIds.includes(item.id)
const editorSelected = computed(() => pGroup.value.filter(item => item.selected))

const draggableElementIndex = ref(null)
const handleDragStart = ev => {
  if (ev.target.dataset?.draggable === undefined) return
  draggableElementIndex.value = Number(ev.target.parentElement.dataset.index)
  ev.dataTransfer.setDragImage(ev.target.parentElement, 260, 20)
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
    description: `<p>Параметр "${pGroup.value[i].name}" будет удален.</p><p>Продолжить?</p>`,
    isDialog: true,
  })
  if (proceed) pGroup.value.splice(i, 1)
}

const addItem = i => {
  const newItem = {
    group_id: groupID,
    name: '',
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
  const selectedString = editorSelected.value.map(item => item.id).join(',')
  if (selectedString !== cat[propsEditor.groupName]) {
    cat[propsEditor.groupName] = selectedString
    catsG.handleChanges(cat.id, propsEditor.groupName, selectedString)
  }
  const success = await propsG.handleChanges(propsEditor.groupName, pGroup.value)
  if (success) propsEditor.hide()
}
</script>

<template>
  <HelperModalWrapper>
    <div
      class="modal-form w-96 max-w-[95%] max-h-[95%] border border-amber-900 rounded-xl overflow-auto flex flex-col justify-start"
    >
      <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5">
        <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">
          {{ groupNameRU }}
        </div>
        <button
          @click="propsEditor.hide"
          class="inline-flex opacity-70 hover:opacity-100 focus:outline-none focus-visible:outline-0"
        >
          <UIcon
            name="i-heroicons-x-circle"
            class="h-8 w-8"
          />
        </button>
      </div>
      <div class="p-2.5 bg-lime-200">
        Выбраны: {{ editorSelected.length ? editorSelected.map(item => item.name).join(', ') : 'нет' }}
      </div>
      <div
        class="p-5 overflow-auto bg-amber-100 flex flex-col items-center"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragenter="handleDragEnter"
        @dragover="handleDragOver"
      >
        <TransitionGroup name="transition-draggable-group">
          <div
            v-for="(item, i) in pGroup"
            :key="i"
            :data-index="i"
            :class="{ 'opacity-20': draggableElementIndex === i }"
            class="flex items-center bg-orange-200 border border-orange-700 rounded-lg p-2 m-2 transition-opacity duration-300"
          >
            <UCheckbox v-model="item.selected" />

            <input
              type="text"
              v-model="item.name"
              class="ml-2 px-1 rounded bg-orange-100 outline-none w-40"
            />
            <img
              @click="deleteItem(i)"
              class="inline cursor-pointer select-none ml-2"
              src="/img/trash.svg"
            />
            <img
              @click="addItem(i)"
              class="inline cursor-pointer select-none mx-2"
              src="/img/file-plus.svg"
            />
            <img
              class="inline cursor-move select-none"
              src="/img/arrows-move.svg"
              data-draggable
            />
          </div>
        </TransitionGroup>
      </div>
      <div class="p-2.5 bg-orange-200 flex justify-end gap-4">
        <UButton
          label="Отмена"
          variant="outline"
          color="secondary"
          @click="propsEditor.hide()"
        />
        <UButton
          label="Ok"
          color="secondary"
          class="px-8 mr-4"
          @click="handleOK"
        />
      </div>
    </div>
  </HelperModalWrapper>
</template>
