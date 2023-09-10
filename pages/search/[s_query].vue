<script setup>
//
const searchQuery = useRoute().params.s_query
const searchData = searchQuery.length > 2 ? await myFetch(`/api/getSearch?q=${searchQuery}`) : null

for (const cat of searchData.cats) {
  for (const subCat of cat.childs) {
    subCat.active = true
  }
}
const cats = reactive(searchData.cats)

const activeProducts = computed(() => {
  console.log(`from activeProducts`)
  const inactiveCats = {}
  for (const cat of cats) {
    inactiveCats[cat.id] = cat.childs.filter(child => !child.active).map(child => child.props)
  }
  return searchData.products.filter(
    product => !inactiveCats[product.catId].some(activeProps => activeProps.every(prop => product.props.includes(prop)))
  )
})

const vIndeterminateChecked = (el, binding) => {
  // custom directive v-indeterminate-checked
  const targetCat = cats[binding.value]
  el.indeterminate = targetCat.childs.some(subCat => subCat.active) && targetCat.childs.some(subCat => !subCat.active)
  if (!el.indeterminate) el.checked = targetCat.childs.every(subCat => subCat.active)
}
</script>

<template>
  <h1>Результаты поиска по запросу "{{ searchQuery }}"</h1>
  <div v-if="searchQuery.length < 3">
    Минимальная длина поискового запроса - 3 символа. Пожалуйста, уточните запрос.
  </div>
  <div v-else-if="!searchData">Ничего не найдено! Попробуйте изменить запрос.</div>
  <!-- results -->
  <div v-else>
    <div>Найдено {{ searchData.products.length }} товаров в {{ searchData.cats.length }} категориях.</div>
    <!--    content wrapper-->
    <div class="flex mt-5">
      <!--      first column-->
      <div class="w-60 mr-4">
        <label
          v-for="(cat, i) of cats"
          class="block ml-2"
        >
          <input
            type="checkbox"
            v-indeterminate-checked="i"
            @change="cat.childs.forEach(subCat => (subCat.active = $event.target.checked))"
          />
          {{ cat.name }}
          <label
            v-for="subCat of cat.childs"
            class="block ml-4"
          >
            <input
              type="checkbox"
              v-model="subCat.active"
            />
            {{ subCat.name }}
          </label>
        </label>
      </div>
      <!--      second column-->
      <div class="w-full">
        <CatalogProductsWrapper :products="activeProducts" />
        <!-- <CatalogProductCard
          v-for="product in activeProducts"
          :prod="product"
        /> -->
      </div>
    </div>
  </div>
</template>
