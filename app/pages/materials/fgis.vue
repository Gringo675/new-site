<script setup>
import { ref, shallowRef, reactive, computed, watch, onMounted } from 'vue'

const siteConfig = useSiteConfig()
const canonicalUrl = `${siteConfig.url}/materials/fgis`

useTitle('Поиск по ФГИС РСТ (Госреестр СИ) онлайн — база типов СИ, методики поверки | ТД «Челябинский Инструмент»')
useSeoMeta({
  description: 'Бесплатный онлайн-поиск по Государственному реестру средств измерений (ФГИС РСТ Росстандарта). Скачивание официальных описаний типов СИ и методик поверки в PDF. Подбор сертифицированного инструмента из каталога с первичной поверкой.',
  keywords: 'ФГИС РСТ, ФГИС ГРСИ, Госреестр СИ, Государственный реестр средств измерений, описание типа СИ, методика поверки, поверка инструмента, купить поверенный инструмент',
  ogTitle: 'Поиск по ФГИС РСТ (Госреестр СИ) — база типов СИ и методики поверки',
  ogDescription: 'Онлайн-поиск по Госреестру СИ РФ: скачивание описаний типов, методик поверки, проверка сроков действия и подбор поверенного инструмента.',
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogImage: `${siteConfig.url}/img/logo.svg`,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
})

const faqItems = [
  {
    value: 'faq-1',
    label: 'Что такое ФГИС РСТ и Государственный реестр средств измерений (ГРСИ)?',
    icon: 'i-lucide-database',
    description: 'Государственный реестр средств измерений (ГРСИ) — это официальный раздел Федерального информационного фонда по обеспечению единства измерений, курируемый Федеральным агентством по техническому регулированию и метрологии (Росстандарт) в соответствии с Федеральным законом № 102-ФЗ. В реестр включаются только те типы средств измерений, которые успешно прошли государственные метрологические испытания и допущены к применению на территории Российской Федерации.',
    content: 'Государственный реестр средств измерений (ГРСИ) — это официальный раздел Федерального информационного фонда по обеспечению единства измерений, курируемый Федеральным агентством по техническому регулированию и метрологии (Росстандарт) в соответствии с Федеральным законом № 102-ФЗ. В реестр включаются только те типы средств измерений, которые успешно прошли государственные метрологические испытания и допущены к применению на территории Российской Федерации.',
  },
  {
    value: 'faq-2',
    label: 'Как найти методику поверки или описание типа СИ?',
    icon: 'i-lucide-help-circle',
    description: 'Введите в форму поиска номер в Госреестре СИ (например, 72189-18), наименование прибора или его тип. В результатах поиска выберите запись — в блоке официальных документов будут доступны прямые ссылки для скачивания Описания типа (ОТ) и Методики поверки (МП) в формате PDF.',
    content: 'Введите в форму поиска номер в Госреестре СИ (например, 72189-18), наименование прибора или его тип. В результатах поиска выберите запись — в блоке официальных документов будут доступны прямые ссылки для скачивания Описания типа (ОТ) и Методики поверки (МП) в формате PDF.',
  },
  {
    value: 'faq-3',
    label: 'Что такое Описание типа (ОТ) и Методика поверки (МП)?',
    icon: 'i-lucide-file-text',
    description: 'Описание типа (ОТ) — это официальный нормативный документ Росстандарта, содержащий обязательные метрологические и технические характеристики прибора: диапазон измерений, пределы допускаемых погрешностей, условия эксплуатации, габариты и комплектность. Методика поверки (МП / МИ) — инструкция, определяющая перечень операций, оборудование и условия для проведения первичной и периодической поверки данного типа средств измерений.',
    content: 'Описание типа (ОТ) — это официальный нормативный документ Росстандарта, содержащий обязательные метрологические и технические характеристики прибора: диапазон измерений, пределы допускаемых погрешностей, условия эксплуатации, габариты и комплектность. Методика поверки (МП / МИ) — инструкция, определяющая перечень операций, оборудование и условия для проведения первичной и периодической поверки данного типа средств измерений.',
  },
  {
    value: 'faq-4',
    label: 'Как проверить, внесён ли инструмент в Госреестр СИ?',
    icon: 'i-lucide-search',
    description: 'Воспользуйтесь формой поиска в начале страницы: укажите номер ГРСИ (например, 72189-18, 9289-83), обозначение типа (ШЦ-I, МК, ИЧ), наименование или завод-изготовитель. В результатах поиска будет отображена карточка записи с актуальным сроком действия свидетельства и прямыми ссылками на скачивание Описания типа и Методики поверки в формате PDF.',
    content: 'Воспользуйтесь формой поиска в начале страницы: укажите номер ГРСИ (например, 72189-18, 9289-83), обозначение типа (ШЦ-I, МК, ИЧ), наименование или завод-изготовитель. В результатах поиска будет отображена карточка записи с актуальным сроком действия свидетельства и прямыми ссылками на скачивание Описания типа и Методики поверки в формате PDF.',
  },
  {
    value: 'faq-5',
    label: 'Можно ли заказать прибор сразу с первичной поверкой?',
    icon: 'i-lucide-shopping-cart',
    description: 'Да. ООО ТД «Челябинский Инструмент» организует первичную и периодическую поверку поставляемого измерительного инструмента в аккредитованных метрологических лабораториях (ФБУ «Челябинский ЦСМ», ЦИЛ ЧИЗ и др.) с оформлением свидетельства о поверке государственного образца. Доставка осуществляется по всей России.',
    content: 'Да. ООО ТД «Челябинский Инструмент» организует первичную и периодическую поверку поставляемого измерительного инструмента в аккредитованных метрологических лабораториях (ФБУ «Челябинский ЦСМ», ЦИЛ ЧИЗ и др.) с оформлением свидетельства о поверке государственного образца. Доставка осуществляется по всей России.',
  },
]

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Материалы',
        item: `${siteConfig.url}/materials`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ФГИС РСТ (Госреестр СИ)',
      },
    ],
  }),
  defineWebPage({
    '@type': ['WebPage', 'FAQPage'],
    name: 'Поиск по ФГИС РСТ (Госреестр СИ) онлайн',
    description: 'База утвержденных типов средств измерений, скачивание описаний типов (ОТ) и методик поверки (МП).',
  }),
  ...faqItems.map(faq =>
    defineQuestion({
      name: faq.label,
      acceptedAnswer: faq.content,
    }),
  ),
  defineSoftwareApp({
    name: 'Онлайн-поиск по Госреестру СИ (ФГИС РСТ)',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
  }),
])

