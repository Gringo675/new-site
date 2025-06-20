<script setup>
// компонент получает продукты и управляет их отображением, пагинацией и сортировкой

const { products, activeProductsIndx } = defineProps({
  products: Array,
  activeProductsIndx: Array,
})

const pageSetup = usePageSetup()

const pagination = reactive({
  activePage: 1,
  showPages: 1, // кнопка Показать еще позволяет показать несколько страниц
  totalPages: computed(() => Math.ceil(activeProductsIndx.length / pageSetup.value.prodsOnPage)),
})

const sortProducts = () => {
  switch (pageSetup.value.sortBy) {
    case 'order':
      activeProductsIndx.sort((aIndx, bIndx) => products[aIndx].order - products[bIndx].order)
      break
    case 'nameAcs':
      activeProductsIndx.sort((aIndx, bIndx) => products[aIndx].name.localeCompare(products[bIndx].name))
      break
    case 'nameDes':
      activeProductsIndx.sort((aIndx, bIndx) => products[bIndx].name.localeCompare(products[aIndx].name))
      break
    case 'priceAcs':
      activeProductsIndx.sort((aIndx, bIndx) => products[aIndx].price - products[bIndx].price)

      break
    case 'priceDes':
      activeProductsIndx.sort((aIndx, bIndx) => products[bIndx].price - products[aIndx].price)
      break
    case 'brand':
      activeProductsIndx.sort((aIndx, bIndx) => {
        // достаем бренд как последнее слово в наименовании
        const aBrand = products[aIndx].name.split(' ').pop()
        const bBrand = products[bIndx].name.split(' ').pop()
        return aBrand.localeCompare(bBrand)
      })
      break
  }
  productsSortedBy = pageSetup.value.sortBy
}

const visibleProductsIndx = ref([])
let productsSortedBy = 'order' // продукты поступают с 'дефолтной' сортировкой
const setVisibleProducts = () => {
  if (productsSortedBy !== pageSetup.value.sortBy) sortProducts()
  const startProd = (pagination.activePage - 1) * pageSetup.value.prodsOnPage
  const endProd = startProd + pageSetup.value.prodsOnPage * pagination.showPages
  visibleProductsIndx.value = activeProductsIndx.slice(startProd, endProd)
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
  productsWrapper.value.style.height = productsWrapper.value.offsetHeight + 'px' // запоминаем высоту враппера для анимации
  if (options.fromShowMore) {
    step2()
  } else {
    if (options.fromPagination) {
      productsWrapper.value.style.transform = `translateX(${options.paginationToRight ? '-' : ''}50px)`
      // перемотка вверх
      const wrapperTop = productsWrapper.value.getBoundingClientRect().top - 70 // minus header
      if (wrapperTop < 0) window.scrollBy({ top: wrapperTop, behavior: 'smooth' })
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
    productsWrapper.value.addEventListener(
      'transitionend',
      () => {
        productsWrapper.value.style.height = ''
      },
      { once: true },
    )
  }
}

// вешаем вотчеры на данные
// за переходом на другую страницу и нажатием на "Показать еще" следит компонент HelperPagination
// из категорий продукты поступают реактивными, из поиска нет (у computed пропадает реактивность)
// watch(isReactive(props.products) ? props.products : () => props.products, () => changesHandler({ fromProducts: true }))
watch(
  () => activeProductsIndx,
  () => changesHandler({ fromProducts: true }),
)
watch(pageSetup, () => changesHandler({ fromPageSetup: true }), { deep: true })
</script>

<template>
  <!--        order and quantity-->
  <div class="flex w-full flex-wrap justify-end gap-2">
    <USelect
      v-model="pageSetup.sortBy"
      :items="[
        {
          type: 'label',
          label: 'Упорядочить:',
        },
        {
          type: 'separator',
        },
        {
          label: 'по типоразмеру',
          value: 'order',
        },
        {
          label: 'по наименованию А->Я',
          value: 'nameAcs',
        },
        {
          label: 'по наименованию Я->А',
          value: 'nameDes',
        },
        {
          label: 'по производителю',
          value: 'brand',
        },
        {
          label: 'сначала дешевле',
          value: 'priceAcs',
        },
        {
          label: 'сначала дороже',
          value: 'priceDes',
        },
      ]"
      color="tertiary"
      variant="outline"
      highlight
      class="w-48"
      trailingIcon="i-heroicons-arrows-up-down-20-solid"
    />
    <USelect
      placeholder="На странице:"
      v-model="pageSetup.prodsOnPage"
      :items="[
        {
          type: 'label',
          label: 'На странице:',
        },
        {
          type: 'separator',
        },
        10,
        20,
        40,
        60,
      ]"
      color="tertiary"
      variant="outline"
      highlight
      class="w-24"
      trailingIcon="i-heroicons-arrows-up-down-20-solid"
    />
  </div>
  <!--  products-->
  <div
    class="overflow-x-hidden"
    id="pageProducts"
  >
    <div
      class="productsWrapperTransition overflow-hidden"
      ref="productsWrapper"
    >
      <div
        class="@container flex flex-col gap-y-2 py-2"
        ref="productsWrapperHelper"
      >
        <template v-if="visibleProductsIndx.length">
          <CatalogProductCard
            v-for="indx in visibleProductsIndx"
            :prod="products[indx]"
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
