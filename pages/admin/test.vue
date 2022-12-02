<script setup>

import propsG from "~/composables/admin/cats/propsG"
import catsG from "~/composables/admin/cats/catsG"
import * as dd from "~/composables/admin/cats/dragDrop"
import propsEditor from "~/composables/admin/cats/propsEditor"
import textEditor from "~/composables/admin/cats/textEditor"

await propsG.getItems()
await catsG.getItems()

</script>

<template>
  <div class="p-2">
    <h1>Редактирование категорий</h1>
    <div class="my-2 flex items-center">
      <AdminCatsFilter/>
      <!--      save button-->
      <button :disabled="!Object.keys(catsG.changedCats).length"
              @click="catsG.saveChanges()"
              class="ml-2 shrink-0 p-1 border border-blue-300 rounded-lg"
              title="Сохранить"
      >
        <img class="w-12"
             src="@/img/send.svg"
        >
      </button>
    </div>
    <div class="catItems"
         @dragstart="dd.handleDragStart" @dragend="dd.handleDragEnd" @dragenter="dd.handleDragEnter"
         @dragover="dd.handleDragOver"
    >
      <TransitionGroup name="transition-draggable-group">
        <div v-for="(parentCat, parentIndex) in catsG.items" :key="parentCat.id">
          <AdminCatsItemBlock :parentIndex=parentIndex :childIndex="null"/>
        </div>
      </TransitionGroup>
    </div>

    <transition name="transition-fade">
      <AdminCatsTextEditor v-if="textEditor.isActive"/>
    </transition>
    <transition name="transition-fade">
      <AdminCatsPropsEditor v-if="propsEditor.isActive"/>
    </transition>
  </div>
</template>