const breadcrumbItems = [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: 'Материалы',
    icon: 'i-lucide-book-open',
    to: '/materials',
  },
  {
    label: 'ФГИС РСТ (Госреестр СИ)',
    icon: 'i-lucide-database',
  },
]

const route = useRoute()

// Filter State
const filterState = reactive({
  number: '',
  title: '',
  notation: '',
  manufacturers: '',
})

// Number input keyboard & paste sanitizer
const onNumberKeydown = event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length > 1) {
    return
  }
  if (!/^[\d-]$/.test(event.key)) {
    event.preventDefault()
  }
}

watch(
  () => filterState.number,
  val => {
    if (!val) return
    const sanitized = val.replace(/[^\d-]/g, '')
    if (sanitized !== val) {
      filterState.number = sanitized
    }
  },
  { flush: 'sync' },
)

// Search Results & Preloaded Registry Numbers
const allDocs = shallowRef([])
const numFound = ref(0)
const hasSearched = ref(false)
const loadingSearch = ref(false)
const loadingProducts = ref(false)
const filterOnlyInCatalog = ref(false)
const numbersMap = ref({}) // { [number]: productCount }

// Selected Record & Products Cache
const selectedDoc = ref(null)
const productsCache = reactive(new Map())
const isBottomSheetOpen = ref(false)

const selectedProducts = computed(() => {
  if (!selectedDoc.value) return []
  return productsCache.get(selectedDoc.value.number) || []
})

// Filtered docs based on "In Catalog only" toggle
const filteredDocs = computed(() => {
  if (!filterOnlyInCatalog.value) return allDocs.value
  return allDocs.value.filter(doc => (numbersMap.value[doc.number] || 0) > 0)
})

// Total count of records with products in catalog
const countWithProducts = computed(() => {
  return allDocs.value.filter(doc => (numbersMap.value[doc.number] || 0) > 0).length
})

