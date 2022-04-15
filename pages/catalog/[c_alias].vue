<script setup>
// import { computed, watch } from '#imports'
const route = useRoute()
const alias = route.params.c_alias
const {catData, products, filter} = await $fetch('/api/getCategory?alias=' + alias)

const activeProducts = computed(() => {
  let fActiveProps = []
  filter.forEach((fGroup) => {
    fGroup.values.forEach((prop) => {
      if (prop.active) fActiveProps.push(prop.val)
    })
  })
  console.log(`fActiveProps: ${fActiveProps}`);

  return products
  // return products.filter((product) => {
  //
  // })
})

// watch(filter, () => {
//   console.log(`Filter changed`);
// })

////// TTEST ///////////
const ttest = ref({
  name: 'ttest',
  active: true
})
const antiTtest = computed(() => {
  console.log(`CHANGED`);
  return !ttest.value.active
} )
</script>

<template>
  <div class="category">

    <div>
      <h2>TTEST</h2>
      <div>
        name: {{ttest.name}}
      </div>
      <div>
        active: {{ttest.active}}
        <span><button @click="ttest.active = !ttest.active">Toggle</button></span>
        anti: {{antiTtest}}
      </div>
    </div>


    <h1>{{ catData.name }}</h1>
    <div class="catBlock">
      <div>
        id: {{ catData.id }}
      </div>
      <div>
        description: {{ catData.description }}
      </div>
    </div>
    <div class="productsBlock">
      <div class="filter">
        <h2>FILTER</h2>
        <div v-for="fGroup in filter">
          {{ fGroup.name }}
          <div v-for="prop in fGroup.values">
            <span>
              <input type="checkbox" v-model="prop.active">
            </span>
            <span>{{ prop.name }}</span>
          </div>
        </div>
      </div>
      <div class="products">
        <h2>PRODUCTS</h2>
        <div v-for="product in products">
          {{ product.name }}
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.category {
  width: 100%;
  background: lavender;

  .productsBlock {
    display: flex;

    .filter {
      width: 250px;
    }
    .products {

    }
  }
}
</style>