<script setup>
//

const { items } = defineProps({
  items: Array,
})

const menuState = reactive({
  show: false,
  maxHeight: '',
  maxWidth: '',
  ref: useTemplateRef('menu-ref'),
})
const handleShowSiblingsClick = () => {
  if (menuState.show) return
  menuState.maxHeight = `${window.innerHeight - menuState.ref.getBoundingClientRect().bottom - 30}px`
  menuState.maxWidth = `${window.innerWidth - menuState.ref.getBoundingClientRect().left - 25}px`
  menuState.show = true
  setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
}
</script>

<template>
  <div
    ref="menu-ref"
    class="relative"
  >
    <UButton
      icon="i-heroicons-chevron-down"
      :ui="{ rounded: 'rounded-full' }"
      class="p-1"
      variant="outline"
      @click="handleShowSiblingsClick"
    />
    <Transition name="transition-below">
      <div
        v-if="menuState.show"
        class="absolute z-20 mt-2 rounded-lg border border-gray-300 bg-gray-200 p-2"
      >
        <div
          class="menu-scrollbar flex w-max flex-col gap-2 overflow-auto pr-2"
          :style="{ maxHeight: menuState.maxHeight, maxWidth: menuState.maxWidth }"
        >
          <NuxtLink
            v-for="item in items"
            :to="'/catalog/' + item.alias"
            class="underline-offset-4 hover:underline"
            :class="{ 'cursor-default font-bold hover:no-underline': item.current }"
            >{{ item.name }}</NuxtLink
          >
        </div>
      </div>
    </Transition>
  </div>
</template>
