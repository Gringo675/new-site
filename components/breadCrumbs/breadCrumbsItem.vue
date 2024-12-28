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
        class="m-0 px-0 py-1"
        color="gray"
        variant="outline"
        @click="handleShowSiblingsClick"
      >
        <UIcon
          name="i-heroicons-slash"
          class="w-6 h-6"
        />
      </UButton>
      <Transition name="transition-below">
        <div
          v-if="menuState.show"
          class="absolute w-max flex flex-col gap-2 bg-slate-200 rounded-lg mt-2 p-2 z-20 overflow-auto"
          :style="{ maxHeight: menuState.maxHeight }"
        >
          <NuxtLink
            v-for="sibling in crumb.siblings"
            :to="'/catalog/' + sibling.alias"
            :class="{ 'font-bold': sibling.current }"
            >{{ sibling.name }}</NuxtLink
          >
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
