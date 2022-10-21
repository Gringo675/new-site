<script setup>
import {showNotice} from "~/composables/common/notice"
import usePageSetup from "~/composables/state/usePageSetup";
import useBreadCrumbs from "~/composables/state/useBreadCrumbs";

const pageSetup = usePageSetup()

const props = defineProps({
  fetchData: Object
})

const catData = props.fetchData.catData
const products = props.fetchData.products
const filter = reactive(JSON.parse(JSON.stringify(props.fetchData.filter))) // копия, чтобы сохранить стейт для повторных заходов
const filterInitial = props.fetchData.filterInitial

const breadCrumbs = useBreadCrumbs()
breadCrumbs.value = []
breadCrumbs.value.push({
  name: 'Каталог',
  link: '/catalog'
})
if (catData.parentCat) breadCrumbs.value.push({
  name: catData.parentCat.name,
  link: '/catalog/' + catData.parentCat.alias
})

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: 0
})

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
    let brandProps = []
    for (const fGroup of filter) {
      if (fGroup.name !== 'Производитель') continue
      for (const prop of fGroup.values) {
        brandProps.push(prop.val)
      }
      break
    }
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
sortProducts()

const activeFilter = reactive([]) //массив из всех активных групп фильтра
const createActiveFilter = () => {
  activeFilter.length = 0
  filter.forEach((fGroup) => {
    const activeValues = fGroup.values.filter(value => value.active).map(value => value.val)
    if (activeValues.length) activeFilter.push(activeValues)
  })
}
createActiveFilter()

const activeProducts = computed(() => {
  const activeProducts = []
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
  pagination.totalPages = Math.ceil(activeProducts.length / pageSetup.value.prodsOnPage) // side effect
  return activeProducts
})

const visibleProducts = computed(() => {
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  return activeProducts.value.slice(startProd, endProd)
})

// реагируем на изменение фильтра
const productsWrapper = ref(null)
watch(filter, () => {
  productsWrapper.value.classList.add('opacity-0')
  setTimeout(() => {
    pagination.activePage = 1
    pagination.showPages = 1
    createActiveFilter()
    productsWrapper.value.classList.remove('opacity-0')
    // показываем количество отфильтрованных товаров
    const prodsQuantity = activeProducts.value.length
    const text = (prodsQuantity > 0 ? `Найдено товаров - ${prodsQuantity}` : 'Не найдено подходящих товаров.<br>Попробуйте изменить условия.')
    showNotice(text)
  }, 300)
})

// реагируем на изменение сортировки и кол-ва товаров на странице
watch(pageSetup.value, (newS, oldS) => { // ???
  // console.log(`newS: ${JSON.stringify(newS, null, 2)}`)
  // console.log(`oldS: ${JSON.stringify(oldS, null, 2)}`)
  // if (newS.sortBy !== oldS.sortBy) sortProducts()
  sortProducts()
  pagination.activePage = 1
  pagination.showPages = 1
  pagination.totalPages = Math.ceil(activeProducts.value.length / pageSetup.value.prodsOnPage)
})

</script>

<template>
  <div class="w-full p-2">
    <!--    breadcrumbs-->
    <BreadCrumbs />
    <!--    name-->
    <h1>{{ catData.name }}</h1>
    <!--    description-->
    <div class="my-2 p-2 bg-slate-100 rounded-xl shadow-md"
         v-html="catData.description"
    >
    </div>
    <!--    subcats-->
    <div v-if="catData.childCats.length"
         class="w-full my-2 bg-sky-100 rounded-xl flex items-center justify-center"
    >
      <div v-for="child in catData.childCats"
           class="px-3 text-center"
      >
        <NuxtLink :to="'/catalog/' + child.alias">
          {{ child.name }}
        </NuxtLink>
      </div>
    </div>
    <!--    content wrapper-->
    <div class="flex mt-5">
      <!--      first column-->
      <div class="w-60 mr-4">
        <!--      filter-->
        <CatalogFilter :filter="filter" :filterInitial="filterInitial"/>
      </div>
      <!--      second column-->
      <div class="w-full">
        <!--        order and quantity-->
        <div class="w-full flex justify-end">
          <select v-model="pageSetup.sortBy">
            <option disabled>Упорядочить:</option>
            <option value="order">по типоразмеру</option>
            <option value="brand">по производителю</option>
            <option value="priceAcs">сначала дешевые</option>
            <option value="priceDes">сначала дорогие</option>
          </select>
          <select v-model="pageSetup.prodsOnPage" class="ml-5">
            <option disabled>На странице:</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <!--  products-->
        <div class="products" id="pageProducts">
          <h2>PRODUCTS</h2>
          <div ref="productsWrapper" class="transition-opacity">
            <template v-if="visibleProducts.length">
              <HelperProductCard v-for="product in visibleProducts" :prod="product"/>
            </template>
            <div v-else>
              Подходящих товаров не найдено!
            </div>

          </div>
          <HelperPaginator :pageProps="pagination"/>
        </div>
      </div>


    </div>

  </div>
</template>

