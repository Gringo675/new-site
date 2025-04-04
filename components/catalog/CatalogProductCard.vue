<script setup>
const props = defineProps({
  prod: Object,
})

const productImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_products/'

const showFullImage = () => {
  showImageViewer([`${productImagesDirectory}full_${props.prod.image}`], { causerId: 'img_' + props.prod.id })
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
  <div class="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] rounded-lg bg-cyan-500 hover:shadow">
    <div class="col-span-1 row-span-2 flex w-20 items-center justify-center self-center p-2 @md:h-20">
      <img
        :src="`${productImagesDirectory}thumb_${prod.image}`"
        :alt="prod.name"
        :id="'img_' + prod.id"
        class="h-auto max-h-full w-auto max-w-full cursor-zoom-in rounded-lg"
        @click="showFullImage"
      />
    </div>
    <div class="-order-1 col-span-3 row-span-1 p-2 @xs:order-none @xs:col-span-2 @md:col-span-1 @md:row-span-2">
      <div class="relative flex w-fit">
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
        <HelperProductLabel
          v-if="prod.label > 0"
          :labelId="prod.label"
        />
        <!-- <div
          v-if="prod.label"
          class="absolute -top-2 left-full ml-2 flex w-max origin-bottom-left -rotate-3 items-center"
        >
          <img
            :src="getDynamicAsset('/img/labels/' + prod.label.image)"
            class="h-8 w-auto"
          />
          <div class="rounded bg-fuchsia-400 p-0.5">
            <div class="border border-dashed border-white px-2 leading-tight text-white">
              {{ prod.label.name }}
            </div>
          </div>
        </div> -->
      </div>
      <NuxtLink
        :to="'/product/' + prod.alias"
        class="mt-0.5 block w-fit text-lg leading-5"
      >
        {{ prod.name }}
      </NuxtLink>
    </div>
    <div
      class="col-span-2 row-span-1 m-2 flex flex-wrap content-end items-center justify-end gap-2 @md:col-span-1 @md:row-span-2 @md:mt-7 @md:w-28 @xl:mt-2 @xl:w-auto @xl:flex-nowrap"
    >
      <div class="relative w-28 shrink-0 grow-0">
        <div
          v-if="prod.priceRegular"
          class="absolute bottom-full right-0 text-sm leading-none line-through opacity-70"
        >
          {{ prod.priceRegular.toLocaleString() + ' ₽' }}
        </div>
        <div class="float-right text-xl leading-none">
          {{ prod.price.toLocaleString() + ' ₽' }}
        </div>
      </div>
      <div class="w-28 shrink-0 grow-0">
        <CatalogCartButton :prod="prod" />
      </div>
    </div>
  </div>
</template>
