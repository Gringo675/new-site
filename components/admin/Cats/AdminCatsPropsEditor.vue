<script setup>
const propsEditor = await usePropsEditor

const props = defineProps({
  propersObj: Object,
})

const pGroup = props.propersObj.items[propsEditor.group]

console.log(`group: ${JSON.stringify(group, null, 2)}`)
</script>

<template>
  <div class="">
    AdminCatsPropsEditor
  </div>
</template>

<style lang="scss">
.AdminCatsPropsEditor {
}
</style>