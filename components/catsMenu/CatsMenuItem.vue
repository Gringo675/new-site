<script setup>
//
const props = defineProps({
  cat: Object,
})

const childMenuState = reactive({
  show: false,
  maxHeight: '500px',
  parentRef: useTemplateRef('menu-ref'),
})
</script>

<template>
  <div
    @mouseover="childMenuState.show = true"
    @mouseleave="childMenuState.show = false"
    class=""
  >
    <NuxtLink
      :to="'/catalog/' + cat.alias"
      class="block m-2 p-2 rounded-md bg-fuchsia-300 w-60"
      >{{ cat.name }}
    </NuxtLink>
    <div
      v-if="cat.children"
      v-show="childMenuState.show"
      class="absolute left-[200px] top-10 border border-stone-500"
    >
      <CatsMenuItem
        v-for="cat in cat.children"
        :cat
      />
    </div>
  </div>
</template>
