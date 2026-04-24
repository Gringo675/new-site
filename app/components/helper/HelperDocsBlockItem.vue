<script setup>
// The parent HelperInfoBlock handles clicks
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
        :to="button.url"
        :external="true"
        :label="button.label"
        :data-title="item.title"
        variant="outline"
        truncate
        class="doc-viewer-link max-w-full" />
    </div>
  </div>
</template>
