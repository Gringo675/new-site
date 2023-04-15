<script setup>
const aaa = await $fetch('/api/admin/system/siteStatus')
const bbb = 222
const ccc = 333

</script>

<template>
  <div>
    <h1>Test2</h1>
    <div>aaa: {{aaa}}</div>
  </div>

</template>