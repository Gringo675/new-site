<script setup>
// хелпер для вставки ресопнсив шаблона с боковой колонкой
</script>

<template>
  <div class="grid grid-cols-4 gap-x-2">
    <aside class="col-span-1 -md:col-span-4">
      <slot name="aside" />
    </aside>
    <div class="col-span-3 -md:col-span-4">
      <slot />
    </div>
  </div>
</template>
