<script setup>
//
const props = defineProps({
  data: Object,
})

// убираем ненужную реактивность
// const catData = JSON.parse(JSON.stringify(props.data.catData))
// const products = JSON.parse(JSON.stringify(props.data.products))
const catData = props.data.catData
const products = props.data.products ?? []
const filter = reactive(props.data.filter ?? [])
const activeProducts = shallowReactive([])
const activeProductsIndx = ref([])

useSeoMeta({
  title: catData.name + ' - цены, фото, характеристики',
})
useServerSeoMeta({
  description: `Купить ${catData.name}${
    catData.docs?.stnd?.length ? ' ' + catData.docs.stnd.map(stnd => stnd.number).join(', ') : ''
  } по ценам производителя с доставкой по России. Весь измерительный инструмент с поверкой и калибровкой в нашем онлайн-каталоге.`,
})

const urlFilter = useRoute().query.f
if (urlFilter) setFilterFromURL()
else initializeFilter()

function initializeFilter(fromReset = false) {
  // устанавливаем начальные значения
  filter.forEach(fGroup => {
    fGroup.values.forEach(value => {
      value.active = false
      value.disabled = false
    })
  })
  activeProducts.length = 0
  products.forEach(product => activeProducts.push(product))
  activeProductsIndx.value = [...Array(products.length).keys()] // все продукты
  if (fromReset) addFilterToURL()
}

function setFilterFromURL() {
  const activeValues = urlFilter.split('-').map(val => Number(val))
  filter.forEach(fGroup =>
    fGroup.values.forEach(value => {
      value.active = activeValues.includes(value.val)
      value.disabled = false
    })
  )
  handleFilter(true)
}

function handleFilter(filterFromURL = false) {
  // filterFromURL - когда обрабатываем фильтр, полученный из url query
  // создаем массив из всех активных групп фильтра
  const activeFilter = filter.map(fGroup => fGroup.values.filter(value => value.active).map(value => value.val))
  // отбираем по фильтру товары
  activeProducts.length = 0
  products.forEach(product => {
    const isProductMatch = activeFilter.every(fGroup =>
      fGroup.length ? fGroup.some(activeVal => product.props.includes(activeVal)) : true
    )
    if (isProductMatch) activeProducts.push(product)
  })
  activeProductsIndx.value = []
  products.forEach((product, i) => {
    const isProductMatch = activeFilter.every(fGroup =>
      fGroup.length ? fGroup.some(activeVal => product.props.includes(activeVal)) : true
    )
    if (isProductMatch) activeProductsIndx.value.push(i)
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
  if (filterFromURL) return
  // засовываем фильтр в url
  addFilterToURL()
  // показываем уведомление
  if (activeProductsIndx.value.length > 0)
    showNotice({ title: `Подобрано товаров - ${activeProductsIndx.value.length}`, type: 'success' })
  else
    showNotice({
      title: 'Не найдено подходящих товаров.',
      description: 'Попробуйте изменить условия отбора.',
      type: 'error',
    })
}

function addFilterToURL() {
  const activeFilterIds = filter.reduce((acc, fGroup) => {
    acc.push(...fGroup.values.filter(value => value.active).map(value => value.val))
    return acc
  }, [])
  const url = new URL(window.location)
  if (activeFilterIds.length) url.searchParams.set('f', activeFilterIds.join('-'))
  else url.searchParams.delete('f')
  window.history.replaceState({}, '', url)
}
</script>

<template>
  <div class="w-full p-2">
    <!--    breadcrumbs-->
    <BreadCrumbsWrapper :catId="catData.id" />
    <!--    name-->
    <h1 class="text-2xl font-accent my-4">{{ catData.name }}</h1>
    <!--    description-->
    <div
      class="my-2 p-2 bg-gray-100 border border-bg-gray-200 rounded-xl"
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

    <HelperAsideGrid>
      <template #aside>
        <CatalogFilter
          v-if="filter.length"
          :filter="filter"
          @filterChanged="handleFilter"
          @resetFilter="initializeFilter(true)"
        />
      </template>
      <CatalogProductsWrapper
        :products
        :activeProductsIndx
      />
    </HelperAsideGrid>
    <HelperDocsBlock
      v-if="catData.docs"
      :docs="catData.docs"
    />
  </div>
</template>
