<script setup>
//
const ui = /*ui*/ {
  background: 'bg-white dark:bg-slate-900',
}
</script>

<template>
  <UCard :ui="ui" />
  <HelperAsideGrid>
    <template #aside>
      <div class="w-full h-[400px] bg-red-500"></div>
    </template>
    <div class="w-full h-[500px] bg-blue-500"></div>
  </HelperAsideGrid>
</template>
