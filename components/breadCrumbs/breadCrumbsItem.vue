<script setup>
//
const props = defineProps({
  crumb: Object,
  noLink: Boolean,
})

const showSiblings = ref(false)
</script>

<template>
  <div class="flex mx-2">
    <div
      v-if="crumb.siblings.length > 0"
      class="mr-2"
    >
      <button
        @click="showSiblings = !showSiblings"
        class="rotate-90 px-2 rounded border border-gray-400"
        :class="{
          '-rotate-90': showSiblings,
        }"
      >
        >
      </button>
      <div
        v-if="showSiblings"
        class="absolute flex flex-col bg-slate-200 rounded p-2"
      >
        <NuxtLink
          v-for="sibling in crumb.siblings"
          :to="'/catalog/' + sibling.alias"
          >{{ sibling.name }}</NuxtLink
        >
      </div>
    </div>
    <span v-if="noLink">{{ crumb.name }}</span>
    <template v-else>
      <NuxtLink :to="'/catalog/' + crumb.alias">{{ crumb.name }}</NuxtLink>
      <span class="ml-2">></span>
    </template>
  </div>
</template>
