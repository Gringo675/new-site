<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div id="parent">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
</template>

<style scoped>
#parent {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr 2fr;
  border: 2px solid #696989;
  padding: 10px;
  width: 400px;
  height: 200px;
}
#parent > div {
  padding: 10px;
  border: 1px solid #696989;
}
</style>
