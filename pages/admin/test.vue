<script setup>
// import myFetch from "~/composables/common/myFetch"
// const url = '/api/apiTest'
// const data = await myFetch(url, {silent: false})

import catProps from "~/composables/admin/cats/catProps"

await catProps.getItems()

</script>

<template>
  <div class="test" v-if="catProps.items">
    items.p0_brand.length: {{catProps.items.p0_brand?.length}}
  </div>
</template>

<style>

</style>