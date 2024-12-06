<script setup>
//
const menu = reactive({
  show: false,
  ref: useTemplateRef('my-ref'),
})

// const elementRef = useTemplateRef('my-ref')

const clickHandler = () => {
  menu.show = !menu.show
  const aaa = menu.ref.getBoundingClientRect()
  console.log(`aaa: ${JSON.stringify(aaa, null, 2)}`)
}
</script>

<template>
  <h1>test1</h1>
  <div>
    <UButton
      ref="my-ref"
      label="Show"
      @click="clickHandler"
    />
  </div>
</template>
