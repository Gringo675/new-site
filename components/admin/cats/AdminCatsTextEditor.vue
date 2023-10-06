<script setup>
import catsG from '~/composables/admin/cats/catsG'
import textEditor from '~/composables/admin/cats/textEditor'

const cat = catsG.getCat(textEditor.indexes)
const content = ref(cat[textEditor.field])
const title = `${textEditor.fieldRU} - ${cat.name}`

const saveChanges = () => {
  if (content.value !== cat[textEditor.field]) {
    cat[textEditor.field] = content.value
    catsG.handleChanges(cat.id, textEditor.field, content.value)
  }
  textEditor.hide()
}
</script>

<template>
  <transition name="transition-fade">
    <HelperModalWrapper>
      <div
        class="modal-form w-[1000px] max-w-[95%] border border-amber-900 rounded-xl overflow-auto flex flex-col justify-start"
      >
        <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5">
          <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">{{ title }}</div>
          <div
            class="bg-[url('/img/x-circle.svg')] bg-center bg-no-repeat bg-contain w-7 h-7 ml-2 flex-shrink-0 cursor-pointer hover:scale-90 transition-transform"
            @click="textEditor.hide()"
          ></div>
        </div>
        <div class="p-5 overflow-auto bg-amber-100">
          <textarea
            v-model="content"
            class="w-full h-96 max-h-[calc(100vh-200px)]"
          ></textarea>
        </div>
        <div class="p-2.5 bg-orange-200 flex justify-end items-center">
          <button
            @click="textEditor.hide()"
            class="button px-2 py-1"
          >
            Cancel
          </button>
          <button
            class="button px-2 py-1"
            @click="saveChanges"
          >
            OK
          </button>
        </div>
      </div>
    </HelperModalWrapper>
  </transition>
</template>

<style></style>
