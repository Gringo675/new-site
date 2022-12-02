<script setup>

import { CatalogWrapper as worker } from '#components'

const route = useRoute()
const url = '/api/getCategory?alias=' + route.params.c_alias

const fetchOptions = {url, worker}

</script>

<template>
  <HelperDataFetch :options="fetchOptions"/>
</template>

