<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

useTitle('ФГИС «АРШИН» — Поиск по Госреестру СИ (ГРСИ) | chelinstrument.ru')
useSeoMeta({
  description: 'Онлайн-поиск по Государственному реестру средств измерений (ФГИС АРШИН Росстандарта). Скачивание официальных описаний типов СИ и методик поверки. Подбор и покупка поверенного инструмента.',
  keywords: 'ФГИС АРШИН, ГРСИ, Госреестр СИ, описание типа СИ, методика поверки, поверка инструмента, купить поверенный инструмент',
})

const siteConfig = useSiteConfig()

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
        name: 'ФГИС «АРШИН» Госреестр СИ',
      },
    ],
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
    label: 'ФГИС «АРШИН» Госреестр СИ',
    icon: 'i-lucide-database',
  },
]

const route = useRoute()
const router = useRouter()

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

// Internal products pagination (defaults to 10 items per page)
const productPage = ref(1)
const productPageSize = ref(10)
const productPageSizeOptions = [
  { label: '10 шт.', value: 10 },
  { label: '20 шт.', value: 20 },
  { label: '50 шт.', value: 50 },
]

const totalSelectedProducts = computed(() => selectedProducts.value.length)

const paginatedProducts = computed(() => {
  const size = Number(productPageSize.value) || 10
  const start = (productPage.value - 1) * size
  return selectedProducts.value.slice(start, start + size)
})

const productPageRangeText = computed(() => {
  if (totalSelectedProducts.value === 0) return '0 из 0'
  const size = Number(productPageSize.value) || 10
  const start = (productPage.value - 1) * size + 1
  const end = Math.min(productPage.value * size, totalSelectedProducts.value)
  return `${start}–${end} из ${totalSelectedProducts.value}`
})

