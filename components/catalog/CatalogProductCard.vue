<script setup>
const props = defineProps({
  prod: Object,
})

const config = useRuntimeConfig()
const imagesDirectory = config.public.IMAGES_DIRECTORY

const showFullImage = () => {
  showImageViewer([props.prod.image], { causerId: 'img_' + props.prod.id })
}

const copied = ref(false)
const copyId = () => {
  navigator.clipboard.writeText(props.prod.id)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] bg-cyan-500 rounded-lg hover:shadow">
    <div class="col-span-1 row-span-2 self-center p-2 flex justify-center items-center w-20 @md:h-20">
      <img
        :src="`${imagesDirectory}thumb_${prod.image}`"
        :alt="prod.name"
        :id="'img_' + prod.id"
        class="w-auto h-auto max-w-full max-h-full rounded-lg cursor-zoom-in"
        @click="showFullImage"
      />
    </div>
    <div class="col-span-2 row-span-1 p-2 @md:col-span-1 @md:row-span-2">
      <div class="w-fit relative flex">
        <div class="text-sm">{{ prod.id }}</div>
        <UButton
          :padded="false"
          :color="copied ? 'green' : 'gray'"
          variant="link"
          size="2xs"
          class="px-1"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          @click="copyId"
        />

        <div
          v-if="prod.label"
          class="absolute left-full -top-2 w-max -rotate-3 origin-bottom-left flex items-center ml-2"
        >
          <img
            :src="getDynamicAsset('/img/labels/' + prod.label.image)"
            class="h-8 w-auto"
          />
          <div class="bg-fuchsia-400 p-0.5 rounded">
            <div class="border border-dashed border-white text-white leading-tight px-2">
              {{ prod.label.name }}
            </div>
          </div>
        </div>
      </div>
      <NuxtLink
        :to="'/product/' + prod.alias"
        class="mt-0.5 leading-5 block w-fit text-lg"
      >
        {{ prod.name }}
      </NuxtLink>
    </div>
    <div
      class="col-span-2 row-span-1 m-2 flex flex-wrap gap-2 justify-end items-center @md:col-span-1 @md:row-span-2 @md:w-28 @md:mt-7 @xl:w-auto @xl:mt-2 @xl:flex-nowrap"
    >
      <div class="w-28 shrink-0 grow-0 relative">
        <div
          v-if="prod.priceRegular"
          class="absolute bottom-full right-0 text-sm leading-none line-through opacity-70"
        >
          {{ prod.priceRegular.toLocaleString() + ' ₽' }}
        </div>
        <div class="text-xl leading-none float-right">{{ prod.price.toLocaleString() + ' ₽' }}</div>
      </div>
      <div class="cartBtn w-28 shrink-0 grow-0">
        <ClientOnly>
          <CatalogCartButton :prod="prod" />
          <template #fallback>
            <UButton
              label="В корзину"
              variant="outline"
              icon="i-heroicons-shopping-cart"
            />
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
