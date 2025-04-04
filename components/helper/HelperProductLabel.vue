<script setup lang="ts">
//
interface Label {
  id: number
  description: string
  image: string
  name: string
}

const { labelId } = defineProps({
  labelId: Number,
  forProduct: { type: Boolean, default: false },
})

const { data: label } = await useAsyncData(`label-${labelId}`, () => $fetch<Label>('/api/getLabel?id=' + labelId), {
  dedupe: 'defer',
  getCachedData: key => useNuxtData(key).data?.value,
  deep: false,
})
</script>

<template>
  <div
    class="absolute -top-2 left-full ml-2 flex w-max origin-bottom-left cursor-default items-center"
    :class="[!forProduct && '-rotate-3']"
    :title="label.description"
  >
    <img
      :src="getDynamicAsset('/img/labels/' + label.image)"
      class="h-8 w-auto"
    />
    <div class="rounded bg-fuchsia-400 p-0.5">
      <div class="border border-dashed border-white px-2 leading-tight text-white">
        {{ label.name }}
      </div>
    </div>
  </div>
</template>
