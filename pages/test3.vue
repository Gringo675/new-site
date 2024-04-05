<script setup>
//
definePageMeta({
  layout: 'empty',
})

const files = ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
// const images = ['w1.webp', 'w2.webp', 'w3.webp']
const imagesDirectory = 'https://test.chelinstrument.ru/images/test/'

const images = reactive(
  files.map(file => {
    return {
      name: file,
      loaded: false,
    }
  })
)

onBeforeMount(() => {
  const tempImg = new Image()
  tempImg.addEventListener(
    'load',
    () => {
      images[0].loaded = true
    },
    true
  )
  tempImg.src = imagesDirectory + images[0].name
})
</script>

<template>
  <div class="w-[600px] max-w-full">
    <UCarousel
      :items="images"
      :ui="{
        item: 'basis-full justify-center p-2',
        indicators: {
          wrapper: 'relative bottom-0 mt-4 overflow-auto items-stretch bg-green-200',
        },
      }"
      indicators
      class="p-2"
    >
      <template #default="{ item }">
        <img
          v-if="item.loaded"
          :src="imagesDirectory + item.name"
          class="border border-blue-700 w-min min-w-10 object-contain shrink"
          draggable="false"
        />
        <div v-else>Loading...</div>
      </template>

      <template #indicator="{ onClick, page, active }">
        <UButton
          :label="String(page)"
          :variant="active ? 'solid' : 'outline'"
          size="2xs"
          class="rounded-full min-w-6 justify-center"
          @click="onClick(page)"
        />
        <input
          type="checkbox"
          :value="active"
          @change="console.log('changed')"
        />
      </template>
    </UCarousel>
  </div>
</template>
