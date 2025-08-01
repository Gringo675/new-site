<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex h-full gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-md">
    <Icon
      :name="item.icon"
      class="size-12 flex-none text-violet-500" />
    <div class="">
      <h4 class="font-accent mb-2 border-b border-violet-500 pb-2 text-2xl text-violet-500">{{ item.title }}</h4>
      <div>
        <div class="font-semibold text-orange-900">{{ item.description }}</div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