// Sorting
const sortField = ref('relevance')
const sortDirection = ref('asc')
const sortFieldOptions = [
  { label: 'По релевантности', value: 'relevance' },
  { label: 'По номеру', value: 'number' },
  { label: 'По наименованию', value: 'name' },
  { label: 'По обозначению', value: 'type_si' },
  { label: 'По производителю', value: 'brand' },
  { label: 'По сроку действия', value: 'date' },
]

// Sorted Docs
const sortedDocs = computed(() => {
  const list = [...filteredDocs.value]
  if (sortField.value === 'relevance') {
    return list
  }

  const dir = sortDirection.value === 'asc' ? 1 : -1

  return list.sort((a, b) => {
    switch (sortField.value) {
      case 'number':
        return dir * (a.number || '').localeCompare(b.number || '')
      case 'name':
        return dir * (a.name || '').localeCompare(b.name || '', 'ru')
      case 'type_si':
        return dir * (a.type_si || '').localeCompare(b.type_si || '', 'ru')
      case 'brand':
        return dir * (a.brand || '').localeCompare(b.brand || '', 'ru')
      case 'date': {
        const timeA = a.date ? new Date(a.date).getTime() : 0
        const timeB = b.date ? new Date(b.date).getTime() : 0
        if (!timeA && !timeB) return 0
        if (!timeA) return 1
        if (!timeB) return -1
        return dir * (timeA - timeB)
      }
      default:
        return 0
    }
  })
})

// Pagination (Reference: app/pages/admin/log.vue:617-641)
const page = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [
  { label: '20 строк', value: 20 },
  { label: '50 строк', value: 50 },
  { label: '100 строк', value: 100 },
]

const totalFiltered = computed(() => sortedDocs.value.length)

const paginatedDocs = computed(() => {
  const size = Number(pageSize.value) || 20
  const start = (page.value - 1) * size
  return sortedDocs.value.slice(start, start + size)
})

const pageRangeText = computed(() => {
  if (totalFiltered.value === 0) return '0 из 0'
  const size = Number(pageSize.value) || 20
  const start = (page.value - 1) * size + 1
  const end = Math.min(page.value * size, totalFiltered.value)
  return `${start}–${end} из ${totalFiltered.value}`
})

watch([filterOnlyInCatalog, pageSize], () => {
  page.value = 1
})

watch([sortField, sortDirection], () => {
  page.value = 1
  if (import.meta.client && window.innerWidth >= 1024 && paginatedDocs.value.length) {
    handleSelectDoc(paginatedDocs.value[0], false)
  }
})

// Reset Filters
const resetFilters = () => {
  filterState.number = ''
  filterState.title = ''
  filterState.notation = ''
  filterState.manufacturers = ''
  filterOnlyInCatalog.value = false
  sortField.value = 'relevance'
  sortDirection.value = 'asc'
  page.value = 1
  allDocs.value = []
  numFound.value = 0
  hasSearched.value = false
  selectedDoc.value = null
  if (import.meta.client) {
    const url = new URL(window.location.href)
    url.search = ''
    window.history.replaceState({}, '', url)
  }
}

let numbersMapPromise = null
const loadNumbersMap = () => {
  if (!numbersMapPromise) {
    numbersMapPromise = $fetch('/api/fgis/numbers')
      .then(res => {
        numbersMap.value = res || {}
      })
      .catch(e => {
        console.warn('Could not load local registry numbers map:', e)
        numbersMap.value = {}
      })
  }
  return numbersMapPromise
}

// Fetch products for a specific registry number on-demand
const loadProductsForDoc = async doc => {
  if (!doc?.number) return
  if (productsCache.has(doc.number)) return

  // Wait for numbers map preload to finish to avoid false 0-count cache
  if (numbersMapPromise) {
    await numbersMapPromise
  }

  // Check if our store has products for this number
  const count = numbersMap.value[doc.number] || 0
  if (count === 0) {
    productsCache.set(doc.number, [])
    return
  }

  loadingProducts.value = true
  try {
    const products = await $fetch(`/api/fgis/products?number=${encodeURIComponent(doc.number)}`)
    productsCache.set(doc.number, products || [])
  } catch (err) {
    console.error('Error fetching products for registry number:', err)
    productsCache.set(doc.number, [])
  } finally {
    loadingProducts.value = false
  }
}

