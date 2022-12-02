<script setup>

import { ProductWrapper as worker } from '#components'

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias

const fetchOptions = {url, worker}

</script>

<template>
  <HelperDataFetch :options="fetchOptions"/>
</template>

