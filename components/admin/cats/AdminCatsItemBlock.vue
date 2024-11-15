<script setup>
import textEditor from '~/composables/admin/cats/textEditor'
import propsEditor from '~/composables/admin/cats/propsEditor'
import catFields from '~/composables/admin/cats/catFields'
import propsG from '~/composables/admin/cats/propsG'
import catsG from '~/composables/admin/cats/catsG'

const props = defineProps({
  indexes: Array,
})

const cat = catsG.getCat(props.indexes)

const showMenu = ref(false)
const showParams = ref(false)
const showChildren = ref(false)

const validateDelete = async () => {
  showMenu.value = false
  if (cat.children?.length) {
    showMessage({
      type: 'error',
      title: 'Удаление отменено',
      description: '<p>В категории содержатся вложенные подкатегории.</p><p>Сначала удалите их.</p>',
    })
    return
  }

  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: `<p>Категория "${cat.name}" будет удалена.</p><p>Продолжить?</p>`,
    isDialog: true,
  })
  if (proceed) catsG.deleteCat(props.indexes)
}

const addCat = () => {
  showMenu.value = false
  catsG.addCat(props.indexes)
}
const addSubCat = () => {
  showMenu.value = false
  showChildren.value = true
  catsG.addCat(props.indexes, { subcat: true })
}
const copyCat = () => {
  showMenu.value = false
  catsG.addCat(props.indexes, { copy: true })
}

// анимация открытия/закрытия подкатегорий
const onEnter = async (el, done) => {
  const height = el.offsetHeight
  el.style.setProperty('height', '0')
  await new Promise(resolve => setTimeout(resolve, 0))
  el.style.setProperty('height', height + 'px')
  el.style.setProperty('transition', 'height .4s linear')
  el.addEventListener(
    'transitionend',
    () => {
      el.style.removeProperty('height')
      el.style.removeProperty('transition')
      done()
    },
    { once: true }
  )
}
const onLeave = async (el, done) => {
  const height = el.offsetHeight
  el.style.setProperty('height', height + 'px')
  await new Promise(resolve => setTimeout(resolve, 0))
  el.style.setProperty('height', '0')
  el.style.setProperty('transition', 'height .2s linear')
  el.addEventListener(
    'transitionend',
    () => {
      el.style.removeProperty('height')
      el.style.removeProperty('transition')
      done()
    },
    { once: true }
  )
}

// для выделения перетаскиваемой категории
const isDraggingCat = computed(
  () =>
    catsG.draggingCatIndexes.length === props.indexes.length &&
    catsG.draggingCatIndexes.every((item, index) => item === props.indexes[index])
)
// для выделения группы, куда можно переместить
const inDraggingGroup = computed(
  () =>
    catsG.draggingCatIndexes.length === props.indexes.length &&
    catsG.draggingCatIndexes.slice(0, -1).every((item, index) => item === props.indexes[index]) &&
    catsG.draggingCatIndexes[catsG.draggingCatIndexes.length - 1] !== props.indexes[props.indexes.length - 1]
)

// создание алиаса
watch(
  () => cat.name,
  name => {
    if (!cat.alias?.length) {
      cat.alias = createAlias(name)
      catsG.handleChanges(cat.id, 'alias', cat.alias)
    }
  }
)
</script>