// Selection handler (desktop sidebar or mobile bottom sheet)
const handleSelectDoc = (doc, openModalOnMobile = false) => {
  selectedDoc.value = doc
  loadProductsForDoc(doc)

  // On mobile screens (< 1024px), open bottom sheet only upon explicit user tap
  if (openModalOnMobile && import.meta.client && window.innerWidth < 1024) {
    isBottomSheetOpen.value = true
  }
}

// Execute search
const search = async () => {
  const hasFilter = Object.values(filterState).some(val => val && val.trim())
  if (!hasFilter) {
    showNotice({
      title: 'Параметры поиска не заданы',
      description: 'Пожалуйста, заполните хотя бы одно поле для поиска.',
      type: 'info',
    })
    return
  }

  loadingSearch.value = true
  page.value = 1

  // Synchronize URL query params via history.replaceState (same pattern as CatalogFilter/CatalogWrapper)
  if (import.meta.client) {
    const url = new URL(window.location.href)
    url.search = ''
    if (filterState.number.trim()) url.searchParams.set('number', filterState.number.trim())
    if (filterState.title.trim()) url.searchParams.set('title', filterState.title.trim())
    if (filterState.notation.trim()) url.searchParams.set('notation', filterState.notation.trim())
    if (filterState.manufacturers.trim()) url.searchParams.set('manufacturers', filterState.manufacturers.trim())
    window.history.replaceState({}, '', url)
  }

  try {
    const response = await $fetch('/api/fgis/search', {
      method: 'POST',
      body: filterState,
    })

    allDocs.value = response.docs || []
    numFound.value = response.numFound || 0
    hasSearched.value = true
    sortField.value = 'relevance'
    sortDirection.value = 'asc'

    if (allDocs.value.length > 0) {
      handleSelectDoc(allDocs.value[0])
    } else {
      selectedDoc.value = null
    }

    if (numFound.value > 100) {
      showNotice({
        title: `Найдено документов: ${numFound.value}`,
        description: 'Показаны первые 100 записей. Пожалуйста, уточните параметры поиска при необходимости.',
      })
    }
  } catch (error) {
    console.error('Search error:', error)
    if (error.data?.debug) {
      console.error('[FGIS Search Debug]:', error.data.debug, error.data.attempts)
    }

    const userMessage =
      error.data?.statusMessage ||
      error.data?.message ||
      (typeof error.data === 'string' && error.data ? error.data : null) ||
      'Сервер ФГИС РСТ (Росстандарт) временно недоступен или отклонил запрос. Пожалуйста, повторите попытку через несколько секунд.'

    showNotice({
      title: 'Ошибка при поиске',
      description: userMessage,
      type: 'error',
    })
  } finally {
    loadingSearch.value = false
  }
}

// Open feedback modal pre-filled with registry details
const openFeedback = (doc = selectedDoc.value) => {
  if (isBottomSheetOpen.value) {
    isBottomSheetOpen.value = false
  }
  const numberText = doc?.number ? ` № ${doc.number}` : ''
  const details = doc ? [`ГРСИ: № ${doc.number}`, doc.name ? `Наименование: ${doc.name}` : null, doc.type_si ? `Тип СИ: ${doc.type_si}` : null, doc.brand ? `Изготовитель: ${doc.brand}` : null].filter(Boolean).join('\n') : ''

  showFeedback({
    title: `Заявка по ГРСИ${numberText}`,
    description: 'Оставьте заявку — оперативно уточним возможность поставки или подберём аналог.',
    message: details ? `Здравствуйте! Прошу уточнить возможность поставки или подобрать аналог по реестру:\n${details}\n` : '',
  })
}

// Initial mount: preload numbers map and check URL queries
onMounted(async () => {
  // Preload local registry numbers
  loadNumbersMap()

  // Restore filters from URL query params
  let shouldAutoSearch = false
  if (route.query.number) {
    filterState.number = String(route.query.number)
    shouldAutoSearch = true
  }
  if (route.query.title) {
    filterState.title = String(route.query.title)
    shouldAutoSearch = true
  }
  if (route.query.notation) {
    filterState.notation = String(route.query.notation)
    shouldAutoSearch = true
  }
  if (route.query.manufacturers) {
    filterState.manufacturers = String(route.query.manufacturers)
    shouldAutoSearch = true
  }

  if (shouldAutoSearch) {
    search()
  }
})
</script>

