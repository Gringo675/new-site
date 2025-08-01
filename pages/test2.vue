<script setup>
//

const items = 4
</script>

<template>
  <div class="menu-scrollbar m-2 flex gap-2 overflow-auto bg-amber-200 p-2">
    <div
      v-for="item in items"
      :key="item"
      class="h-10 w-100 min-w-80 bg-fuchsia-300 p-2">
      {{ item }}
    </div>
  </div>
</template>
