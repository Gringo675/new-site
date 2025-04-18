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
const handleShowMenuClick = () => {
  if (showMenu.value) return
  showMenu.value = true
  setTimeout(() => window.addEventListener('click', () => (showMenu.value = false), { once: true }), 10)
}
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
    description: `<p>Категория "${cat.name ?? 'Без имени'}" будет удалена.</p><p>Продолжить?</p>`,
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
</script>

<template>
  <!--  master wrapper (cat + childs)-->
  <div class="">
    <!--    cat wrapper-->
    <div
      class="my-2 p-1 border border-gray-500 rounded-xl flex items-start relative"
      :class="{
        'bg-sky-200': indexes.length === 1,
        'bg-teal-200': indexes.length === 2,
        'bg-orange-200': indexes.length === 3,
      }"
    >
      <!--      params wrapper-->
      <div class="flex items-center flex-wrap gap-x-2 gap-y-1 my-1 mr-9">
        <button
          v-if="cat.children?.length"
          @click="showChildren = !showChildren"
          class="shrink-0 flex items-center border border-gray-200 rounded-lg bg-yellow-100 p-1"
        >
          <img
            src="/img/chevron-down.svg"
            class="transition-transform duration-500"
            :class="{ 'rotate-over': showChildren }"
          />
          <span class=""> +{{ cat.children?.length }} </span>
        </button>
        <template
          v-for="(field, i) in catFields"
          :key="i"
        >
          <template v-if="field.isActive">
            <UButton
              v-if="field.type === 'text'"
              :title="field.nameRU"
              :variant="cat[field.name]?.length ? 'solid' : 'outline'"
              :label="field.name === 'name' && cat[field.name]?.length ? cat.name : field.nameRU"
              @click="textEditor.show(indexes, field.name)"
            />
            <UButton
              v-else-if="indexes.length > 1 && field.type === 'multiselect'"
              :title="field.nameRU"
              :variant="cat[field.name]?.length ? 'solid' : 'outline'"
              :label="
                cat[field.name]?.length
                  ? cat[field.name]
                      .split(',')
                      .map(i => propsG.items[field.name].find(item => item.id == i)?.name)
                      .join(', ')
                  : field.nameRU
              "
              @click="propsEditor.show(indexes, field.name)"
            />
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
        <div>id: {{ cat.id }}</div>
      </div>
      <!--      menu-->
      <div class="menu-block absolute right-0 m-1 flex border border-blue-300 rounded-lg bg-blue-100">
        <div
          class="flex items-center overflow-hidden transition-all duration-500"
          :class="showMenu ? 'max-w-[210px]' : 'max-w-0 opacity-0'"
        >
          <button
            class="shrink-0 mx-2"
            @click="addCat"
          >
            <img
              :src="getDynamicAsset('/img/plus-circle.svg')"
              class="w-7"
              title="Добавить категорию"
            />
          </button>
          <button
            class="shrink-0 mx-2"
            @click="copyCat"
          >
            <img
              :src="getDynamicAsset('/img/hdd-stack.svg')"
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
              :src="getDynamicAsset('/img/node-plus.svg')"
              class="w-7 rotate-90"
              title="Добавить подкатегорию"
            />
          </button>

          <button
            class="shrink-0 mx-2"
            @click="validateDelete"
          >
            <img
              :src="getDynamicAsset('/img/trash.svg')"
              class="w-7"
              title="Удалить категорию"
            />
          </button>
          <NuxtLink
            :to="'/catalog/' + cat.alias"
            target="_blank"
            class="shrink-0 mr-2"
          >
            <UIcon
              name="i-heroicons-arrow-right-on-rectangle-solid"
              class="w-7 h-7 block"
              title="Перейти в категорию"
            />
          </NuxtLink>
        </div>
        <button
          class="rounded-lg bg-blue-200 py-1 transition"
          @click="handleShowMenuClick"
          :class="{ 'scale-125 border border-blue-300': inDraggingGroup, 'opacity-20': isDraggingCat }"
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
