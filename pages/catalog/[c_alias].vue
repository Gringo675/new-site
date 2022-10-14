<script setup>
import {showNotice} from "~/composables/common/notice"

const route = useRoute()
const alias = route.params.c_alias
// let {catData, products, filter} = await $fetch('/api/getCategory?alias=' + alias)
const {data: fetchData} = await useFetch('/api/getCategory?alias=' + alias)

const catData = fetchData.value.catData
const products = fetchData.value.products
const filter = reactive(fetchData.value.filter)
const initialFilterProps = new Set() // собираем начальные значения, для сброса
filter.forEach(fGroup => {
  fGroup.values.forEach(prop => {
    if (prop.active) initialFilterProps.add(prop.val)
  })
})
const pageProps = reactive({
  sortBy: 'order',
  prodsOnPage: 10,
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: 0
})

const sortProducts = () => {
  switch (pageProps.sortBy) {
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

const activeProducts = reactive([])
const createActiveProducts = () => {
  let activeFilter = [] // соберем массив из всех активных групп фильтра
  filter.forEach((fGroup) => {
    const activeValues = fGroup.values.filter(value => value.active).map(value => value.val)
    if (activeValues.length) activeFilter.push(activeValues)
  })
  activeProducts.length = 0
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
  // меняем pageProps
  pageProps.activePage = 1
  pageProps.showPages = 1
  pageProps.totalPages = Math.ceil(activeProducts.length / pageProps.prodsOnPage)
}
createActiveProducts()

const visibleProducts = computed(() => {
  const startProd = (pageProps.activePage - 1) * pageProps.prodsOnPage
  const endProd = startProd + pageProps.prodsOnPage * pageProps.showPages
  return activeProducts.slice(startProd, endProd)
})

// отслеживаетм изменение фильтра
const productsWrapper = ref(null)
watch(filter, () => {
  productsWrapper.value.classList.add('opacity-0')
  setTimeout(() => {
    createActiveProducts()
    // показываем количество отфильтрованных товаров
    const prodsQuantity = activeProducts.length
    const text = (prodsQuantity > 0 ? `Найдено товаров - ${prodsQuantity}` : 'Не найдено подходящих товаров.<br>Попробуйте изменить условия.')
    showNotice(text)
    productsWrapper.value.classList.remove('opacity-0')
  }, 300)

  // отслеживаем изменение сортировки
  watch(() => pageProps.sortBy, () => {
    sortProducts()
    createActiveProducts()
  })
  // отслеживаем изменение количества товаров на странице
  watch(() => pageProps.prodsOnPage, () => {
    createActiveProducts()
  })

})

</script>

<template>
  <div class="w-full p-2">
    <!--    breadcrumbs-->
    <div class="my-2 px-3 w-fit bg-slate-300 rounded-md">/ bread / crumbs /</div>
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
        {{ child.name }}
      </div>
    </div>
    <!--    content wrapper-->
    <div class="flex mt-5">
      <!--      first column-->
      <div class="w-60 mr-4">
        <!--      filter-->
        <CatalogFilter :filter="filter" :initialFilterProps="initialFilterProps"/>
      </div>
      <!--      second column-->
      <div class="w-full">
        <!--        order and quantity-->
        <div class="w-full flex justify-end">
          <select v-model="pageProps.sortBy">
            <option disabled>Упорядочить:</option>
            <option value="order">по типоразмеру</option>
            <option value="brand">по производителю</option>
            <option value="priceAcs">сначала дешевые</option>
            <option value="priceDes">сначала дорогие</option>
          </select>
          <select v-model="pageProps.prodsOnPage" class="ml-5">
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
              <div v-for="product in visibleProducts">
                {{ product.name }} - {{ product.price }} руб.
              </div>
            </template>
            <div v-else>
              Подходящих товаров не найдено!
            </div>

          </div>
          <HelperPaginator :pageProps="pageProps"/>

        </div>
      </div>


    </div>

  </div>
</template>

