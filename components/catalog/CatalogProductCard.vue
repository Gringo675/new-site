<script setup>
const props = defineProps({
  prod: Object,
})

const productImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_products/'

const showFullImage = () => {
  showImageViewer([`${productImagesDirectory}full_${props.prod.image}`], { causerId: 'img_' + props.prod.id })
}
</script>

<template>
  <div
    class="cardContainer grid grid-cols-[auto_1fr_auto] grid-rows-[min-content_auto] overflow-hidden rounded-lg border border-fuchsia-400 bg-rose-100 hover:shadow-xs"
  >
    <div
      class="imageBlock col-span-1 row-span-2 flex w-20 items-center justify-center self-center bg-green-400 p-2 @md:h-20"
    >
      <img
        :src="`${productImagesDirectory}thumb_${prod.image}`"
        :alt="prod.name"
        :id="'img_' + prod.id"
        class="h-auto max-h-full w-auto max-w-full cursor-zoom-in rounded-lg"
        @click="showFullImage"
      />
    </div>
    <div
      class="infoBlock -order-1 col-span-3 row-span-1 border-b-2 border-fuchsia-200 bg-fuchsia-100 p-2 @xs:order-none @xs:col-span-2 @md:col-span-1 @md:row-span-2"
    >
      <div class="flex h-5 items-center gap-2">
        <UIcon
          name="i-material-symbols-barcode"
          class="size-5 shrink-0"
        />
        <div class="shrink-0 text-sm">{{ prod.id }}</div>
        <HelperProductLabel
          v-if="prod.label > 0"
          :labelId="prod.label"
        />
      </div>
      <NuxtLink
        :to="'/product/' + prod.alias"
        class="mt-0.5 block min-h-10 w-fit text-lg leading-5"
      >
        {{ prod.name }}
      </NuxtLink>
    </div>
    <div
      class="buyBlock col-span-2 row-span-2 m-2 flex flex-wrap content-end items-center justify-end gap-2 self-end @md:col-span-1 @md:row-span-2 @md:mt-7 @md:w-28 @xl:mt-2 @xl:w-auto @xl:flex-nowrap"
    >
      <div class="relative w-28 shrink-0 grow-0">
        <div
          v-if="prod.priceRegular"
          class="absolute right-0 bottom-full text-sm leading-none line-through opacity-70"
        >
          {{ prod.priceRegular.toLocaleString() + ' ₽' }}
        </div>
        <div class="float-right rounded-2xl bg-green-200 px-3 py-2 text-xl leading-none">
          {{ prod.price.toLocaleString() + ' ₽' }}
        </div>
      </div>
      <div class="w-28 shrink-0 grow-0">
        <CatalogCartButton :prod="prod" />
      </div>
    </div>
  </div>
</template>
