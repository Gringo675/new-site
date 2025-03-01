<script setup>
// хелпер для вставки ресопнсив шаблона с боковой колонкой
</script>

<template>
  <div class="grid grid-cols-12 gap-x-2">
    <aside class="col-span-3 -lg:col-span-4 -md:col-span-12">
      <slot name="aside" />
    </aside>
    <div class="col-span-9 -lg:col-span-8 -md:col-span-12">
      <slot />
    </div>
  </div>
</template>
