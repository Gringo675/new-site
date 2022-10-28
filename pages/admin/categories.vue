<script setup>
import message from "~/composables/common/message"

definePageMeta({
  layout: "admin",
});

const propersObj = reactive({})
propersObj.getItems = async function () {
  if (this.refreshItems) {
    await this.refreshItems()
  } else {
    const items = await useFetch('/api/adminGetProperties')
    this.items = items.data
    this.refreshItems = items.refresh
  }
}
propersObj.handleChanges = async function (groupName, newItems) {
  const oldItems = this.items[groupName]
  newItems.forEach((item, i) => { // записываем правильное значение ordering
    item.ordering = i + 1
  })
  const changedItems = []
  // new
  newItems.filter(item => item.id === undefined).forEach(item => {
    item.isNew = true
    changedItems.push(item)
  })
  // changed or deleted
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
    await $fetch('/api/adminSetProperties', {
      method: 'POST',
      body: changedItems
    })
    await this.getItems() // обновляем с новыми данными
  }
}

await propersObj.getItems()


const catsObj = reactive({})
catsObj.items = await useFetch('/api/adminGetCategories')
catsObj.items = catsObj.items.data // более элегантного способа не придумал
catsObj.changedCats = {} // хранит информацию об изменениях в категориях

catsObj.handleChanges = function (catID, key, newContent) {
  console.log(`newContent: ${newContent}`)
  if (this.changedCats[catID] === undefined) this.changedCats[catID] = {}
  this.changedCats[catID][key] = newContent
}

catsObj.saveChanges = async function () {
  console.log(`HERE`)
  if (!Object.keys(this.changedCats).length) return

  try {
    await $fetch('/api/adminSetCategories', {
      method: 'POST',
      body: this.changedCats
    })
  } catch (e) {
    console.log(`saveChanges ERROR: ${e.message}`);
    message.show('При сохранении категорий произошла ошибка', `<p>Описание: ${e.message}</p><p>Повторить сохранение?</p>`,
        'error', catsObj.saveChanges)
  }

  this.changedCats = {}
}

catsObj.addCat = function (parentIndex, childIndex, isCopy) {
  /**
   * У функции три варианта добавления категории:
   * Копирование - определяется по флагу isCopy. Таргет-категория просто копируется рядом с новым ID.
   * Добавление - новая пустая категория с сгенерированным ID вставляется на одном уровне с таргет-категорией (рядом).
   * Добавление подкатегории - возможна только для "главных" категорий. Определяется по childIndex === undefined (не
   * передается в функцию). Добавляет пустую подкатегорию для таргет-категории (в конец).
   */

  const isAddSubCat = childIndex === undefined
  const targetCat = (childIndex >= 0 && childIndex !== null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex])
  if (isAddSubCat && targetCat.children === undefined) targetCat.children = []
  const targetArray = (childIndex !== null ? this.items[parentIndex].children : this.items) // куда будем вставлять

  const newID = (targetArray.length ? Math.max.apply(null, targetArray.map(cat => cat.id)) + 1 : targetCat.id * 100 + 1)
  const newCat = (isCopy ? JSON.parse(JSON.stringify(targetCat)) : {})
  delete newCat.children // при копировании дети не копируются
  newCat.id = newID
  if (isAddSubCat) { // вставляем в конец
    targetArray.push(newCat)
  } else {  // вставляем рядом
    const targetIndex = (childIndex >= 0 && childIndex !== null ? childIndex : parentIndex) + 1
    targetArray.splice(targetIndex, 0, newCat)
  }
  // сохраняем изменения в спец. объекте
  const wasDeleted = this.changedCats[newCat.id]?.isDel // проверяем, не была ли категория с таким же ID предварительна удалена
  this.changedCats[newCat.id] = JSON.parse(JSON.stringify(newCat))
  if (wasDeleted) this.changedCats[newCat.id].isDel = true // возвращаем флаг, чтобы при обработке на сервере предварительно удалить старую
  this.changedCats[newCat.id].isNew = true
  delete this.changedCats[newCat.id].id // убираем дублирование ID

  // обрабатываем новый порядок категорий
  this.createNewCatsOrder(targetArray)
}

