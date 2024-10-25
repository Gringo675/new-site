<script setup>
//
const url = 'https://chelinstrument.ru/docs/stnd/gost%20166-89%20%5Bchelinstrument.ru%5D.pdf#toolbar=0'
</script>

<template>
  <embed
    :src="url"
    type="application/pdf"
    width="100%"
    height="500px"
  />
</template>
