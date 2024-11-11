<script setup>
//
const props = defineProps({
  store: Object,
})
const onClick = () => {
  props.store.show = false
  props.store.resolve(true)
}
</script>

<template>
  <h1>TheTest</h1>
  <div>
    <UButton
      label="Test"
      @click="onClick"
    />
  </div>
  <p>props: {{ props }}</p>
</template>
