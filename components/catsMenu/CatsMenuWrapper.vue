<script setup>
//
const cats = JSON.parse(JSON.stringify(await useCats())) // unReactive

const showMenu = ref(false)
</script>

<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="m-2 p-2 bg-orange-300 rounded-md"
    >
      Каталог
    </button>
    <div
      v-show="showMenu"
      @click="showMenu = false"
      class="absolute top-14 left-2 bg-fuchsia-200 rounded-md z-20 max-h-[500px] overflow-auto"
    >
      <CatsMenuItem
        v-for="cat in cats"
        :cat="cat"
      />
    </div>
  </div>
</template>

<style></style>
