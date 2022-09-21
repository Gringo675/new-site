<script setup>
// import { computed, watch } from '#imports'
const route = useRoute()
const alias = route.params.c_alias
const {catData, products, filter: filterOrigin} = await $fetch('/api/getCategory?alias=' + alias)
let initialFilterProps = new Set() // собираем начальные значения, для сброса
filterOrigin.forEach(fGroup => {
  fGroup.values.forEach(prop => {
    if (prop.active) initialFilterProps.add(prop.val)
  })
})
console.log(`initialFilterProps.size: ${initialFilterProps.size}`);
let filter = reactive(filterOrigin)
let activeProducts = reactive([])
createActiveProducts()


function resetFilter() {
  filter.forEach(fGroup => {
    fGroup.values.forEach(prop => {
      if (initialFilterProps.has(prop.val)) {
        prop.active = true
      } else {
        prop.active = false
      }
    })
  })
}

function createActiveProducts() {
  activeProducts.length = 0 // обнуляем
  let activeFilter = [] // соберем массив из всех активных групп фильтра
  filter.forEach((fGroup) => {
    const activeValues = fGroup.values.filter(value => value.active).map(value => value.val)
    if (activeValues.length) activeFilter.push(activeValues)
  })

  products.forEach(product => {
    let isProductMatch = true
    for (const fGroup of activeFilter) {
      if (!fGroup.some(value => product.props.includes(value))) {
        isProductMatch = false
        break
      }
    }
    if (isProductMatch) activeProducts.push(product)
  })
}

watch(filter, () => {
  createActiveProducts()
})

</script>

<template>
  <div class="category">

<!--    <h1>{{ catData.name }}</h1>-->
<!--    <div class="catBlock">-->
<!--      <div>-->
<!--        id: {{ catData.id }}-->
<!--      </div>-->
<!--      <div>-->
<!--        description: {{ catData.description }}-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="productsBlock">-->
<!--      <div class="filter">-->
<!--        <h2>FILTER</h2>-->
<!--        <div v-for="fGroup in filter">-->
<!--          {{ fGroup.name }}-->
<!--          <div v-for="prop in fGroup.values">-->
<!--            <span>-->
<!--              <input type="checkbox" v-model="prop.active">-->
<!--            </span>-->
<!--            <span>{{ prop.name }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <button @click="resetFilter">Сбросить</button>-->
<!--      </div>-->
<!--      <div class="products">-->
<!--        <h2>PRODUCTS</h2>-->
<!--        <div v-for="product in activeProducts">-->
<!--          {{ product.name }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

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