<template>
  <!--  master wrapper (cat + childs)-->
  <div class="">
    <!--    cat wrapper-->
    <div
      class="cat-wrapper my-2 border border-gray-500 rounded-xl flex items-start relative"
      :class="{
        'bg-sky-200': indexes.length === 1,
        'bg-teal-200': indexes.length === 2,
        'bg-orange-200': indexes.length === 3,
      }"
    >
      <button
        v-if="cat.children?.length"
        @click="showChildren = !showChildren"
        class="shrink-0 flex items-center border border-gray-200 rounded-lg bg-yellow-100 m-1 p-1"
      >
        <img
          src="/img/chevron-down.svg"
          class="transition-transform duration-500"
          :class="{ 'rotate-over': showChildren }"
        />
        <span class=""> +{{ cat.children?.length }} </span>
      </button>
      <button
        class="border border-gray-200 rounded-full bg-yellow-100 m-1 p-2 shrink-0"
        @click="showParams = !showParams"
      >
        <img
          src="/img/chevron-down.svg"
          class="transition-transform duration-500"
          :class="{ 'rotate-over': showParams }"
        />
      </button>
      <!--      params wrapper-->
      <div
        class="flex items-center flex-wrap gap-2 mr-9 overflow-hidden transition-all duration-500"
        :class="showParams ? 'max-h-44' : 'max-h-12'"
      >
        <template
          v-for="(field, i) in catFields"
          :key="i"
        >
          <template v-if="field.isActive">
            <UButton
              v-if="field.type === 'text'"
              :title="field.nameRU"
              :variant="cat[field.name].length ? 'solid' : 'outline'"
              :label="field.name === 'name' ? cat.name : field.nameRU"
              @click="textEditor.show(indexes, field.name)"
            />
            <div
              v-else-if="indexes.length > 1 && field.type === 'multiselect'"
              class="m-2 flex"
            >
              <UButton
                :title="field.nameRU"
                :variant="cat[field.name].length ? 'solid' : 'outline'"
                :label="
                  cat[field.name].length
                    ? cat[field.name]
                        .split(',')
                        .map(i => propsG.items[field.name].find(item => item.id == i)?.name)
                        .join(', ')
                    : field.nameRU
                "
                @click="propsEditor.show(indexes, field.name)"
              />
            </div>
            <div
              v-else-if="indexes.length > 1 && field.type === 'select'"
              class="m-2 flex"
            >
              <select
                @change="catsG.handleChanges(cat.id, field.name, $event.target.value)"
                class="w-36"
                :title="field.nameRU"
              >
                <option
                  disabled
                  :selected="!cat[field.name] > 0"
                >
                  {{ field.nameRU }}:
                </option>
                <option value="0">Нет</option>
                <option
                  v-for="proper in propsG.items[field.name]"
                  :value="proper.id"
                  :selected="proper.id == cat[field.name]"
                >
                  {{ proper.name }}
                </option>
              </select>
              <img
                class="inline cursor-pointer select-none shrink-0 w-5 ml-1"
                src="/img/pencil-square.svg"
                @click="propsEditor.show(field.name, field.nameRU, field.groupID)"
              />
            </div>
            <div
              v-else-if="field.type === 'checkbox'"
              class="m-2 flex"
            >
              <label>
                <input
                  type="checkbox"
                  :checked="cat[field.name]"
                  @change="catsG.handleChanges(cat.id, field.name, $event.target.checked ? 1 : 0)"
                />
                {{ field.nameRU }}
              </label>
            </div>
          </template>
        </template>
      </div>
      <!--      menu-->
      <div class="menu-block absolute right-0 m-1 flex border border-blue-300 rounded-lg bg-blue-100">
        <div
          class="flex items-center overflow-hidden transition-all duration-500"
          :class="showMenu ? 'max-w-[170px]' : 'max-w-0 opacity-0'"
        >
          <button
            class="shrink-0 mx-2"
            @click="addCat"
          >
            <img
              src="/img/plus-circle.svg"
              class="w-7"
              title="Добавить категорию"
            />
          </button>
          <button
            class="shrink-0 mx-2"
            @click="copyCat"
          >
            <img
              src="/img/hdd-stack.svg"
              class="w-7"
              title="Скопировать категорию"
            />
          </button>
          <button
            v-if="indexes.length < 3"
            class="shrink-0 mx-1"
            @click="addSubCat"
          >
            <img
              src="/img/node-plus.svg"
              class="w-7 rotate-90"
              title="Добавить подкатегорию"
            />
          </button>

          <button
            class="shrink-0 mx-2"
            @click="validateDelete"
          >
            <img
              src="/img/trash.svg"
              class="w-7"
              title="Удалить категорию"
            />
          </button>
        </div>
        <button
          class="rounded-lg bg-blue-200 py-1 transition"
          @click="showMenu = !showMenu"
          :class="{ 'scale-125 shadow-inner shadow-amber-500': inDraggingGroup, 'opacity-20': isDraggingCat }"
        >
          <img
            :src="showMenu ? getDynamicAsset('/img/x.svg') : getDynamicAsset('/img/three-dots-vertical.svg')"
            class="w-7 transition-opacity"
            :data-cat-indexes="JSON.stringify(props.indexes)"
            :data-drag-group="inDraggingGroup ? '1' : undefined"
          />
        </button>
      </div>
    </div>

    <transition
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        class="ml-2 overflow-hidden"
        v-show="showChildren"
      >
        <TransitionGroup name="transition-draggable-group">
          <div
            v-for="(subCat, index) in cat.children"
            :key="subCat.id"
          >
            <AdminCatsItemBlock :indexes="[...indexes, index]" />
          </div>
        </TransitionGroup>
      </div>
    </transition>
  </div>
</template>

<style></style>
