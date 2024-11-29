<script setup>
//
const { data: cats } = await useCats()

const showMenu = ref(false)
</script>

<template>
  <div class="relative z-20">
    <button
      @click="showMenu = !showMenu"
      class="m-2 p-2 bg-orange-300 rounded-md"
    >
      Каталог
    </button>
    <div
      v-show="showMenu"
      @click="showMenu = false"
      class="absolute top-14 left-2 bg-fuchsia-200 rounded-md max-h-[500px] overflow-auto"
    >
      <CatsMenuItem
        v-for="cat in cats"
        :cat="cat"
      />
    </div>
  </div>
</template>

<style></style>
