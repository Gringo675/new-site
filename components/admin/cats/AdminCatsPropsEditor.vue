<script setup>
const propsEditor = await usePropsEditor
const message = await useMessage
const loader = await useLoader
const props = defineProps({
  propersObj: Object,
})

const pGroup = reactive(JSON.parse(JSON.stringify(props.propersObj.items[propsEditor.groupName]))) // локальная копия

let draggableElementIndex = null
const handleDragStart = (e, i) => {
  draggableElementIndex = i
  // e.target.parentElement.style.opacity = '.2'
  e.target.parentElement.classList.add('opacity-20')
  e.dataTransfer.setDragImage(e.target.parentElement, 18, 20)
}
const handleDragEnd = (e) => {
  draggableElementIndex = null
  // e.target.parentElement.removeAttribute("style")
  e.target.parentElement.classList.remove('opacity-20')
}
const handleDragEnterItem = (e, i) => {
  e.preventDefault()
  if (draggableElementIndex === null || draggableElementIndex === i || e.currentTarget.style.padding) return
  if (draggableElementIndex < i) { // спускаем сверху
    e.currentTarget.style.padding = '0 0 50px'
  } else { // поднимаем снизу
    e.currentTarget.style.padding = '50px 0 0'
  }
  // убираем padding у сиблингов
  let sibling = e.currentTarget.parentNode.firstChild;
  while (sibling) {
    if (sibling !== e.currentTarget) {
      sibling.style?.removeProperty('padding')
    }
    sibling = sibling.nextSibling
  }
}
const handleDragEnterWrapper = (e) => {
  e.preventDefault()
  if (draggableElementIndex === null) return
  // убираем padding у всех детей
  for (let i = 0; i < e.currentTarget.children.length; i++) {
    e.currentTarget.children[i].style?.removeProperty('padding')
  }
}
const handleDragOver = (e) => {
  if (draggableElementIndex === null) return
  e.preventDefault()
  e.dataTransfer.dropEffect = "move"
}
const handleDrop = (e, i) => {
  if (draggableElementIndex === null) return
  e.currentTarget.removeAttribute("style")
  if (draggableElementIndex === i) return
  removeItems(draggableElementIndex, i)
}
const removeItems = (relocateItem, targetItem) => {
  pGroup.splice(targetItem, 0, pGroup.splice(relocateItem, 1)[0])
}

const deleteItem = (i) => {
  message.show('Подтвердите удаление', `<p>Параметр "${pGroup[i].name}" будет удален.</p><p>Продолжить?</p>`,
      'info', () => {
        pGroup.splice(i, 1)
      })
}

const addItem = (i) => {
  const newItem = {
    group_id: propsEditor.groupID,
    name: ''
  }
  pGroup.splice(i + 1, 0, newItem)
}

const handleOK = async () => {
  // проверяем пустые значения name
  if (pGroup.some(item => item.name === '')) {
    message.show('Действие отменено!', 'Не все имена параметров заполнены!', 'error')
    return
  }
  try {
    loader.show()
    await props.propersObj.handleChanges(propsEditor.groupName, pGroup)
    loader.hide()
    propsEditor.isShow = false
  } catch (e) {
    loader.hide()
    message.show('Изменения не сохранены!', 'При сохранении произошла ошибка. Попробовать еще раз?', 'error', handleOK)
  }
}
</script>

<template>
  <HelperModalWrapper>
    <div class="modal-form w-96 max-w-[95%] max-h-[95%]
         border border-amber-900 rounded-xl
         overflow-auto flex flex-col justify-start">
      <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5">
        <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">
          {{ propsEditor.groupNameRU }}
        </div>
        <div class="bg-[url('/img/x-circle.svg')] bg-center bg-no-repeat bg-contain
                    w-7 h-7 ml-2 flex-shrink-0 cursor-pointer hover:scale-90 transition-transform"
             @click="propsEditor.isShow = false"></div>
      </div>
      <div class="p-5 overflow-auto bg-amber-100 flex flex-col items-center"
           @dragenter.self="handleDragEnterWrapper($event)">
        <div v-for="(item, i) in pGroup" :key="i"
             @dragenter="handleDragEnterItem($event, i)" @dragover="handleDragOver"
             @drop="handleDrop($event, i)"
             class="transition-[padding] duration-500">
          <div class="bg-orange-200 border border-orange-700 rounded p-2 m-2 transition-opacity duration-300">
            <img @dragstart="handleDragStart($event, i)" @dragend="handleDragEnd"
                 class="inline cursor-move select-none"
                 src="@/img/arrows-move.svg">
            <input type="text" v-model="item.name"
                   class="ml-2 px-1 rounded bg-orange-100 outline-none  w-40">
            <img @click="deleteItem(i)"
                 class="inline cursor-pointer select-none mx-1.5"
                 src="@/img/dash-square.svg">
            <img @click="addItem(i)"
                 class="inline cursor-pointer select-none"
                 src="@/img/plus-square.svg">
          </div>
        </div>
      </div>
      <div class="p-2.5 bg-orange-200 flex justify-end items-center">
        <button @click="propsEditor.isShow = false" class="button px-2 py-1">Cancel</button>
        <button class="button px-2 py-1"
                @click="handleOK">OK
        </button>
      </div>
    </div>
  </HelperModalWrapper>
</template>

<style lang="scss">

</style>