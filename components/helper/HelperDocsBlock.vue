<script setup>
// блок для показа документации на странице категории и товара
const { docs } = defineProps({
  docs: Object,
})
const fileFolder = 'https://chelinstrument.ru/docs/'
const viewer = reactive({
  show: false,
  title: '',
  src: '',
})
const showViewer = (title, src) => {
  viewer.title = title
  viewer.src = src + '#toolbar=0'
  viewer.show = true
}
</script>

<template>
  <div class="w-full p-2 border border-gray-200 rounded-lg bg-gray-100">
    <h2>Документация</h2>
    <template
      v-if="docs.stnd?.length"
      class=""
    >
      <div
        v-for="stnd in docs.stnd"
        class="my-2 p-2 border border-gray-400 rounded-lg bg-gray-200"
      >
        <!-- title -->
        <div>{{ stnd.number }} {{ stnd.name }}</div>
        <!-- file -->
        <UButton
          v-if="stnd.file?.length"
          :label="'Открыть ' + stnd.number"
          variant="outline"
          color="secondary"
          @click="showViewer(`${stnd.number} ${stnd.name}`, `${fileFolder}stnd/${stnd.file}`)"
        />
      </div>
    </template>
    <template v-if="docs.rstr?.length">
      <div
        v-for="rstr in docs.rstr"
        class="my-2 p-2 border border-gray-400 rounded-lg bg-gray-200"
      >
        <!-- title -->
        <!-- в базе есть пустые записи ' ', поэтому > 1 -->
        <div>
          Госреестр №{{ rstr.number }} {{ rstr.name }}{{ rstr.type_si?.length > 1 ? ` тип - ${rstr.type_si}` : '' }}.
          {{ rstr.brand?.length > 1 ? ` Изготовитель: ${rstr.brand}.` : ''
          }}{{ rstr.date?.length > 1 ? ` Срок свидетельства: ${parseIsoDate(rstr.date)}` : '' }}
        </div>
        <!-- files -->
        <div class="flex gap-2">
          <UButton
            v-if="rstr.file_svid?.length"
            :label="'Открыть свидетельство об утверждении типа'"
            variant="outline"
            color="secondary"
            @click="showViewer(`Госреестр №${rstr.number} ${rstr.name}`, `${fileFolder}rstr/${rstr.file_svid}`)"
          />
          <UButton
            v-if="rstr.file_ot?.length"
            :label="'Открыть описание типа'"
            variant="outline"
            color="secondary"
            @click="showViewer(`Госреестр №${rstr.number} ${rstr.name}`, `${fileFolder}rstr/${rstr.file_ot}`)"
          />
          <UButton
            v-if="rstr.file_mp?.length"
            :label="'Открыть методику поверки'"
            variant="outline"
            color="secondary"
            @click="showViewer(`Госреестр №${rstr.number} ${rstr.name}`, `${fileFolder}rstr/${rstr.file_mp}`)"
          />
        </div>
      </div>
    </template>
    <template
      v-if="docs.pasp?.length"
      class=""
    >
      <div
        v-for="pasp in docs.pasp"
        class="my-2 p-2 border border-gray-400 rounded-lg bg-gray-200"
      >
        <!-- title -->
        <div>{{ pasp.name }}</div>
        <!-- file -->
        <UButton
          v-if="pasp.file?.length"
          :label="'Открыть паспорт'"
          variant="outline"
          color="secondary"
          @click="showViewer(`${pasp.name}`, `${fileFolder}pasp/${pasp.file}`)"
        />
      </div>
    </template>
  </div>
  <!-- viewer -->
  <Transition name="transition-fade">
    <div
      v-if="viewer.show"
      class="fixed left-0 top-0 right-0 bottom-0 bg-gray-900/90 z-30 overflow-hidden"
      @click="viewer.show = false"
      v-focus
      tabindex="-1"
    >
      <!-- spinner -->
      <div class="h-full flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
        >
          <path
            class="fill-secondary-400"
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
      <div class="flex flex-col w-[1200px] max-w-full h-full m-auto -translate-y-full">
        <!-- title -->
        <div class="text-3xl text-slate-200 flex justify-between">
          <span class="m-2 truncate">
            {{ viewer.title }}
          </span>
          <button class="m-2 opacity-80 hover:opacity-100 focus:outline-none focus-visible:outline-0">
            <UIcon
              name="i-heroicons-x-circle"
              class="h-10 w-10 block"
            />
          </button>
        </div>
        <iframe
          class="w-full flex-grow"
          :src="viewer.src"
          frameborder="0"
          scrolling="no"
          >Похоже, Вы используете устаревший браузер.</iframe
        >
      </div>
    </div>
  </Transition>
</template>
