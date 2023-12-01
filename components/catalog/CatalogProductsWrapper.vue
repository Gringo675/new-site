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
  if (productsSortedBy !== pageSetup.value.sortBy) sortProducts()
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  visibleProducts.value = props.products?.slice(startProd, endProd)
}
setVisibleProducts()

const productsWrapper = ref(null)
const productsWrapperHelper = ref(null) // вложенный div для управления анимацией высоты
const changesHandler = (options = {}) => {
  /**
   * функция управляет отображением изменений в данных на странице
   * выполняется при изменении товаров, сортировки, кол-ва на странице, пагинации, кнопки Показать еще
   * если turnPage = 1, переходим на бОльшую страницу (вправо), если = -1, на меньшую (влево)
   */
  // defaults
  options.fromProducts = options.fromProducts ?? false
  options.fromPageSetup = options.fromPageSetup ?? false // orderBy, showBy
  options.fromShowMore = options.fromShowMore ?? false
  options.fromPagination = options.fromPagination ?? false
  options.paginationToRight = options.paginationToRight ?? false
  //step1 - до изменения visibleProducts
  if (!productsWrapper.value.style.height)
    productsWrapper.value.style.height = productsWrapper.value.offsetHeight + 'px' // запоминаем высоту враппера для анимации
  if (options.fromShowMore) {
    step2()
  } else {
    if (options.fromPagination) {
      productsWrapper.value.style.transform = `translateX(${options.paginationToRight ? '-' : ''}50px)`
      // перемотка вверх
      const wrapperTop = productsWrapper.value.getBoundingClientRect().top
      if (wrapperTop < 0)
        window.scrollBy({
          top: wrapperTop - 20,
          left: 0,
          behavior: 'smooth',
        })
    } else {
      // fromProducts || from pageSetup
      pagination.activePage = 1
      pagination.showPages = 1
      if (options.fromProducts) productsSortedBy = 'order'
    }
    productsWrapper.value.style.opacity = '0'
    productsWrapper.value.addEventListener('transitionend', step2, { once: true })
  }

  async function step2() {
    setVisibleProducts()
    // отображаем изменения
    if (options.fromPagination) {
      productsWrapper.value.style.transform = `translateX(${options.paginationToRight ? '' : '-'}50px)`
      productsWrapper.value.style.transitionDuration = '0s'
      await new Promise(resolve => setTimeout(resolve, 0))
    } else await nextTick() // ждем применения изменений в Dom
    productsWrapper.value.style.transform = ''
    productsWrapper.value.style.transitionDuration = ''
    productsWrapper.value.style.opacity = ''
    productsWrapper.value.style.height = productsWrapperHelper.value.offsetHeight + 'px' // новая высота враппера
  }
}

// вешаем вотчеры на данные
// за переходом на другую страницу и нажатием на "Показать еще" следит компонент HelperPagination
// из категорий продукты поступают реактивными, из поиска нет (у computed пропадает реактивность)
watch(isReactive(props.products) ? props.products : () => props.products, () => changesHandler({ fromProducts: true }))
watch(pageSetup.value, () => changesHandler({ fromPageSetup: true }))
</script>

<template>
  <!--        order and quantity-->
  <div class="w-full flex justify-end gap-x-2">
    <USelect
      placeholder="Упорядочить:"
      v-model="pageSetup.sortBy"
      :options="[
        {
          name: 'по типоразмеру',
          value: 'order',
        },
        {
          name: 'по наименованию А->Я',
          value: 'nameAcs',
        },
        {
          name: 'по наименованию Я->А',
          value: 'nameDes',
        },
        {
          name: 'по производителю',
          value: 'brand',
        },
        {
          name: 'сначала дешевые',
          value: 'priceAcs',
        },
        {
          name: 'сначала дорогие',
          value: 'priceDes',
        },
      ]"
      option-attribute="name"
      color="primary"
      trailingIcon="i-heroicons-arrows-up-down-20-solid"
    />
    <USelect
      placeholder="На странице:"
      v-model="pageSetup.prodsOnPage"
      :options="[10, 20, 40, 60]"
      color="primary"
      trailingIcon="i-heroicons-arrows-up-down-20-solid"
    />
  </div>
  <!--  products-->
  <div
    class="overflow-x-hidden"
    id="pageProducts"
  >
    <h2>PRODUCTS</h2>
    <div
      class="productsWrapperTransition overflow-hidden"
      ref="productsWrapper"
    >
      <div ref="productsWrapperHelper">
        <template v-if="visibleProducts.length">
          <CatalogProductCard
            v-for="product in visibleProducts"
            :prod="product"
          />
        </template>
        <div v-else>Подходящих товаров не найдено!</div>
      </div>
    </div>
    <HelperPaginator
      :pageProps="pagination"
      @turnPage="changesHandler"
      @showMore="changesHandler"
    />
  </div>
</template>
