<script setup>
//
const { item } = defineProps({
  item: Object,
})
</script>

<template>
  <div class="rounded-lg border border-orange-200 bg-orange-50 p-2">
    <div>{{ item.title }}</div>
    <div class="mt-2 flex flex-wrap gap-2">
      <UButton
        v-for="button in item.buttons"
        :label="button.label"
        variant="outline"
        truncate
        class="max-w-full"
        @click="showDocViewer({ title: item.title, url: button.url })"
      />
    </div>
  </div>
</template>
