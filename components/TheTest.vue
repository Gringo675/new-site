<script setup>
//
const { item } = defineProps({
  item: Object,
})
</script>

<template>
  <div class="flex items-center">
    <div
      class="bg-gray-200 px-2 py-1"
      :class="{ 'translate-x-px border border-r-0 border-gray-600': item.children }"
    >
      {{ item.name }}
    </div>
    <div
      v-if="item.children"
      class="my-2 flex flex-col border border-gray-600 p-2"
    >
      <TheTest
        :item="child"
        v-for="child in item.children"
        :key="child.name"
      />
    </div>
  </div>
</template>
