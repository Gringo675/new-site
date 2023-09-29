<script setup>
//
const props = defineProps({
  cat: Object,
})
</script>

<template>
  <div>
    <NuxtLink
      :to="'/catalog/' + cat.alias"
      class="block m-2 p-2 rounded-md bg-fuchsia-300 w-60"
      >{{ cat.name }}</NuxtLink
    >
    <div
      v-if="cat.children"
      class="ml-3"
    >
      <CatsMenuItem
        v-for="child in cat.children"
        :cat="child"
      />
    </div>
  </div>
</template>
