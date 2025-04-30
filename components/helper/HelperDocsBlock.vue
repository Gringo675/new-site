<script setup>
// блок для показа документации на странице категории и товара
const { docs } = defineProps({
  docs: Object,
})
const viewer = reactive({
  show: false,
  title: '',
  src: '',
})
const showViewer = (title, url) => {
  const fileFolder = 'https://chelinstrument.ru/docs/'
  viewer.title = title
  viewer.src = fileFolder + url + '#toolbar=0'
  viewer.show = true
}

const items = []
for (const stnd of docs.stnd ?? []) {
  const item = {
    title: `${stnd.number} ${stnd.name}`,
    buttons: [],
  }
  if (stnd.file) {
    item.buttons.push({
      label: `Открыть ${stnd.number}`,
      url: `stnd/${stnd.file}`,
    })
  }
  items.push(item)
}
for (const rstr of docs.rstr ?? []) {
  const item = {
    title: `Госреестр №${rstr.number} ${rstr.name}${rstr.type_si?.length > 1 ? ` тип - ${rstr.type_si}` : ''}${
      rstr.brand?.length > 1 ? ` Изготовитель: ${rstr.brand}.` : ''
    }${rstr.date?.length > 1 ? ` Срок свидетельства: ${parseIsoDate(rstr.date)}` : ''}`,
    buttons: [],
  }
  if (rstr.file_svid) {
    item.buttons.push({
      label: 'Открыть свидетельство об утверждении типа',
      url: `rstr/${rstr.file_svid}`,
    })
  }
  if (rstr.file_ot) {
    item.buttons.push({
      label: 'Открыть описание типа',
      url: `rstr/${rstr.file_ot}`,
    })
  }
  if (rstr.file_mp) {
    item.buttons.push({
      label: 'Открыть методику поверки',
      url: `rstr/${rstr.file_mp}`,
    })
  }
  items.push(item)
}
for (const pasp of docs.pasp ?? []) {
  const item = {
    title: pasp.name,
    buttons: [],
  }
  if (pasp.file) {
    item.buttons.push({
      label: 'Открыть паспорт',
      url: `pasp/${pasp.file}`,
    })
  }
  items.push(item)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelperDocsBlockItem
      v-for="item in items"
      :item="item"
      :showViewer="showViewer"
    />
  </div>
  <!-- viewer -->
  <UModal
    v-model:open="viewer.show"
    :title="viewer.title"
    fullscreen
    :ui="{
      overlay: 'bg-transparent',
      content: 'bg-gray-900/90 divide-none',
      wrapper: 'max-w-full',
      title: 'text-gray-300 text-2xl truncate pr-8',
      body: 'p-0 sm:p-0',
    }"
    :close="{
      color: 'primary',
      variant: 'link',
      icon: 'i-heroicons-x-circle',
      class: 'z-10 p-0 focus-visible:ring-0 focus-visible:outline-none',
      ui: {
        leadingIcon: 'size-8',
      },
    }"
  >
    <template #description></template>
    <template #body>
      <iframe
        class="h-full w-full"
        :src="viewer.src"
        frameborder="0"
        scrolling="no"
        type="application/pdf"
        >Похоже, Вы используете устаревший браузер.</iframe
      >
    </template>
  </UModal>
</template>