watch([selectedDoc, productPageSize], () => {
  productPage.value = 1
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
  router.replace({ query: {} })
}

// Fetch products for a specific registry number on-demand
const loadProductsForDoc = async doc => {
  if (!doc?.number) return
  if (productsCache.has(doc.number)) return

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

  // Synchronize URL query params
  const query = {}
  if (filterState.number.trim()) query.number = filterState.number.trim()
  if (filterState.title.trim()) query.title = filterState.title.trim()
  if (filterState.notation.trim()) query.notation = filterState.notation.trim()
  if (filterState.manufacturers.trim()) query.manufacturers = filterState.manufacturers.trim()
  router.replace({ query })

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
      if (import.meta.client && window.innerWidth < 1024) {
        setTimeout(() => {
          const el = document.getElementById('search-results')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
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
    showNotice({
      title: 'Ошибка при поиске',
      description: error.statusMessage || error.message || 'Не удалось получить данные из ФГИС.',
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
  try {
    numbersMap.value = (await $fetch('/api/fgis/numbers')) || {}
  } catch (e) {
    console.warn('Could not load local registry numbers map:', e)
  }

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
        :state="filterState"
        @submit="search">
        <div class="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UFormField label="Номер ГРСИ">
            <UInput
              v-model="filterState.number"
              placeholder="например, 72189-18"
              type="search"
              inputmode="numeric"
              class="w-full"
              @keydown="onNumberKeydown" />
          </UFormField>

          <UFormField label="Наименование СИ">
            <UInput
              v-model="filterState.title"
              placeholder="Штангенциркули, микрометры..."
              type="search"
              class="w-full" />
          </UFormField>

          <UFormField label="Обозначение / Тип СИ">
            <UInput
              v-model="filterState.notation"
              placeholder="ШЦ-I, МК, ИЧ..."
              type="search"
              class="w-full" />
          </UFormField>

          <UFormField label="Производитель">
            <UInput
              v-model="filterState.manufacturers"
              placeholder="Завод, страна..."
              type="search"
              class="w-full" />
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
              class="px-5" />

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
        <p class="text-sm leading-relaxed text-slate-500">Введите номер в Госреестре, наименование средства измерения, его тип или производителя. Сервис автоматически найдёт официальные описания типов и методики поверки, а также покажет поверенный инструмент из нашего каталога.</p>

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
        <p class="text-xs leading-relaxed text-slate-500">В реестре ФГИС «АРШИН» не обнаружено документов по заданным критериям. Попробуйте сократить запрос или проверить правильность номера ГРСИ.</p>
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
          class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <!-- Card Header -->
          <div class="border-b border-slate-100 pb-4">
            <div class="flex items-center justify-between">
              <span class="font-mono text-lg font-bold text-indigo-700">ГРСИ № {{ selectedDoc.number }}</span>
              <span
                v-if="selectedDoc.date"
                class="text-xs text-slate-500">
                Действует до {{ new Date(selectedDoc.date).toLocaleDateString('ru-RU') }}
              </span>
            </div>
            <h3 class="mt-2 text-base leading-snug font-bold text-slate-900">
              {{ selectedDoc.name }}
            </h3>
            <p
              v-if="selectedDoc.brand"
              class="mt-1 text-xs text-slate-500">
              {{ selectedDoc.brand }}
            </p>
          </div>

          <!-- Official Documents Links -->
          <div
            v-if="selectedDoc.file_ot?.uuid || selectedDoc.file_mp?.uuid"
            class="space-y-2">
            <h4 class="text-xs font-bold tracking-wider text-slate-400 uppercase">Официальные документы ФГИС</h4>
            <div
              class="grid gap-2"
              :class="selectedDoc.file_ot?.uuid && selectedDoc.file_mp?.uuid ? 'grid-cols-2' : 'grid-cols-1'">
              <a
                v-if="selectedDoc.file_ot?.uuid"
                :href="`/api/fgis/file/${selectedDoc.file_ot.uuid}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs transition hover:border-indigo-400 hover:bg-indigo-50/50">
                <UIcon
                  name="i-lucide-file-text"
                  class="size-6 shrink-0 text-red-500" />
                <div class="min-w-0">
                  <div class="font-semibold text-slate-800">Описание типа</div>
                  <div class="text-[10px] text-slate-400">PDF в новой вкладке</div>
                </div>
              </a>

              <a
                v-if="selectedDoc.file_mp?.uuid"
                :href="`/api/fgis/file/${selectedDoc.file_mp.uuid}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs transition hover:border-indigo-400 hover:bg-indigo-50/50">
                <UIcon
                  name="i-lucide-file-text"
                  class="size-6 shrink-0 text-blue-500" />
                <div class="min-w-0">
                  <div class="font-semibold text-slate-800">Методика поверки</div>
                  <div class="text-[10px] text-slate-400">PDF в новой вкладке</div>
                </div>
              </a>
            </div>
          </div>

          <!-- Catalog Products Marketing Showcase -->
          <div
            id="catalog-products-section"
            class="space-y-3 border-t border-slate-100 pt-4">
            <div class="flex items-center justify-between">
              <h4 class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                <UIcon
                  name="i-lucide-shopping-cart"
                  class="size-4 text-emerald-600" />
                <span>Товары в каталоге по ГРСИ № {{ selectedDoc.number }}</span>
              </h4>
              <span
                v-if="totalSelectedProducts"
                class="text-xs font-semibold text-emerald-700">
                {{ productPageRangeText }}
              </span>
            </div>

            <!-- Loading Spinner -->
            <div
              v-if="loadingProducts"
              class="py-6 text-center text-xs text-slate-400">
              Загрузка товаров из каталога...
            </div>

            <!-- Catalog Products List -->
            <template v-else-if="totalSelectedProducts > 0">
              <!-- Desktop Products Mini-Pagination Bar (Top, 1 line, no label) -->
              <div
                v-if="totalSelectedProducts > 10"
                class="flex items-center justify-between gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-1.5 text-xs">
                <USelect
                  v-model="productPageSize"
                  :items="productPageSizeOptions"
                  size="xs"
                  class="w-20 shrink-0" />

                <UPagination
                  v-if="totalSelectedProducts > Number(productPageSize)"
                  v-model:page="productPage"
                  :items-per-page="Number(productPageSize)"
                  :total="totalSelectedProducts"
                  :sibling-count="1"
                  size="xs" />
              </div>

              <div class="@container flex max-h-[500px] flex-col gap-y-2 overflow-y-auto py-1 pr-1">
                <CatalogProductCard
                  v-for="prod in paginatedProducts"
                  :key="prod.id"
                  :prod="prod"
                  class="shrink-0" />
              </div>
            </template>

            <!-- Fallback Banner when no products in catalog -->
            <div
              v-else
              class="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <div class="flex items-center gap-1.5 font-bold">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="size-4 text-amber-600" />
                <span>Точного соответствия в каталоге нет</span>
              </div>
              <p class="leading-relaxed text-amber-800">Оставьте заявку — оперативно уточним возможность поставки или подберём аналог.</p>
              <UButton
                size="xs"
                color="warning"
                variant="subtle"
                label="Оставить заявку"
                class="w-full justify-center"
                @click="openFeedback()" />
            </div>
          </div>
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

    <!-- Mobile Bottom Sheet (Drawer) Modal (< lg) -->
    <div
      v-if="isBottomSheetOpen && selectedDoc"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
      @click.self="isBottomSheetOpen = false">
      <div class="max-h-[85vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl">
        <!-- Drag Handle Indicator -->
        <div class="mx-auto -mt-1 mb-2 h-1.5 w-12 rounded-full bg-slate-300"></div>

        <!-- Header -->
        <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-mono text-base font-bold text-indigo-700">ГРСИ № {{ selectedDoc.number }}</span>
              <span
                v-if="selectedDoc.type_si"
                class="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {{ selectedDoc.type_si }}
              </span>
            </div>
            <h3 class="mt-1 text-sm leading-snug font-bold text-slate-900">
              {{ selectedDoc.name }}
            </h3>
            <p
              v-if="selectedDoc.brand"
              class="mt-0.5 text-xs text-slate-500">
              {{ selectedDoc.brand }}
            </p>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="isBottomSheetOpen = false" />
        </div>

        <!-- PDF Links -->
        <div
          v-if="selectedDoc.file_ot?.uuid || selectedDoc.file_mp?.uuid"
          class="space-y-1.5">
          <div class="text-xs font-bold tracking-wider text-slate-400 uppercase">Официальные документы</div>
          <div
            class="grid gap-2"
            :class="selectedDoc.file_ot?.uuid && selectedDoc.file_mp?.uuid ? 'grid-cols-2' : 'grid-cols-1'">
            <a
              v-if="selectedDoc.file_ot?.uuid"
              :href="`/api/fgis/file/${selectedDoc.file_ot.uuid}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs">
              <UIcon
                name="i-lucide-file-text"
                class="size-5 shrink-0 text-red-500" />
              <div class="min-w-0">
                <div class="font-semibold text-slate-800">Описание типа</div>
                <div class="text-[10px] text-slate-400">PDF</div>
              </div>
            </a>

            <a
              v-if="selectedDoc.file_mp?.uuid"
              :href="`/api/fgis/file/${selectedDoc.file_mp.uuid}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs">
              <UIcon
                name="i-lucide-file-text"
                class="size-5 shrink-0 text-blue-500" />
              <div class="min-w-0">
                <div class="font-semibold text-slate-800">Методика поверки</div>
                <div class="text-[10px] text-slate-400">PDF</div>
              </div>
            </a>
          </div>
        </div>

        <!-- Products -->
        <div
          id="mobile-catalog-products-section"
          class="space-y-2 border-t border-slate-100 pt-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <UIcon
                name="i-lucide-shopping-cart"
                class="size-4 text-emerald-600" />
              <span>Товары в каталоге</span>
            </div>
            <span
              v-if="totalSelectedProducts"
              class="text-xs font-bold text-emerald-700">
              {{ productPageRangeText }}
            </span>
          </div>

          <div
            v-if="loadingProducts"
            class="py-4 text-center text-xs text-slate-400">
            Загрузка товаров...
          </div>

          <template v-else-if="totalSelectedProducts > 0">
            <!-- Mobile Products Mini-Pagination Bar (Top, 1 line, no label) -->
            <div
              v-if="totalSelectedProducts > 10"
              class="flex items-center justify-between gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-1.5 text-xs">
              <USelect
                v-model="productPageSize"
                :items="productPageSizeOptions"
                size="xs"
                class="w-20 shrink-0" />

              <UPagination
                v-if="totalSelectedProducts > Number(productPageSize)"
                v-model:page="productPage"
                :items-per-page="Number(productPageSize)"
                :total="totalSelectedProducts"
                :sibling-count="1"
                size="xs" />
            </div>

            <div class="@container flex flex-col gap-y-2 py-1">
              <CatalogProductCard
                v-for="prod in paginatedProducts"
                :key="prod.id"
                :prod="prod" />
            </div>
          </template>

          <div
            v-else
            class="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div class="font-bold">Товаров в каталоге пока нет</div>
            <p class="leading-relaxed text-amber-800">Оставьте заявку — оперативно уточним возможность поставки или подберём аналог.</p>
            <UButton
              size="xs"
              color="warning"
              variant="subtle"
              label="Оставить заявку"
              class="mt-1 w-full justify-center"
              @click="openFeedback()" />
          </div>
        </div>

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
