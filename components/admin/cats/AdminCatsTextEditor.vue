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
  const replacer = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'jo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ' ': '-',
    '\\': '',
    '/': '',
  }
  cat.alias = ''
  for (let i = 0; i < name.length; i++) {
    const symbol = name[i].toLowerCase()
    cat.alias += replacer[symbol] ?? symbol
  }
  catsG.handleChanges(cat.id, 'alias', cat.alias)
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

          <button
            @click="textEditor.hide"
            class="inline-flex opacity-70 hover:opacity-100 focus:outline-none focus-visible:outline-0"
          >
            <UIcon
              name="i-heroicons-x-circle"
              class="h-8 w-8"
            />
          </button>
        </div>
        <div class="p-5 overflow-auto bg-amber-100">
          <UTextarea
            v-model.lazy="content"
            class=""
            color="secondary"
            placeholder="Пусто..."
            textareaClass="w-full h-96 max-h-[calc(100vh-200px)] bg-gray-50"
            :autofocus="true"
          />
          <!-- <textarea
            v-model="content"
            class="w-full h-96 max-h-[calc(100vh-200px)]"
          ></textarea> -->
        </div>
        <div class="p-2.5 bg-orange-200 flex justify-end gap-4">
          <UButton
            label="Отмена"
            variant="outline"
            color="secondary"
            @click="textEditor.hide()"
          />
          <UButton
            label="Ok"
            color="secondary"
            class="px-8 mr-4"
            @click="saveChanges"
          />
        </div>
      </div>
    </HelperModalWrapper>
  </transition>
</template>

<style></style>
