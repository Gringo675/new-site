<script setup>
// компонент получает продукты и управляет их отображением, пагинацией и сортировкой

const props = defineProps({
  products: Array,
})

const pageSetup = usePageSetup()

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: computed(() => Math.ceil(props.products.length / pageSetup.value.prodsOnPage)),
})

const sortProducts = () => {
  console.log(`from sort`)
  switch (pageSetup.value.sortBy) {
    case 'order':
      props.products.sort((a, b) => a.order - b.order)
      break
    case 'nameAcs':
      props.products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'nameDes':
      props.products.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'priceAcs':
      props.products.sort((a, b) => a.price - b.price)
      break
    case 'priceDes':
      props.products.sort((a, b) => b.price - a.price)
      break
    case 'brand':
      props.products.sort((a, b) => {
        // достаем бренд как последнее слово в наименовании
        const aBrand = a.name.split(' ').pop()
        const bBrand = b.name.split(' ').pop()
        return aBrand.localeCompare(bBrand)
      })
      break
  }
  productsSortedBy = pageSetup.value.sortBy
}

const visibleProducts = ref([])
let productsSortedBy = 'order' // продукты поступают с 'дефолтной' сортировкой
const setVisibleProducts = () => {
  console.log(`from set visibleProducts`)
  if (productsSortedBy !== pageSetup.value.sortBy) sortProducts()
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  visibleProducts.value = props.products?.slice(startProd, endProd)
}

// if (pageSetup.value.sortBy !== 'order') sortProducts()
setVisibleProducts()

const classProductsWrapper = ref('')
const changesHandler = (turnPage = 0, showMore = 0, productsChanged = 0) => {
  /**
   * функция управляет отображением изменений в данных на странице
   * выполняется при изменении товаров, сортировки, кол-ва на странице, пагинации, кнопки Показать еще
   * если turnPage = 1, переходим на бОльшую страницу (вправо), если = -1, на меньшую (влево)
   */
  if (turnPage) {
    classProductsWrapper.value = `${turnPage === 1 ? '-' : ''}translate-x-20 transition-transform duration-1000	`
    document.getElementById('pageProducts').scrollIntoView({ behavior: 'smooth' }) // перемотка наверх
  } else if (!showMore) {
    classProductsWrapper.value = 'opacity-0'
    if (productsChanged) productsSortedBy = 'order'
    pagination.activePage = 1
    pagination.showPages = 1
  }
  setTimeout(() => {
    // classProductsWrapper.value = ''
    setVisibleProducts()
  }, 1000)
}
// вешаем вотчеры на данные
// слежением за изменением текущей страницы следит компонент HelperPagination, эмитит событие turnPage
watch(pageSetup.value, () => {
  changesHandler()
})
watch(
  () => props.products,
  () => {
    console.log(`products changed`)
    changesHandler(0, 0, 1)
  }
)
watch(
  () => pagination.showPages,
  () => {
    console.log(`from show more`)
    changesHandler(0, 1)
  }
)
</script>

<template>
  <!--        order and quantity-->
  <div class="w-full flex justify-end">
    <select v-model="pageSetup.sortBy">
      <option disabled>Упорядочить:</option>
      <option value="order">по типоразмеру</option>
      <option value="nameAcs">по наименованию А->Я</option>
      <option value="nameDes">по наименованию Я->А</option>
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
      <option>40</option>
      <option>60</option>
    </select>
  </div>
  <!--  products-->
  <div
    class="products"
    id="pageProducts"
  >
    <h2>PRODUCTS</h2>
    <div
      class="-translate-x-20"
      :class="classProductsWrapper"
    >
      <template v-if="visibleProducts.length">
        <CatalogProductCard
          v-for="product in visibleProducts"
          :prod="product"
        />
      </template>
      <div v-else>Подходящих товаров не найдено!</div>
    </div>
    <HelperPaginator
      :pageProps="pagination"
      @turnPage="changesHandler"
    />
  </div>
</template>
