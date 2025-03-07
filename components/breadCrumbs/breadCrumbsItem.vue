<script setup>
//
const props = defineProps({
  crumb: Object,
  noLink: Boolean,
})

const menuState = reactive({
  show: false,
  maxHeight: '500px',
  ref: useTemplateRef('menu-ref'),
})
const handleShowSiblingsClick = () => {
  if (menuState.show) return
  menuState.maxHeight = `${window.innerHeight - menuState.ref.getBoundingClientRect().bottom - 30}px`
  menuState.show = true
  setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
}
</script>

<template>
  <div class="flex gap-x-2 items-center">
    <div
      v-if="crumb.siblings"
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
      <!-- <UIcon
          name="i-heroicons-slash"
          class="w-6 h-6"
        /> -->
      <!-- </UButton> -->
      <Transition name="transition-below">
        <div
          v-if="menuState.show"
          class="absolute bg-gray-200 border border-gray-300 rounded-lg mt-2 p-2 z-20"
        >
          <div
            class="flex flex-col gap-2 w-max pr-2 overflow-auto menu-scrollbar"
            :style="{ maxHeight: menuState.maxHeight }"
          >
            <NuxtLink
              v-for="sibling in crumb.siblings"
              :to="'/catalog/' + sibling.alias"
              :class="{ 'font-bold cursor-default': sibling.current }"
              >{{ sibling.name }}</NuxtLink
            >
          </div>
        </div>
      </Transition>
    </div>
    <UIcon
      v-else
      name="i-heroicons-slash"
      class="w-6 h-6"
    />
    <span v-if="noLink">{{ crumb.name }}</span>
    <NuxtLink
      v-else
      :to="'/catalog/' + crumb.alias"
      >{{ crumb.name }}</NuxtLink
    >
  </div>
</template>
