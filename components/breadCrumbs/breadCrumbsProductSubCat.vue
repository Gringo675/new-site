<script setup>
//
const props = defineProps({
  subCat: Object,
  addSeparator: Boolean,
})

const menuState = reactive({
  show: false,
  maxHeight: '500px',
  ref: useTemplateRef('menu-ref'),
})
const handleShowChildrenClick = () => {
  if (menuState.show) return
  menuState.maxHeight = `${window.innerHeight - menuState.ref.getBoundingClientRect().bottom - 30}px`
  menuState.show = true
  setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <NuxtLink :to="'/catalog/' + subCat.alias">{{ subCat.name }}</NuxtLink>
    <div
      v-if="subCat.children"
      ref="menu-ref"
      class="relative"
    >
      <UButton
        class="m-0 px-0 py-1"
        color="gray"
        variant="outline"
        @click="handleShowChildrenClick"
      >
        <UIcon
          name="i-heroicons-chevron-up-down-16-solid"
          class="w-6 h-6 block"
        />
      </UButton>
      <Transition name="transition-below">
        <div
          v-if="menuState.show"
          class="absolute right-0 w-max flex flex-col gap-2 bg-slate-200 rounded-lg mt-2 p-2 z-20"
          :style="{ maxHeight: menuState.maxHeight }"
        >
          <NuxtLink
            v-for="child in subCat.children"
            :to="'/catalog/' + child.alias"
            >{{ child.name }}</NuxtLink
          >
        </div>
      </Transition>
    </div>
    <span v-if="addSeparator">|</span>
  </div>
</template>
