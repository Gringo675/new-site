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
    <!-- viewer -->
    <Transition name="transition-fade">
      <div
        v-if="viewer.show"
        class="fixed bottom-0 left-0 right-0 top-0 z-30 overflow-hidden bg-gray-900/90"
        @click="viewer.show = false"
        v-focus
        tabindex="-1"
      >
        <!-- spinner -->
        <div class="flex h-full flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
          >
            <path
              class="fill-cyan-400"
              d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        </div>
        <!-- document block -->
        <div class="m-auto flex h-full w-[1200px] max-w-full -translate-y-full flex-col">
          <!-- title -->
          <div class="flex justify-between text-3xl text-slate-200">
            <span class="m-2 truncate">
              {{ viewer.title }}
            </span>
            <button class="m-2 opacity-80 hover:opacity-100 focus:outline-hidden focus-visible:outline-0">
              <UIcon
                name="i-heroicons-x-circle"
                class="block h-10 w-10"
              />
            </button>
          </div>
          <iframe
            class="w-full grow"
            :src="viewer.src"
            frameborder="0"
            scrolling="no"
            >Похоже, Вы используете устаревший браузер.</iframe
          >
        </div>
      </div>
    </Transition>
  </div>
</template>
