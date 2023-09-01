<script setup>
// компонет получает продукты и управляет их пагинацией и сортировкой

const props = defineProps({
  products: Array,
})
const products = props.products

const pageSetup = usePageSetup()

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: 0,
})
// todo: pagination.totalPages

const sortProducts = () => {
  switch (pageSetup.value.sortBy) {
    case 'order':
      products.sort((a, b) => a.order - b.order)
      break
    case 'priceAcs':
      products.sort((a, b) => a.price - b.price)
      break
    case 'priceDes':
      products.sort((a, b) => b.price - a.price)
      break
    case 'brand':
      sortByBrand()
      break
  }

  function sortByBrand() {
    const brandProps = filter.find(fGroup => fGroup.name === 'Производитель').values.map(value => value.val)
    products.sort((a, b) => {
      let aOrder, bOrder
      for (const [index, prop] of brandProps.entries()) {
        if (a.props.includes(prop)) aOrder = index
        if (b.props.includes(prop)) bOrder = index
        if (aOrder !== undefined && bOrder !== undefined) break
      }
      return aOrder - bOrder
    })
  }
}

if (pageSetup.value.sortBy !== 'order') sortProducts()

const visibleProducts = computed(() => {
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  return products.slice(startProd, endProd)
})
</script>

<template>
  <!--        order and quantity-->
  <div class="w-full flex justify-end">
    <select v-model="pageSetup.sortBy">
      <option disabled>Упорядочить:</option>
      <option value="order">по типоразмеру</option>
      <option value="brand">по производителю</option>
      <option value="priceAcs">сначала дешевые</option>
      <option value="priceDes">сначала дорогие</option>
    </select>
    <select
      v-model="pageSetup.prodsOnPage"
      class="ml-5"
    >
      <option disabled>На странице:</option>
      <option>10</option>
      <option>20</option>
      <option>50</option>
      <option>100</option>
    </select>
  </div>
  <!--  products-->
  <div
    class="products"
    id="pageProducts"
  >
    <h2>PRODUCTS</h2>
    <div
      ref="productsWrapper"
      class="transition-opacity"
    >
      <template v-if="visibleProducts.length">
        <CatalogProductCard
          v-for="product in visibleProducts"
          :prod="product"
        />
      </template>
      <div v-else>Подходящих товаров не найдено!</div>
    </div>
    <HelperPaginator :pageProps="pagination" />
  </div>
</template>