<template>
  <article class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
    <!-- Breadcrumbs / Top header -->
    <header class="mb-6 space-y-2 border-b border-slate-200 pb-5">
      <UBreadcrumb :items="breadcrumbItems" />
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 class="font-accent text-2xl tracking-tight text-slate-900 sm:text-3xl">Поиск по ФГИС РСТ (Госреестр СИ)</h1>
          <p class="mt-1 text-sm text-slate-600">Информация из официальной базы утвержденных типов средств измерения</p>
        </div>
      </div>
    </header>

    <!-- Search Form Block -->
    <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      <UForm
        as="form"
        :state="filterState"
        @submit="search">
        <div class="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UFormField label="Номер ГРСИ">
            <UInput
              id="fgis-number-input"
              v-model="filterState.number"
              placeholder="например, 72189-18"
              type="search"
              inputmode="numeric"
              class="w-full"
              @keydown="onNumberKeydown"
              @keydown.enter.prevent="search" />
          </UFormField>

          <UFormField label="Наименование СИ">
            <UInput
              v-model="filterState.title"
              placeholder="Штангенциркули, микрометры..."
              type="search"
              class="w-full"
              @keydown.enter.prevent="search" />
          </UFormField>

          <UFormField label="Обозначение / Тип СИ">
            <UInput
              v-model="filterState.notation"
              placeholder="ШЦ-I, МК, ИЧ..."
              type="search"
              class="w-full"
              @keydown.enter.prevent="search" />
          </UFormField>

          <UFormField label="Производитель">
            <UInput
              v-model="filterState.manufacturers"
              placeholder="Завод, страна..."
              type="search"
              class="w-full"
              @keydown.enter.prevent="search" />
          </UFormField>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              type="submit"
              icon="i-lucide-search"
              label="Найти во ФГИС"
              color="primary"
              :loading="loadingSearch"
              class="px-5"
              @click="search" />

            <UButton
              type="button"
              variant="outline"
              color="neutral"
              icon="i-lucide-rotate-ccw"
              label="Очистить"
              @click="resetFilters" />
          </div>

          <!-- In-catalog filter chip (visible only if search has results) -->
          <div
            v-if="hasSearched && allDocs.length"
            class="flex items-center gap-2">
            <button
              type="button"
              @click="filterOnlyInCatalog = !filterOnlyInCatalog"
              class="flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition"
              :class="filterOnlyInCatalog ? 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'">
              <UIcon
                name="i-lucide-shopping-cart"
                class="size-3.5 text-emerald-600" />
              <span>Только с товарами в каталоге ({{ countWithProducts }})</span>
            </button>
          </div>
        </div>
      </UForm>
    </section>

    <!-- Initial Search-First Hero (shown before first search) -->
    <section
      v-if="!hasSearched && !loadingSearch"
      class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
      <div class="mx-auto max-w-2xl space-y-4">
        <div class="inline-flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <UIcon
            name="i-lucide-search"
            class="size-7" />
        </div>
        <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Быстрый поиск по базе Росстандарта</h2>
        <p class="text-sm leading-relaxed text-slate-500">Введите номер в Госреестре, наименование средства измерения, его тип или производителя. Сервис автоматически найдёт официальные описания типов и методики поверки, а также покажет подходящий инструмент из нашего каталога.</p>

        <!-- Service Features Grid -->
        <div class="grid grid-cols-1 gap-3 pt-4 text-left sm:grid-cols-3">
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <UIcon
                name="i-lucide-file-text"
                class="size-4 text-indigo-600" />
              <span>Описания типов (ОТ)</span>
            </div>
            <p class="mt-1 text-[11px] text-slate-500">Прямой доступ к официальным PDF-документам с метрологическими характеристиками.</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <UIcon
                name="i-lucide-check-circle-2"
                class="size-4 text-emerald-600" />
              <span>Методики поверки (МП)</span>
            </div>
            <p class="mt-1 text-[11px] text-slate-500">Проверенные методики первичной и периодической поверки из Госреестра.</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <UIcon
                name="i-lucide-shopping-bag"
                class="size-4 text-blue-600" />
              <span>Товары в каталоге</span>
            </div>
            <p class="mt-1 text-[11px] text-slate-500">Мгновенный подбор поверенного измерительного инструмента в каталоге магазина.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty Results State -->
    <section
      v-else-if="hasSearched && !loadingSearch && allDocs.length === 0"
      class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
      <div class="mx-auto max-w-md space-y-3">
        <div class="inline-flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <UIcon
            name="i-heroicons-information-circle"
            class="size-6" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">По вашему запросу ничего не найдено</h3>
        <p class="text-xs leading-relaxed text-slate-500">В Государственном реестре СИ (ФГИС РСТ) не обнаружено документов по заданным критериям. Попробуйте сократить запрос или проверить правильность номера ГРСИ.</p>
        <UButton
          variant="outline"
          color="neutral"
          label="Сбросить фильтры"
          size="sm"
          class="mt-2"
          @click="resetFilters" />
      </div>
    </section>

    <!-- Main Results Layout: Master List + Desktop Sticky Sidebar -->
    <main
      v-else-if="hasSearched && allDocs.length > 0"
      id="search-results"
      class="grid scroll-mt-6 grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <!-- Left Column: Master Registry List -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-7">
        <!-- List Header -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs">
          <div class="shrink-0 font-bold tracking-wider text-slate-700 uppercase">
            Реестр СИ
            <span class="font-normal text-slate-500">({{ totalFiltered }})</span>
          </div>

          <!-- Sorting Controls (Replaces hint text) -->
          <div class="flex items-center gap-1.5">
            <UButton
              size="xs"
              variant="outline"
              color="neutral"
              :disabled="sortField === 'relevance'"
              :icon="sortDirection === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'"
              :title="sortField === 'relevance' ? 'Сортировка по релевантности' : sortDirection === 'asc' ? 'По возрастанию (нажмите для смены на убывание)' : 'По убыванию (нажмите для смены на возрастание)'"
              @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" />
            <USelect
              v-model="sortField"
              :items="sortFieldOptions"
              size="xs"
              class="w-40 sm:w-44" />
          </div>
        </div>

        <!-- Scrollable List of Records -->
        <div class="max-h-[640px] divide-y divide-slate-100 overflow-y-auto">
          <div
            v-for="doc in paginatedDocs"
            :key="doc.number"
            @click="handleSelectDoc(doc, true)"
            class="cursor-pointer p-4 transition hover:bg-slate-50/80"
            :class="{
              'border-l-4 border-l-indigo-600 bg-indigo-50/60': selectedDoc?.number === doc.number,
              'bg-emerald-50/30': (numbersMap[doc.number] || 0) > 0 && selectedDoc?.number !== doc.number,
            }">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-sm font-bold text-slate-900">№ {{ doc.number }}</span>
                  <span
                    v-if="doc.type_si"
                    class="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {{ doc.type_si }}
                  </span>
                </div>
                <div class="mt-1 text-sm leading-snug font-semibold text-slate-900">
                  {{ doc.name }}
                </div>
                <div
                  v-if="doc.brand"
                  class="mt-1 line-clamp-1 text-xs text-slate-500">
                  {{ doc.brand }}
                </div>
              </div>

              <!-- Badges & Expiry -->
              <div class="shrink-0 space-y-1 text-right">
                <div v-if="(numbersMap[doc.number] || 0) > 0">
                  <span class="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 shadow-2xs">
                    <UIcon
                      name="i-lucide-check"
                      class="size-3 text-emerald-600" />
                    {{ numbersMap[doc.number] }} в каталоге
                  </span>
                </div>
                <div v-else-if="doc.number in numbersMap">
                  <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">В базе (под заказ)</span>
                </div>

                <div
                  v-if="doc.date"
                  class="text-[11px] text-slate-400">
                  до {{ new Date(doc.date).toLocaleDateString('ru-RU') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Bar (Reference: app/pages/admin/log.vue:617-641) -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 p-3 text-xs">
          <div class="text-slate-500">
            Показано
            <span class="font-semibold text-slate-700">{{ pageRangeText }}</span>
            <span v-if="numFound > totalFiltered">(всего во ФГИС: {{ numFound }})</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-500">На странице:</span>
              <USelect
                v-model="pageSize"
                :items="pageSizeOptions"
                size="xs"
                class="w-28" />
            </div>

            <UPagination
              v-if="totalFiltered > Number(pageSize)"
              v-model:page="page"
              :items-per-page="Number(pageSize)"
              :total="totalFiltered"
              size="xs" />
          </div>
        </div>
      </div>

      <!-- Right Column: Desktop Sticky Detail Card -->
      <div class="hidden space-y-4 lg:sticky lg:top-[74px] lg:col-span-5 lg:block">
        <div
          v-if="selectedDoc"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <FgisDocDetails
            :doc="selectedDoc"
            :products="selectedProducts"
            :loading="loadingProducts"
            max-height="500px"
            @feedback="openFeedback(selectedDoc)" />
        </div>

        <div
          v-else
          class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-xs">
          <UIcon
            name="i-lucide-search"
            class="mx-auto mb-2 size-8 text-slate-300" />
          <p class="text-sm font-medium">Выберите номер реестра в левом списке для просмотра подробностей и товаров в каталоге</p>
        </div>
      </div>
    </main>

    <!-- SEO & FAQ Knowledge Section (Generative Engine Optimization) -->
    <section class="mt-12 space-y-8 border-t border-slate-200 pt-10">
      <!-- Section Header -->
      <div class="space-y-2">
        <h2 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Справочная информация о Государственном реестре СИ (ФГИС РСТ)</h2>
        <p class="text-sm leading-relaxed text-slate-600">Федеральный информационный фонд по обеспечению единства измерений Федерального агентства по техническому регулированию и метрологии (Росстандарт).</p>
      </div>

      <!-- Feature Grid: 3 cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div class="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <UIcon
              name="i-lucide-award"
              class="size-5" />
          </div>
          <h3 class="text-sm font-bold text-slate-900">Утвержденные типы СИ</h3>
          <p class="mt-1.5 text-xs leading-relaxed text-slate-500">Внесение в ГРСИ подтверждает успешное прохождение государственных испытаний и допуск средства измерений к применению в сфере госрегулирования (ФЗ № 102).</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div class="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <UIcon
              name="i-lucide-file-text"
              class="size-5" />
          </div>
          <h3 class="text-sm font-bold text-slate-900">Официальные описания и методики</h3>
          <p class="mt-1.5 text-xs leading-relaxed text-slate-500">Прямой доступ к официальным нормативным документам: Описаниям типа (ОТ) и Методикам поверки (МП / МИ) в формате PDF без ограничений.</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div class="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UIcon
              name="i-lucide-shopping-cart"
              class="size-5" />
          </div>
          <h3 class="text-sm font-bold text-slate-900">Поставка инструмента с поверкой</h3>
          <p class="mt-1.5 text-xs leading-relaxed text-slate-500">ТД «Челябинский Инструмент» организует первичную поверку приборов в аккредитованных лабораториях с оформлением свидетельства о поверке и доставкой по РФ.</p>
        </div>
      </div>

      <!-- FAQ Section with UAccordion -->
      <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-slate-900">Часто задаваемые вопросы (FAQ)</h3>
          <p class="text-xs text-slate-500">Ответы на популярные вопросы о Государственном реестре СИ, поверке и заказе сертифицированного инструмента</p>
        </div>

        <UAccordion
          type="multiple"
          :items="faqItems"
          class="divide-y divide-slate-100">
          <template #body="{ item }">
            <div class="px-2 py-3 text-xs leading-relaxed text-slate-600">
              {{ item.content }}
            </div>
          </template>
          <template #content="{ item }">
            <div class="px-2 py-3 text-xs leading-relaxed text-slate-600">
              {{ item.content }}
            </div>
          </template>
        </UAccordion>
      </div>
    </section>

    <!-- Mobile Bottom Sheet (Drawer) Modal (< lg) -->
    <div
      v-if="isBottomSheetOpen && selectedDoc"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
      @click.self="isBottomSheetOpen = false">
      <div class="max-h-[85vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl">
        <!-- Drag Handle Indicator -->
        <div class="mx-auto -mt-1 mb-2 h-1.5 w-12 rounded-full bg-slate-300"></div>

        <FgisDocDetails
          :doc="selectedDoc"
          :products="selectedProducts"
          :loading="loadingProducts"
          is-mobile
          @close="isBottomSheetOpen = false"
          @feedback="openFeedback(selectedDoc)" />

        <UButton
          color="neutral"
          variant="outline"
          label="Закрыть"
          class="w-full justify-center"
          @click="isBottomSheetOpen = false" />
      </div>
    </div>
  </article>
</template>
