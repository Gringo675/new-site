<script setup>
//
const searchQuery = useRoute().params.s_query
const searchData = searchQuery.length > 2 ? await myFetch(`/api/getSearch?q=${searchQuery}`) : null

// console.log(`searchData: ${JSON.stringify(searchData, null, 2)}`)

for (const cat of searchData.cats) {
  cat.active = true
  for (const subCat of cat.childs) {
    subCat.active = true
  }
}
const cats = ref(searchData.cats)

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: 0,
})

const activeProducts = computed(() =>
  searchData.products.filter(product =>
    cats.value
      .find(cat => cat.id === product.catId)
      .childs.some(subCat => subCat.active && subCat.props.every(prop => product.props.includes(prop)))
  )
)

const visibleProducts = computed(() => {
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  return activeProducts.value.slice(startProd, endProd)
})
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
          v-for="cat of cats"
          class="block ml-2"
        >
          <input
            type="checkbox"
            v-model="cat.active"
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
        <CatalogProductCard
          v-for="product in activeProducts"
          :prod="product"
        />
      </div>
    </div>
  </div>
</template>
