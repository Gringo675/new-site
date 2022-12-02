<script setup>

const {data: cats} = await useCats()

const showMenu = ref(false)


</script>

<template>
  <div class="relative">
    <button @click="showMenu = !showMenu"
            class="m-2 p-2 bg-orange-300 rounded-md"
    >
      Каталог
    </button>
    <div v-show="showMenu" @click="showMenu = false"
         class="absolute top-14 left-2 bg-fuchsia-200 rounded-md z-20 max-h-[500px] overflow-auto"
    >
      <div v-for="cat in cats"
           class=""
      >
        <NuxtLink :to="'/catalog/' + cat.alias"
                  class="block m-2 p-2 rounded-md bg-fuchsia-300 w-60 "
        >{{ cat.name }}</NuxtLink>
        <div v-for="child in cat.children"
             class="ml-5"
        >
          <NuxtLink :to="'/catalog/' + child.alias"
                    class="block m-2 p-2 rounded-md bg-fuchsia-300 w-60 "
          >{{ child.name }}</NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<style>

</style>