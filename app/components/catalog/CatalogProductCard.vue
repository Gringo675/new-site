<script setup>
const props = defineProps({
  prod: Object,
})

const showFullImage = () => {
  showImageViewer([`/static/img/products/full_${props.prod.image}`], {
    causerId: 'img_' + props.prod.id,
  })
}
</script>

<template>
  <div
    class="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_min-content] overflow-hidden rounded-lg border border-slate-400 bg-slate-100">
    <div
      class="col-span-3 row-span-1 flex flex-col items-start border-b border-slate-300 bg-gradient-to-r from-slate-100 via-slate-200 via-20% to-slate-100 px-2 py-3 @xs:col-span-2 @lg:col-span-1 @lg:row-span-2 @lg:border-b-0">
      <div class="mb-0.5 flex h-5 items-center gap-2">
        <UIcon
          name="i-material-symbols-barcode"
          class="size-5 shrink-0" />
        <div class="shrink-0 text-sm/[15px]">{{ prod.id }}</div>
        <HelperProductLabel
          v-if="prod.label > 0"
          :labelId="prod.label" />
      </div>
      <NuxtLink
        :to="'/product/' + prod.alias"
        class="my-auto block leading-5 text-indigo-500 underline-offset-4 hover:underline @2xs:text-lg">
        {{ prod.name }}
      </NuxtLink>
    </div>
    <div
      class="col-span-1 row-span-1 flex h-28 w-20 items-center justify-center self-center p-2 @xs:-order-1 @xs:row-span-2 @xs:h-auto">
      <img
        :src="`/static/img/products/thumb_${prod.image}`"
        :alt="prod.name"
        :id="'img_' + prod.id"
        class="h-auto max-h-full w-auto max-w-full cursor-zoom-in rounded-lg"
        @click="showFullImage" />
    </div>

    <div
      class="col-span-2 row-span-1 my-3 mr-2 ml-0 flex flex-col items-center justify-end gap-x-3 self-end @xs:@max-lg:flex-row @lg:col-span-1 @lg:row-span-2 @lg:ml-2 @lg:self-center @2xl:flex-row">
      <div
        class="relative my-3 shrink-0 grow-0 self-end rounded-2xl bg-slate-400 px-3 py-2 text-lg leading-none whitespace-nowrap text-slate-50">
        <span class=""> {{ formatPrice(prod.price) }}</span>
        <div
          v-if="prod.priceRegular"
          class="absolute -top-4 right-1 rounded-full bg-gradient-to-b from-fuchsia-400 to-fuchsia-300 px-2 py-1 text-xs leading-none line-through">
          {{ formatPrice(prod.priceRegular) }}
        </div>
      </div>
      <CatalogCartButton
        :prod="prod"
        class="w-28 @lg:@max-2xl:w-30" />
    </div>
  </div>
</template>
