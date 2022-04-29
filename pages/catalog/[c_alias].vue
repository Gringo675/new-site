<script setup>
// import { computed, watch } from '#imports'
const route = useRoute()
const alias = route.params.c_alias
const {catData, products, filter: filterOrigin} = await $fetch('/api/getCategory?alias=' + alias)
let initialFilterProps = new Set() // собираем начальные значения, для сброса
filterOrigin.forEach(fGroup => {fGroup.values.forEach(prop => {if (prop.active) initialFilterProps.add(prop.val)})})
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

function createActiveProducts () {
  let fActiveProps = []  // соберем массив из всех активных id. Если в группе нет выбранных значений, нужно включить всю группу.
  filter.forEach((fGroup) => {
    const isGroupEnabled = fGroup.values.some(value => value.active)
    fGroup.values.forEach((prop) => {
      if (isGroupEnabled) {
        if (prop.active) fActiveProps.push(prop.val)
      } else {
        fActiveProps.push(prop.val)
      }

    })
  })
  // теперь проходимся по всем продуктам и выбираем те, все пропсы которых входят в массив fActiveProps
  activeProducts.length =  0 // обнуляем
  products.forEach( product => {
    if (product.props.every(prop => fActiveProps.includes(prop))) activeProducts.push(product)
  })
}

watch(filter, () => {
  createActiveProducts()
})

////// TTEST ///////////
const ttest = reactive({
  name: 'ttest',
  active: true
})
const antiTtest = computed(() => {
  console.log(`CHANGED`);
  return !ttest.active
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
        <button @click="resetFilter">Сбросить</button>
      </div>
      <div class="products">
        <h2>PRODUCTS</h2>
        <div v-for="product in activeProducts">
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