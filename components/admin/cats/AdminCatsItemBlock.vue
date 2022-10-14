<script setup>
import message from "~/composables/common/message"
import useCatFields from "~/composables/admin/cats/useCatFields"
import textEditor from "~/composables/admin/cats/textEditor"
import propsEditor from "~/composables/admin/cats/propsEditor"

const fields = useCatFields()

const props = defineProps({
  parentIndex: Number,
  childIndex: Number,
  catsObj: Object,
  propersObj: Object
})

const cat = (props.childIndex !== null ? props.catsObj.items[props.parentIndex].children[props.childIndex] : props.catsObj.items[props.parentIndex])
const propers = computed(() => props.propersObj.items) // без computed изменения в propsObj не будут отслеживаться

const validateDelete = () => {
  showMenu.value = false
  if (cat.children?.length) {
    message.show('Удаление отменено', '<p>В категории содержатся вложенные подкатегории.</p><p>Сначала удалите их.</p>')
    return
  }
  // Задать вопрос Точно удалить?
  message.show('Подтвердите удаление', `<p>Категория "${cat.name}" будет удалена.</p><p>Продолжить?</p>`,
      'info', () => {
        props.catsObj.deleteCat(props.parentIndex, props.childIndex)
      })
}

const showMenu = ref(false)
const showParams = ref(false)
const showChildren = ref(false)

const addCat = () => {
  showMenu.value = false
  props.catsObj.addCat(props.parentIndex, props.childIndex)
}
const addSubCat = () => {
  showMenu.value = false
  props.catsObj.addCat(props.parentIndex)
}
const copyCat = () => {
  showMenu.value = false
  props.catsObj.addCat(props.parentIndex, props.childIndex, true)
}

const setChildHeight = (el) => {
  el.style.setProperty('--child-height', cat.children?.length * 70 + "px");
}

const isDraggingCat = computed(() => {
  if (props.childIndex === null) {
    if (props.catsObj.draggableCatIndex.group === 'none' && props.catsObj.draggableCatIndex.item == props.parentIndex) return true
  } else {
    if (props.catsObj.draggableCatIndex.group == props.parentIndex && props.catsObj.draggableCatIndex.item == props.childIndex) return true
  }
  return false
})
const isDraggingGroup = computed(() => {
  if (props.childIndex === null) {
    if (props.catsObj.draggableCatIndex.group === 'none') return true
  } else {
    if (props.catsObj.draggableCatIndex.group == props.parentIndex) return true
  }
  return false
})
</script>

