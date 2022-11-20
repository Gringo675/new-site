<script setup>
import myFetch from "~/composables/common/myFetch"

const items = await myFetch('/api/adminGetProperties', {auth: true, lazy: true})

</script>

<template>
  <div class="test_err">

  </div>
</template>
