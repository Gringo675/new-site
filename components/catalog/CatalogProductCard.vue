<script setup>
const props = defineProps({
  prod: Object,
})

const config = useRuntimeConfig()
const imagesDirectory = config.public.IMAGES_DIRECTORY
</script>

<template>
  <div class="flex items-center bg-rose-100 rounded-lg my-2 hover:shadow hover:bg-rose-200">
    <div class="image flex justify-center items-center w-20 h-20 p-2">
      <img
        :src="`${imagesDirectory}thumb_${prod.image}`"
        :alt="prod.name"
        class="w-auto h-auto max-w-full max-h-full rounded-lg"
      />
    </div>
    <div class="descr grow p-2 self-start">
      <div class="w-fit relative flex">
        <div class="text-sm">{{ prod.id }}</div>
        <UButton
          :padded="false"
          color="gray"
          variant="link"
          size="2xs"
          class="px-1"
          icon="i-material-symbols-content-copy-outline-rounded"
        />
        <div
          v-if="prod.label"
          class="absolute left-full -top-2 w-max -rotate-2 origin-bottom-left flex items-center ml-2"
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
        class="text-lg"
      >
        {{ prod.name }}
      </NuxtLink>
    </div>
    <div class="price m-2 w-28 relative">
      <div
        v-if="prod.priceRegular"
        class="absolute bottom-full right-1 text-sm leading-none line-through"
      >
        {{ prod.priceRegular.toLocaleString() + ' ₽' }}
      </div>
      <div class="text-xl float-right">{{ prod.price.toLocaleString() + ' ₽' }}</div>
    </div>
    <div class="cartBtn m-2 w-28">
      <ClientOnly>
        <CatalogCartButton :prod="prod" />
      </ClientOnly>
    </div>
  </div>
</template>