catsObj.deleteCat = function (parentIndex, childIndex) {
  const targetCat = (childIndex !== null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex])
  const targetArray = (childIndex !== null ? this.items[parentIndex].children : this.items) // откуда будем удалять
  const targetIndex = (childIndex !== null ? childIndex : parentIndex)
  const targetID = targetCat.id

  if (this.changedCats[targetID]?.isNew) { // если до этого добавили эту категорию
    delete this.changedCats[targetID]  // просто удаляем
  } else {
    this.changedCats[targetID] = {}
    this.changedCats[targetID].isDel = true
  }
  targetArray.splice(targetIndex, 1)

  // обрабатываем новый порядок категорий
  this.createNewCatsOrder(targetArray)
}

catsObj.createNewCatsOrder = function (targetCats) {
  // присваивает переданным в массиве категориям новое значение ordering
  targetCats.forEach((cat, i) => {
    const newOrdering = i + 1
    if (newOrdering !== cat.ordering) {
      cat.ordering = newOrdering
      if (this.changedCats[cat.id] === undefined) this.changedCats[cat.id] = {}
      this.changedCats[cat.id].ordering = cat.ordering
    }
  })
}

catsObj.draggableCatIndex = {
  group: null,
  item: null
}
const moveCatsDebounced = {
  timerValue: 500,
  coolDownValue: 500,
  timer: null,
  isCoolDown: false,
  go(targetIndex) {
    if (this.isCoolDown) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {

      let targetArray = (catsObj.draggableCatIndex.group === 'none' ? catsObj.items : catsObj.items[catsObj.draggableCatIndex.group].children)
      targetArray.splice(targetIndex, 0, targetArray.splice(catsObj.draggableCatIndex.item, 1)[0])
      catsObj.draggableCatIndex.item = targetIndex
      catsObj.createNewCatsOrder(targetArray)

      this.isCoolDown = true
      setTimeout(() => this.isCoolDown = false, this.coolDownValue)
    }, this.timerValue)
  }
}
const handleDragStart = (ev) => {
  if (ev.target.dataset?.dragGroup === undefined) return
  catsObj.draggableCatIndex.group = ev.target.dataset.dragGroup
  catsObj.draggableCatIndex.item = ev.target.dataset.dragItem
  ev.dataTransfer.setDragImage(ev.target.parentElement, 15, 20)
}
const handleDragEnd = () => {
  catsObj.draggableCatIndex.group = null
  catsObj.draggableCatIndex.item = null
}
const handleDragEnter = (ev) => {
  if (catsObj.draggableCatIndex.group === null) return
  ev.preventDefault()
  const currentIndex = {
    group: ev.target.dataset?.dragGroup,
    item: ev.target.dataset?.dragItem
  }
  if (currentIndex.group === undefined || currentIndex.group !== catsObj.draggableCatIndex.group ||
      currentIndex.item == catsObj.draggableCatIndex.item) return
  moveCatsDebounced.go(currentIndex.item)
}
const handleDragOver = (ev) => {
  if (catsObj.draggableCatIndex.group === null) return
  ev.preventDefault()
  const currentIndex = {
    group: ev.target.dataset?.dragGroup,
    item: ev.target.dataset?.dragItem
  }
  if (currentIndex.group === undefined || currentIndex.group !== catsObj.draggableCatIndex.group ||
      currentIndex.item == catsObj.draggableCatIndex.item) {
    ev.dataTransfer.dropEffect = "none"
  } else {
    ev.dataTransfer.dropEffect = "move"
  }
}
</script>

<template>
  <div class="p-2">
    <h1>Редактирование категорий</h1>
    <div class="my-2 flex items-center">
      <AdminCatsFilter/>
      <!--      save button-->
      <button :disabled="!Object.keys(catsObj.changedCats).length"
              @click="catsObj.saveChanges()"
              class="ml-2 shrink-0 p-1 border border-blue-300 rounded-lg"
              title="Сохранить"
      >
        <img class="w-12"
             src="@/img/send.svg"
        >
      </button>
    </div>
    <div class="catItems"
         @dragstart="handleDragStart" @dragend="handleDragEnd" @dragenter="handleDragEnter" @dragover="handleDragOver"
    >
      <TransitionGroup name="transition-draggable-group">
        <div v-for="(parentCat, parentIndex) in catsObj.items" :key="parentCat.id">
          <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=null :catsObj=catsObj :propersObj="propersObj"/>
        </div>
      </TransitionGroup>
    </div>

    <AdminCatsTextEditor :catsObj="catsObj"/>

    <AdminCatsPropsEditor :propersObj="propersObj"/>

  </div>
</template>

