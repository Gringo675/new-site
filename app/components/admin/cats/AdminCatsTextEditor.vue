<script setup>
import catsG from '~/composables/admin/cats/catsG'
import textEditor from '~/composables/admin/cats/textEditor'
import catFields from '~/composables/admin/cats/catFields'

const cat = catsG.getCat(textEditor.indexes)
const content = ref(cat[textEditor.field])
const title = `${catFields.find(field => field.name === textEditor.field).nameRU} - ${cat.name}`

const saveChanges = () => {
  if (content.value !== cat[textEditor.field]) {
    cat[textEditor.field] = content.value
    catsG.handleChanges(cat.id, textEditor.field, content.value)
    if (textEditor.field === 'name') createAlias(content.value)
  }
  textEditor.hide()
}

const createAlias = async name => {
  if (cat.alias?.length) {
    const proceed = await showMessage({
      title: 'Обновить алиас категории?',
      description: `<p>Будет создан новый алиас из наименования "${name}".</p><p>Продолжаем?</p>`,
      isDialog: true,
    })
    if (!proceed) return
  }
  cat.alias = slugify(name)
  catsG.handleChanges(cat.id, 'alias', cat.alias)
}
</script>

<template>
  <transition name="transition-fade">
    <HelperModalWrapper>
      <div class="modal-form flex w-[1000px] max-w-[95%] flex-col justify-start overflow-auto rounded-xl border border-amber-900">
        <div class="flex flex-row items-center justify-between bg-orange-300 p-2.5">
          <div class="size max-w-full overflow-hidden text-xl text-ellipsis whitespace-nowrap">{{ title }}</div>

          <button
            @click="textEditor.hide"
            class="inline-flex opacity-70 hover:opacity-100 focus:outline-hidden focus-visible:outline-0">
            <UIcon
              name="i-heroicons-x-circle"
              class="h-8 w-8" />
          </button>
        </div>
        <div class="overflow-auto bg-amber-100 p-5">
          <UTextarea
            v-model.lazy="content"
            class=""
            color="secondary"
            placeholder="Пусто..."
            textareaClass="w-full h-96 max-h-[calc(100vh-200px)] bg-gray-50"
            :autofocus="true" />
          <!-- <textarea
            v-model="content"
            class="w-full h-96 max-h-[calc(100vh-200px)]"
          ></textarea> -->
        </div>
        <div class="flex justify-end gap-4 bg-orange-200 p-2.5">
          <UButton
            label="Отмена"
            variant="outline"
            color="secondary"
            @click="textEditor.hide()" />
          <UButton
            label="Ok"
            color="secondary"
            class="mr-4 px-8"
            @click="saveChanges" />
        </div>
      </div>
    </HelperModalWrapper>
  </transition>
</template>

<style></style>
