<script setup>
import propsG from '~/composables/admin/cats/propsG'
import catsG from '~/composables/admin/cats/catsG'
import * as dd from '~/composables/admin/cats/dragDrop'
import propsEditor from '~/composables/admin/cats/propsEditor'
import textEditor from '~/composables/admin/cats/textEditor'

await propsG.getItems()
await catsG.getCats()

// Проверка на несохраненные изменения
onMounted(() => {
  // перезагрузка, закрытие
  window.addEventListener('beforeunload', event => {
    if (!Object.keys(catsG.changedCats).length) return
    event.preventDefault()
    event.returnValue = true
  })
})
onBeforeRouteLeave(async to => {
  // переход по ссылкам, кнопки Назад/Вперед
  if (!Object.keys(catsG.changedCats).length) return
  const proceed = await showMessage({
    title: 'Подтвердите уход со страницы',
    description: 'Есть несохраненные изменения. Если продолжить, они будут утеряны.',
    type: 'error',
    isDialog: true,
  })
  if (!proceed) return false
})
</script>

<template>
  <HelperAdminOnly>
    <div class="p-2">
      <h1 class="">Редактирование категорий</h1>
      <div
        class="sticky -top-2 z-10 border border-cyan-600 bg-cyan-100 rounded-xl my-2 flex items-center justify-between"
      >
        <AdminCatsFilter />
        <!--      save button-->
        <button
          :disabled="!Object.keys(catsG.changedCats).length"
          @click="catsG.saveChanges()"
          class="ml-2 shrink-0 p-1 disabled:opacity-50"
          title="Сохранить"
        >
          <img
            class="w-12"
            src="/img/send.svg"
          />
        </button>
      </div>
      <div
        class="catItems"
        @dragstart="dd.handleDragStart"
        @dragend="dd.handleDragEnd"
        @dragenter="dd.handleDragEnter"
        @dragover="dd.handleDragOver"
      >
        <TransitionGroup name="transition-draggable-group">
          <div
            v-for="(cat, index) in catsG.cats"
            :key="cat.id"
          >
            <AdminCatsItemBlock :indexes="[index]" />
          </div>
        </TransitionGroup>
      </div>
      <!-- <div class="debug absolute bottom-0 left-0 w-full h-1/6 bg-slate-500 text-slate-100 overflow-auto">
        <h2>changedCats</h2>
        <pre>{{ catsG.changedCats }}</pre>
      </div> -->

      <transition name="transition-fade">
        <AdminCatsTextEditor v-if="textEditor.isActive" />
      </transition>
      <transition name="transition-fade">
        <AdminCatsPropsEditor v-if="propsEditor.isActive" />
      </transition>
    </div>
  </HelperAdminOnly>
</template>
