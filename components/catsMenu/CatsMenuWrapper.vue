<script setup>
//
const { data: cats } = await useCats()

const menuState = reactive({
  show: false,
  maxHeight: '500px',
  ref: useTemplateRef('menu-ref'),
})
const handleShowMenuClick = () => {
  if (menuState.show) return
  menuState.maxHeight = `${window.innerHeight - menuState.ref.getBoundingClientRect().bottom - 30}px`
  menuState.show = true
  setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
}
</script>

<template>
  <div
    ref="menu-ref"
    class="z-20"
  >
    <UButton
      label="Каталог"
      @click="handleShowMenuClick"
    />
    <Transition name="transition-dive">
      <div
        v-show="menuState.show"
        class="absolute w-max mt-2 bg-fuchsia-200 rounded-md overflow-auto"
        :style="{ maxHeight: menuState.maxHeight }"
      >
        <CatsMenuItem
          v-for="cat in cats"
          :cat
        />
      </div>
    </Transition>
  </div>
</template>

<style></style>
