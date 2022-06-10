<script setup>
import {useMessage as message} from "@/composables/state";
import {usePropsEditor} from "../../../composables/state";
const fields = await useCatFields
const textEditor = await useTextEditor
const propsEditor = await usePropsEditor

const props = defineProps({
  parentIndex: Number,
  childIndex: Number,
  catsObj: Object,
  propersObj: Object
})

const cat = (props.childIndex !== null ? props.catsObj.items[props.parentIndex].children[props.childIndex] : props.catsObj.items[props.parentIndex])
const propers = props.propersObj.items

const validateDelete = () => {
  if (cat.children?.length) {
    message.show('Удаление отменено', '<p>В категории содержатся вложенные подкатегории.</p><p>Сначала удалите их.</p>')
    return
  }
  // Задать вопрос Точно удалить?
  message.show('Подтвердите удаление', `<p>Категория "${cat.name}" будет удалена.</p><p>Продолжить?</p>`,
                'info', ()=> {props.catsObj.deleteCat(props.parentIndex, props.childIndex)})
}

const activateTextEditor = (field) => {
  textEditor.field = field
  textEditor.parentIndex = props.parentIndex
  textEditor.childIndex = props.childIndex
  textEditor.isShow = true
}

const handleSelect = (field, value) => {
  if (value === 'add') {
    propsEditor.group = field
    propsEditor.isShow = true
  } else {
    props.catsObj.handleChanges(props.parentIndex, props.childIndex, field, value)
  }
}

</script>

<template>
  <div class="catWrapper">
    <div class="catButtons">
      <button class="button" @click="catsObj.addCat(parentIndex, childIndex)">Добавить категорию</button>
      <button class="button" v-if="childIndex === null" @click="catsObj.addCat(parentIndex)">Добавить подкатегорию</button>
      <button class="button" @click="catsObj.addCat(parentIndex, childIndex, true)">Скопировать</button>
      <button class="button" @click="validateDelete">Удалить</button>
      <button class="button" @click="catsObj.moveCat(parentIndex, childIndex, 'up')">UP</button>
      <button class="button" @click="catsObj.moveCat(parentIndex, childIndex, 'down')">DOWN</button>
    </div>
    <div class="catFields">

      <template v-for="(field, i) in fields" :key="i">
        <template v-if="field.isActive">
          <div v-if="field.type === 'text'" >
            <div class="editableBlock" contenteditable="true"
                 @blur="catsObj.handleChanges(parentIndex, childIndex, field.name, $event.target.innerHTML)">
              {{ cat[field.name] }}
            </div>
            <button v-if="field.hasEditButton" class="button" @click="activateTextEditor(field.name)">Edit</button>
          </div>
          <div v-else-if="field.type === 'select'">
            <select @change="handleSelect(field.name, $event.target.value)">
              <option disabled :selected="!cat[field.name]>0">{{field.nameRU}}:</option>
              <option v-for="proper in propers[field.name]" :value="proper.id"
                      :selected="proper.id===cat[field.name]">
                {{ proper.name }}
              </option>
              <option value="add">Добавить...</option>
            </select>
          </div>
          <div v-else-if="field.type === 'checkbox'">
            <label>
              <input type="checkbox" :checked="cat[field.name]"
              @change="catsObj.handleChanges(parentIndex, childIndex, field.name, ($event.target.checked ? 1 : 0))" >
              {{ field.nameRU }}
            </label>
          </div>
        </template>
      </template>

    </div>
    <div class="catChildrenBlock" v-if="cat.children?.length">
      <template v-for="(childCat, childIndex) in cat.children" :key="childCat.id">
        <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=childIndex
                            :catsObj=catsObj :propersObj="propersObj"/>
      </template>
    </div>
  </div>

</template>

<style lang="scss">
.catWrapper {
  border: 1px solid red;
  margin: 10px;

  .catChildrenBlock {
    border: 1px solid blue;
    margin: 10px;
  }

}
</style>