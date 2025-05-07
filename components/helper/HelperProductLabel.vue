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
  forProduct: { type: Boolean, default: false }, // todo: delete?
})

const { data: label } = await useAsyncData(`label-${labelId}`, () => $fetch<Label>('/api/getLabel?id=' + labelId), {
  dedupe: 'defer',
  getCachedData: key => useNuxtData(key).data?.value,
  deep: false,
})
</script>

<template>
  <div
    class="flex min-w-0 shrink origin-left -rotate-2 cursor-default items-center"
    :title="label.description"
  >
    <img
      :src="getDynamicAsset('/img/labels/' + label.image)"
      class="h-6 w-auto"
    />
    <div class="min-w-0 shrink rounded-xs bg-fuchsia-400 p-0.5">
      <div class="truncate border border-dashed border-white px-2 text-sm leading-tight text-white">
        {{ label.name }}
      </div>
    </div>
  </div>
</template>