<template>
  <!--  master wrapper (cat + childs)-->
  <div class="">
    <!--    cat wrapper-->
    <div class="cat-wrapper my-2 border border-gray-500 rounded-xl flex items-start relative"
         :class="(childIndex === null ? 'bg-gray-100' : 'bg-gray-200')"

    >
      <button v-if="cat.children?.length"
              @click="showChildren = !showChildren"
              class="shrink-0 flex items-center border border-gray-200 rounded-lg bg-blue-200 m-1 p-1"
      >
        <img src="@/img/chevron-down.svg"
             class="transition-transform duration-500"
             :class="{'rotate-over': showChildren}"
        >
        <span class="">
        +{{ cat.children?.length }}
      </span>
      </button>
      <button class="border border-gray-200 rounded-full bg-blue-200 m-1 p-2 shrink-0"
              @click="showParams = !showParams"
      >
        <img src="@/img/chevron-down.svg"
             class="transition-transform duration-500"
             :class="{'rotate-over': showParams}"
        >
      </button>
      <!--      params wrapper-->
      <div class="flex items-center flex-wrap mr-9 overflow-hidden transition-all duration-500"
           :class="(showParams ? 'max-h-44' : 'max-h-12')"
      >
        <template v-for="(field, i) in fields" :key="i">
          <template v-if="field.isActive">
            <div v-if="field.type === 'text'"
                 class="m-2 flex"
            >
              <input type="text" v-model.lazy="cat[field.name]"
                     class="w-56"
                     :placeholder="field.nameRU"
                     :title="field.nameRU"
                     @change="catsObj.handleChanges(cat.id, field.name, $event.target.value)">
              <img v-if="field.hasEditButton"
                   class="inline cursor-pointer select-none shrink-0 w-5 ml-1"
                   src="@/img/pencil-square.svg"
                   @click="textEditor.show(parentIndex, childIndex, field.name)"
              >
            </div>
            <div v-else-if="childIndex !== null && field.type === 'select'"
                 class="m-2 flex"
            >
              <select @change="catsObj.handleChanges(cat.id, field.name, $event.target.value)"
                      class="w-36"
                      :title="field.nameRU"
              >
                <option disabled :selected="!cat[field.name]>0">{{ field.nameRU }}:</option>
                <option value="0">Нет</option>
                <option v-for="proper in propers[field.name]" :value="proper.id"
                        :selected="proper.id===cat[field.name]">
                  {{ proper.name }}
                </option>
              </select>
              <img class="inline cursor-pointer select-none shrink-0 w-5 ml-1"
                   src="@/img/pencil-square.svg"
                   @click="propsEditor.show(field.name, field.nameRU, field.groupID)"
              >
            </div>
            <div v-else-if="field.type === 'checkbox'"
                 class="m-2 flex"
            >
              <label>
                <input type="checkbox" :checked="cat[field.name]"
                       @change="catsObj.handleChanges(parentIndex, childIndex, field.name, ($event.target.checked ? 1 : 0))">
                {{ field.nameRU }}
              </label>
            </div>
          </template>
        </template>
      </div>
      <!--      menu-->
      <div class="menu-block absolute right-0 m-1 flex border border-blue-300 rounded-lg bg-blue-100">
        <div class="flex items-center overflow-hidden transition-all duration-500"
             :class="(showMenu ? 'max-w-[170px]' : 'max-w-0 opacity-0')"
        >
          <button class="shrink-0 mx-2" @click="addCat">
            <img src="@/img/plus-circle.svg"
                 class="w-7"
                 title="Добавить категорию"
            >
          </button>
          <button class="shrink-0 mx-1" v-if="childIndex === null" @click="addSubCat">
            <img src="@/img/node-plus.svg"
                 class="w-7 rotate-90"
                 title="Добавить подкатегорию"
            >
          </button>
          <button class="shrink-0 mx-2" @click="copyCat">
            <img src="@/img/hdd-stack.svg"
                 class="w-7"
                 title="Скопировать категорию"
            >
          </button>
          <button class="shrink-0 mx-2" @click="validateDelete">
            <img src="@/img/trash.svg"
                 class="w-7"
                 title="Удалить категорию"
            >
          </button>
        </div>
        <button class="rounded-lg bg-blue-200 py-1 transition" @click="showMenu = !showMenu"
                :class="{'scale-125 bg-amber-500': isDraggingGroup, 'opacity-20': isDraggingCat}"
        >
          <img :src="(showMenu ? '/_nuxt/img/x.svg' : '/_nuxt/img/three-dots-vertical.svg')"
               class="w-7 transition-opacity"
               :data-drag-group="(childIndex === null ? 'none' : parentIndex)"
               :data-drag-item="(childIndex === null ? parentIndex : childIndex)"
          >
        </button>
      </div>
    </div>

    <transition name="transition-catchild"
                @before-enter="setChildHeight"
                @before-leave="setChildHeight"
    >
      <div class="ml-2 overflow-hidden" v-if="showChildren">
        <TransitionGroup name="transition-draggable-group">
          <div v-for="(childCat, childIndex) in cat.children" :key="childCat.id">
            <AdminCatsItemBlock :parentIndex=parentIndex :childIndex=childIndex
                                :catsObj=catsObj :propersObj="propersObj"/>
          </div>
        </TransitionGroup>
      </div>
    </transition>
  </div>


</template>

<style>

</style>