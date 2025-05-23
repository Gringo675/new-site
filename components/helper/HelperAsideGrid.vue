<script setup>
// хелпер для вставки ресопнсив шаблона с боковой колонкой
defineProps({
  reverse: {
    // делает боковую колонку справа
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex gap-4 max-md:flex-wrap">
    <aside
      class="w-full md:w-1/4 md:min-w-70"
      :class="reverse && 'order-last'"
    >
      <slot name="aside" />
    </aside>
    <div class="grow"><slot /></div>
  </div>
</template>
