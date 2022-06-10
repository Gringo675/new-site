<script setup>
import {useMessage as message} from "@/composables/state";
const textEditor = await useTextEditor
const propsEditor = await usePropsEditor

const propersObj = reactive({})
propersObj.items = await useFetch('/api/getProperties')
propersObj.items = propersObj.items.data

const catsObj = reactive({})
catsObj.items = await useFetch('/api/getCategories')
catsObj.items = catsObj.items.data // более элегантного способа не придумал
catsObj.changedCats = {} // хранит информацию об изменениях в категориях

catsObj.handleChanges = function (parentIndex, childIndex, key, newContent) {
  const targetCat = (childIndex === null ? this.items[parentIndex] : this.items[parentIndex].children[childIndex])

  if (targetCat[key] !== newContent) { // есть изменения
    targetCat[key] = newContent
    // сохраняем изменения в объекте для последующей отправки на сервер
    if (this.changedCats[targetCat.id] === undefined) this.changedCats[targetCat.id] = {}
    this.changedCats[targetCat.id][key] = newContent
  }
}

catsObj.saveChanges = async function () {

  try {
    await $fetch('/api/setCategories', {
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
  const targetCat = (childIndex>=0&&childIndex!==null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex] )
  if (isAddSubCat && targetCat.children === undefined) targetCat.children = []
  const targetArray = (childIndex!==null ? this.items[parentIndex].children : this.items ) // куда будем вставлять

  const newID = (targetArray.length ? Math.max.apply(null, targetArray.map(cat => cat.id)) +1 : targetCat.id*100+1 )
  // console.log(`newID: ${newID}`);
  const newCat = (isCopy ? JSON.parse(JSON.stringify(targetCat)) : {})
  delete newCat.children // при копировании дети не копируются
  newCat.id = newID
  if (isAddSubCat) { // вставляем в конец
    targetArray.push(newCat)
  } else {  // вставляем рядом
    const targetIndex = (childIndex>=0&&childIndex!==null ? childIndex : parentIndex) + 1
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
  const targetCat = (childIndex !== null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex] )
  const targetArray = (childIndex !== null ? this.items[parentIndex].children : this.items ) // откуда будем удалять
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

catsObj.createNewCatsOrder = function(targetCats) {
  // присваивает переданным в массиве категориям новое значение ordering
  targetCats.forEach( (cat, i) => {
    const newOrdering = i + 1
    if ( newOrdering !== cat.ordering) {
      cat.ordering = newOrdering
      if (this.changedCats[cat.id] === undefined) this.changedCats[cat.id] = {}
      this.changedCats[cat.id].ordering = cat.ordering
    }
  })
}

catsObj.moveCat = function (parentIndex, childIndex, direction) {

  const targetArray = (childIndex!==null ? this.items[parentIndex].children : this.items )
  const targetIndex = (childIndex!==null ? childIndex : parentIndex )
  let isChanged = false
  if (direction === 'up' && targetIndex > 0) {
    targetArray.splice(targetIndex-1, 0, targetArray.splice(targetIndex, 1)[0])
    isChanged = true
  } else if (direction === 'down' && targetIndex+1 < targetArray.length) {
    targetArray.splice(targetIndex+1, 0, targetArray.splice(targetIndex, 1)[0])
    isChanged = true
  }

  if (isChanged) this.createNewCatsOrder(targetArray)
}


</script>

<template>
  <div class="categories">
    <AdminCatsTextEditor v-if="textEditor.isShow" :catsObj="catsObj"/>
    <AdminCatsPropsEditor v-if="propsEditor.isShow" :propersObj="propersObj"/>
    <h1>Categories</h1>
    <AdminCatsFilter />
    <div>
      <button class="button" :disabled="!Object.keys(catsObj.changedCats).length" @click="catsObj.saveChanges()">
        Save
      </button>
    </div>
    <div class="catItems">
      <template v-for="(parentCat, parentIndex) in catsObj.items" :key="parentCat.id">
        <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=null :catsObj=catsObj :propersObj="propersObj"/>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.categories {

  .editableBlock {
    width: 250px;
    margin: 5px;
    padding: 5px;
    border: 1px solid blue;
    border-radius: 5px;
  }

  .parentCat {
    background: orchid;
    margin: 10px;
    padding: 10px;
    border-radius: 10px;

    .paramsBlock {
      display: flex;
    }

    .childrenBlock {

      .childCat {

      }
    }
  }
}
</style>