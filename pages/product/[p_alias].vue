<script setup>
import { ref } from 'vue'
// const productData = await $fetch('/api/getProduct?p_alias=' + $route.params.p_alias)
// console.log(`productData: ${JSON.stringify(productData)}`);

// const productData = await $fetch('/api/getProduct?')
// console.log(`productData: ${JSON.stringify(productData)}`)
const route = useRoute()
const alias = route.params.p_alias
console.log(`alias: ${alias}`);

// const ttest = await $fetch('/api/test?alias=' + alias)
// console.log(`ttest: ${ttest}`);

const productData = await $fetch('/api/getProduct?alias=' + alias)
// console.log(`productData: ${JSON.stringify(productData)}`);

</script>

<template>
  <div class="product">
    <h1>PRODUCT</h1>
    <div>
      id: {{productData.id}}
    </div>
    <div>
      name: {{productData.name}}
    </div>
    <div>
      price: {{productData.price}}
    </div>
    <div>
      images: {{productData.images}}
    </div>
  </div>
</template>

<style lang="scss">
.product{
  width: 100%;
  height: 600px;
  background: lavender;
}
</style>