<script setup>
const pageSetup = usePageSetup()

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: computed(() => Math.ceil(activeProducts.length / pageSetup.value.prodsOnPage)),
})

const props = defineProps({
  data: Object,
})

const catData = props.data.catData
const products = props.data.products
const activeProducts = reactive([])
const filter = props.data.filter

const breadCrumbs = useBreadCrumbs()
breadCrumbs.value = []
breadCrumbs.value.push({
  name: 'Каталог',
  link: '/catalog',
})
if (catData.parentCat)
  breadCrumbs.value.push({
    name: catData.parentCat.name,
    link: '/catalog/' + catData.parentCat.alias,
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

const urlFilter = useRoute().query.f
if (urlFilter) setFilterFromURL()
else initializeFilter()

function initializeFilter() {
  // устанавливаем начальные значения
  filter.forEach(fGroup => {
    fGroup.values.forEach(value => {
      value.active = false
      value.disabled = false
    })
  })
  activeProducts.length = 0
  products.forEach(product => activeProducts.push(product))
  // pagination.totalPages = Math.ceil(activeProducts.length / pageSetup.value.prodsOnPage)
}

function setFilterFromURL() {
  const activeValues = urlFilter.split('-').map(val => Number(val))
  filter.forEach(fGroup =>
    fGroup.values.forEach(value => {
      value.active = activeValues.includes(value.val)
      value.disabled = false
    })
  )
  handleFilter()
}

function handleFilter() {
  // создаем массив из всех активных групп фильтра
  const activeFilter = filter.map(fGroup =>
    fGroup.values.filter(value => value.active && !value.disabled).map(value => value.val)
  )
  // отбираем по фильтру товары
  activeProducts.length = 0
  products.forEach(product => {
    const isProductMatch = activeFilter.every(fGroup =>
      fGroup.length ? fGroup.some(activeVal => product.props.includes(activeVal)) : true
    )
    if (isProductMatch) activeProducts.push(product)
  })
  // Вычисляем неактивные пункты в фильтре.
  // Проверяем каждое отдельное значение(в том числе и активные), добавляя его к актуальному фильтру.
  // Если для получившейся комбинации нет подходящих товаров, деактивируем.
  filter.forEach((fGroup, i) => {
    fGroup.values.forEach(value => {
      const localFilter = activeFilter.map(group => [...group]) // делаем копию
      localFilter[i] = [value.val] // проверяемое значение должно быть одно в группе
      value.disabled = !products.some(product =>
        localFilter.every(fGroup =>
          fGroup.length ? fGroup.some(activeVal => product.props.includes(activeVal)) : true
        )
      )
    })
  })
  // считаем количество страниц
  // pagination.totalPages = Math.ceil(activeProducts.length / pageSetup.value.prodsOnPage)
}

const visibleProducts = computed(() => {
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  return activeProducts.slice(startProd, endProd)
})

const productsWrapper = ref(null)
const changesHandler = (from = 'filter') => {
  // функция, управляющая отображением изменений в фильтре товаров и настройках страницы
  // from = filter, resetFilter, pageSetup
  productsWrapper.value.classList.add('opacity-0')
  setTimeout(() => {
    if (from === 'resetFilter') initializeFilter()
    else {
      if (from === 'pageSetup') sortProducts()
      handleFilter()
    }
  }, 10)
  setTimeout(() => {
    pagination.activePage = 1
    pagination.showPages = 1
    productsWrapper.value.classList.remove('opacity-0')
    // показываем количество отфильтрованных товаров
    if (from !== 'pageSetup') {
      showNotice(
        activeProducts.length > 0
          ? `Найдено товаров - ${activeProducts.length}`
          : 'Не найдено подходящих товаров.<br>Попробуйте изменить условия.'
      )
    }
    if (from === 'filter' || from === 'resetFilter') addFilterToURL()
  }, 300)
}

const addFilterToURL = () => {
  const activeFilterIds = filter.reduce((acc, fGroup) => {
    acc.push(...fGroup.values.filter(value => value.active).map(value => value.val))
    return acc
  }, [])
  const url = new URL(window.location)
  if (activeFilterIds.length) url.searchParams.set('f', activeFilterIds.join('-'))
  else url.searchParams.delete('f')
  window.history.replaceState({}, '', url)
}

// реагируем на изменение сортировки и кол-ва товаров на странице
watch(pageSetup.value, () => {
  changesHandler('pageSetup')
})
</script>

<template>
  <div class="w-full p-2">
    <!--    breadcrumbs-->
    <BreadCrumbs />
    <!--    name-->
    <h1>{{ catData.name }}</h1>
    <!--    description-->
    <div
      class="my-2 p-2 bg-slate-100 rounded-xl shadow-md"
      v-html="catData.description"
    ></div>
    <!--    subcats-->
    <div
      v-if="catData.childCats"
      class="w-full my-2 bg-sky-100 rounded-xl flex items-center justify-center"
    >
      <div
        v-for="child in catData.childCats"
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
        <CatalogFilter
          :filter="filter"
          :changesHandler="changesHandler"
        />
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
      </div>
    </div>
  </div>
</template>
