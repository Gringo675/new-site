<script setup>
//
const { item } = defineProps({
  item: Object,
  showViewer: Function,
})
</script>

<template>
  <div class="rounded-lg border border-cyan-200 bg-cyan-50 p-2">
    <div>{{ item.title }}</div>
    <div class="mt-2 flex flex-wrap gap-2">
      <UButton
        v-for="button in item.buttons"
        :label="button.label"
        variant="outline"
        truncate
        class="max-w-full"
        @click="showViewer(item.title, button.url)"
      />
    </div>
  </div>
</template>
