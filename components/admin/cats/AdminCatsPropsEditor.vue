<script setup>
import propsEditor from '~/composables/admin/cats/propsEditor'
import propsG from '~/composables/admin/cats/propsG'

const pGroup = ref(JSON.parse(JSON.stringify(propsG.items[propsEditor.groupName]))) // локальная копия

const draggableElementIndex = ref(null)
const handleDragStart = ev => {
  if (ev.target.dataset?.draggable === undefined) return
  draggableElementIndex.value = Number(ev.target.parentElement.dataset.index)
  ev.dataTransfer.setDragImage(ev.target.parentElement, 18, 20)
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

const deleteItem = i => {
  showMessage({
    title: 'Подтвердите удаление',
    description: `<p>Параметр "${pGroup.value[i].name}" будет удален.</p><p>Продолжить?</p>`,
    callback: () => pGroup.value.splice(i, 1),
  })
}

const addItem = i => {
  const newItem = {
    group_id: propsEditor.groupID,
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
          {{ propsEditor.groupNameRU }}
        </div>
        <div
          class="bg-[url('/img/x-circle.svg')] bg-center bg-no-repeat bg-contain w-7 h-7 ml-2 flex-shrink-0 cursor-pointer hover:scale-90 transition-transform"
          @click="propsEditor.hide"
        ></div>
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
            class="bg-orange-200 border border-orange-700 rounded-lg p-2 m-2 transition-opacity duration-300"
          >
            <img
              class="inline cursor-move select-none"
              src="/img/arrows-move.svg"
              data-draggable
            />
            <input
              type="text"
              v-model="item.name"
              class="ml-2 px-1 rounded bg-orange-100 outline-none w-40"
            />
            <img
              @click="deleteItem(i)"
              class="inline cursor-pointer select-none mx-1.5"
              src="/img/dash-square.svg"
            />
            <img
              @click="addItem(i)"
              class="inline cursor-pointer select-none"
              src="/img/plus-square.svg"
            />
          </div>
        </TransitionGroup>
      </div>
      <div class="p-2.5 bg-orange-200 flex justify-end items-center">
        <button
          @click="propsEditor.hide"
          class="button px-2 py-1"
        >
          Cancel
        </button>
        <button
          class="button px-2 py-1"
          @click="handleOK"
        >
          OK
        </button>
      </div>
    </div>
  </HelperModalWrapper>
</template>

<style></style>
