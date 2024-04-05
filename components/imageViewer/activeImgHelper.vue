<script setup>
// renderless component helping tracking active image
const props = defineProps({
  page: Number,
  active: Boolean,
  helper: Object,
})

watchEffect(() => {
  if (props.active) {
    props.helper.activeImg = props.page - 1
  }
})
</script>
<template></template>
