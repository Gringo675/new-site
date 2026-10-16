<script setup>
//
useTitle('AI Характеристики Товаров | AdminPanel')
await checkAdminOnly()

// Состояние категорий
const cats = shallowRef([])
const activeCatAlias = ref(null)
const previousCatAlias = ref(null)
const catData = ref(null)
const docsDict = ref({ stnd: {}, rstr: {} })
const products = ref([])
const isLoading = ref(false)
let isReverting = false

// Выбранный товар
const activeProductId = ref(null)
const activeProduct = computed(() => {
  return products.value.find(p => p.id === activeProductId.value) || null
})

// Навигация и фильтрация
const currentFilter = ref('all') // 'all' | 'without_ai' | 'with_ai' | 'selected' | 'PASS' | 'FAIL'
const activeTab = ref('preview') // 'preview' | 'edit' | 'split'

const editorTabs = [
  { value: 'preview', label: 'Предпросмотр', icon: 'i-lucide-eye' },
  { value: 'edit', label: 'Редактирование HTML', icon: 'i-lucide-code-xml' },
  { value: 'split', label: 'Сравнение (Было / Стало)', icon: 'i-lucide-columns-2' },
]

// Пакетная генерация и WebSocket
const isBatchRunning = ref(false)
const abortBatchFlag = ref(false)
const includeFailInSave = ref(false)
const batchProgress = reactive({
  current: 0,
  total: 0,
  currentProdName: '',
})
let activeSocket = null

// Индикатор несохраненных изменений
const hasUnsavedChanges = computed(() => {
  return products.value.some(p => p.hasUnsavedChanges)
})

// Подсчет товаров по статусам
const counts = computed(() => {
  const all = products.value.length
  const withoutAi = products.value.filter(p => !p.isAiCharacteristics && !p.isSaved).length
  const withAi = products.value.filter(p => p.isAiCharacteristics || p.isSaved).length
  const selected = products.value.filter(p => p.selected).length
  const pass = products.value.filter(p => (p.status === 'PASS' || p.judgeVerdict === 'PASS') && !p.isSaved).length
  const fail = products.value.filter(p => (p.status === 'FAIL' || p.judgeVerdict === 'FAIL') && !p.isSaved).length
  const unsavedPass = products.value.filter(p => (p.status === 'PASS' || p.judgeVerdict === 'PASS') && !p.isSaved && p.workingCharacteristics).length
  const unsavedGenerated = products.value.filter(p => !p.isSaved && p.workingCharacteristics && (p.status === 'PASS' || p.judgeVerdict === 'PASS' || p.status === 'FAIL' || p.judgeVerdict === 'FAIL' || p.hasUnsavedChanges)).length
  const selectedUnsavedPass = products.value.filter(p => p.selected && (p.status === 'PASS' || p.judgeVerdict === 'PASS') && !p.isSaved && p.workingCharacteristics).length
  const selectedUnsavedGenerated = products.value.filter(p => p.selected && !p.isSaved && p.workingCharacteristics && (p.status === 'PASS' || p.judgeVerdict === 'PASS' || p.status === 'FAIL' || p.judgeVerdict === 'FAIL' || p.hasUnsavedChanges)).length
  return {
    all,
    withoutAi,
    withAi,
    selected,
    pass,
    fail,
    unsavedPass,
    unsavedGenerated,
    selectedUnsavedPass,
    selectedUnsavedGenerated,
  }
})

// Текст и состояние доступности кнопки сохранения
const saveButtonLabel = computed(() => {
  const isSelected = counts.value.selected > 0
  if (isSelected) {
    if (includeFailInSave.value) {
      return `Сохранить выбранные (${counts.value.selectedUnsavedGenerated})`
    }
    return `Сохранить выбранные PASS (${counts.value.selectedUnsavedPass})`
  }
  if (includeFailInSave.value) {
    return `Сохранить все (${counts.value.unsavedGenerated})`
  }
  return `Сохранить все PASS (${counts.value.unsavedPass})`
})

const saveButtonDisabled = computed(() => {
  if (isBatchRunning.value) return true
  const isSelected = counts.value.selected > 0
  if (isSelected) {
    return includeFailInSave.value ? counts.value.selectedUnsavedGenerated === 0 : counts.value.selectedUnsavedPass === 0
  }
  return includeFailInSave.value ? counts.value.unsavedGenerated === 0 : counts.value.unsavedPass === 0
})

// Фильтрация списка товаров
const filteredProducts = computed(() => {
  if (currentFilter.value === 'without_ai') {
    return products.value.filter(p => !p.isAiCharacteristics && !p.isSaved)
  }
  if (currentFilter.value === 'with_ai') {
    return products.value.filter(p => p.isAiCharacteristics || p.isSaved)
  }
  if (currentFilter.value === 'selected') {
    return products.value.filter(p => p.selected)
  }
  if (currentFilter.value === 'PASS') {
    return products.value.filter(p => p.status === 'PASS' || p.judgeVerdict === 'PASS')
  }
  if (currentFilter.value === 'FAIL') {
    return products.value.filter(p => p.status === 'FAIL' || p.judgeVerdict === 'FAIL')
  }
  return products.value
})

// Чекбокс «Выбрать все»
const allSelected = computed({
  get() {
    if (filteredProducts.value.length === 0) return false
    return filteredProducts.value.every(p => p.selected)
  },
  set(val) {
    filteredProducts.value.forEach(p => {
      p.selected = val
    })
  },
})

const isIndeterminate = computed(() => {
  const selectedCount = filteredProducts.value.filter(p => p.selected).length
  return selectedCount > 0 && selectedCount < filteredProducts.value.length
})

// Преобразование дерева категорий для выпадающего списка
function mapCats(catsArr, level = 0, rootId = null) {
  if (!Array.isArray(catsArr)) return []
  const result = []
  for (const cat of catsArr) {
    const currentRootId = rootId || cat.id
    result.push({
      id: cat.id,
      label: '- '.repeat(level) + cat.name,
      alias: cat.alias,
      rootId: currentRootId,
    })
    if (cat.children && Array.isArray(cat.children)) {
      result.push(...mapCats(cat.children, level + 1, currentRootId))
    }
  }
  return result
}

onMounted(async () => {
  try {
    const { data: catsData } = await useCats()
    cats.value = mapCats(catsData.value)
  } catch (e) {
    console.error('Error fetching categories:', e)
  }
})

// Смена категории
async function onCategoryChange(newAlias) {
  if (isReverting) {
    isReverting = false
    return
  }

  if (hasUnsavedChanges.value && previousCatAlias.value && previousCatAlias.value !== newAlias) {
    const proceed = await showMessage({
      title: 'Подтвердите смену категории',
      description: 'Есть несохраненные сгенерированные характеристики для текущей категории. При смене категории они будут сброшены. Продолжить?',
      isDialog: true,
    })
    if (!proceed) {
      isReverting = true
      activeCatAlias.value = previousCatAlias.value
      return
    }
  }

  if (!newAlias) {
    activeCatAlias.value = null
    previousCatAlias.value = null
    catData.value = null
    docsDict.value = { stnd: {}, rstr: {} }
    products.value = []
    activeProductId.value = null
    includeFailInSave.value = false
    return
  }

  previousCatAlias.value = newAlias
  activeProductId.value = null
  catData.value = null
  docsDict.value = { stnd: {}, rstr: {} }
  products.value = []
  includeFailInSave.value = false

  try {
    isLoading.value = true
    showLoader()
    const res = await $fetch(`/api/ai/productsData/${newAlias}`)
    hideLoader()
    isLoading.value = false

    if (res && res.category) {
      catData.value = res.category
      docsDict.value = res.docs || { stnd: {}, rstr: {} }
      products.value = (res.products || []).map(p => {
        const isAi = Boolean(p.is_ai_characteristics)
        return {
          ...p,
          selected: false,
          status: isAi ? 'saved' : 'idle',
          isAiCharacteristics: isAi,
          workingCharacteristics: isAi ? p.characteristics : '',
          generatedCharacteristics: isAi ? p.characteristics : null,
          judgeVerdict: null,
          requiredCorrections: [],
          isSaved: isAi,
          hasUnsavedChanges: false,
        }
      })
      if (products.value.length > 0) {
        const firstPending = products.value.find(p => !p.isAiCharacteristics)
        activeProductId.value = firstPending ? firstPending.id : products.value[0].id
      }
    }
  } catch (err) {
    hideLoader()
    isLoading.value = false
    console.error('Error fetching products data:', err)
    showMessage({
      title: 'Ошибка загрузки данных',
      description: err.message || 'Не удалось загрузить данные товаров категории.',
      type: 'error',
    })
  }
}

watch(activeCatAlias, newVal => {
  onCategoryChange(newVal)
})

// Разрешение документов ГОСТ/ГРСИ для товара
function getProductDocuments(product) {
  const resolved = []
  if (product.stndIds && Array.isArray(product.stndIds)) {
    for (const id of product.stndIds) {
      const doc = docsDict.value.stnd?.[id] || docsDict.value.stnd?.[String(id)]
      if (doc) {
        resolved.push({
          docNumber: doc.number || '',
          docName: doc.name || '',
          docType: 'stnd',
          fileLink: doc.url || null,
          year: Number(doc.year) || 2000,
          documentText: doc.text || '',
        })
      }
    }
  }
  if (product.rstrIds && Array.isArray(product.rstrIds)) {
    for (const id of product.rstrIds) {
      const doc = docsDict.value.rstr?.[id] || docsDict.value.rstr?.[String(id)]
      if (doc) {
        const docNum = String(doc.number || '').trim()
        const formattedNum = docNum.startsWith('№') ? docNum : docNum ? `№ ${docNum}` : ''
        resolved.push({
          docNumber: formattedNum,
          docName: doc.name || '',
          docType: 'rstr',
          fileLink: doc.url_ot || null,
          year: Number(doc.year) || 2000,
          documentText: doc.text_ot || '',
        })
      }
    }
  }

  // Сортировка: сначала ГОСТ/ТУ (stnd), затем Госреестр (rstr), внутри групп строго по убыванию года
  resolved.sort((a, b) => {
    if (a.docType === 'stnd' && b.docType !== 'stnd') return -1
    if (a.docType !== 'stnd' && b.docType === 'stnd') return 1
    return (b.year || 0) - (a.year || 0)
  })

  return resolved
}

// WebSocket-подключение к воркфлоу Mastra
function connectionHandler(options = {}) {
  if (!options.workflowId || !options.inputData) {
    showNotice({
      title: 'Ошибка!',
      description: 'workflowId и inputData обязательны для подключения к WebSocket.',
      type: 'error',
    })
    return Promise.resolve(null)
  }

  return new Promise(resolve => {
    const errorHandler = (err, logMsg = 'WebSocket error') => {
      console.error(logMsg, err)
      activeSocket = null
      resolve(null)
    }

    try {
      const socket = new WebSocket('/api/admin/mastraWsAdapter')
      activeSocket = socket

      socket.onopen = () => {
        const config = {
          action: 'start',
          workflowId: options.workflowId,
          baseUrl: 'http://localhost:4110',
          inputData: options.inputData,
          runId: options.runId || null,
        }
        socket.send(JSON.stringify(config))
      }

      socket.onmessage = event => {
        try {
          const response = JSON.parse(event.data)
          if (response.status === 'success') {
            socket.close()
            activeSocket = null
            resolve(response.data)
          } else {
            throw new Error('Bad response from server: ' + JSON.stringify(response))
          }
        } catch (e) {
          errorHandler(e, 'Error parsing message')
          socket.close()
        }
      }

      socket.onerror = event => {
        errorHandler(event, 'WebSocket error')
        socket.close()
      }
    } catch (error) {
      errorHandler(error, 'WebSocket setup error')
    }
  })
}

// Запуск генерации для одного товара
async function runProductWorkflow(product) {
  const documents = getProductDocuments(product)
  const inputData = {
    product: {
      id: product.id,
      name: product.name,
      alias: product.alias,
      brand: product.brand || null,
      characteristics: product.characteristics || '',
      props: product.props || {},
    },
    documents,
    categoryCharacteristics: catData.value?.characteristics || '',
  }

  return await connectionHandler({
    workflowId: 'product-characteristics',
    inputData,
  })
}

// Пакетная генерация
async function startBatchGeneration() {
  if (isBatchRunning.value) return

  const selectedProds = products.value.filter(p => p.selected)
  let targets = []
  if (selectedProds.length > 0) {
    targets = selectedProds.filter(p => p.status !== 'generating')
  } else {
    // По умолчанию берем только товары без сгенерированных AI характеристик
    targets = products.value.filter(p => !p.isAiCharacteristics && !p.isSaved && p.status !== 'PASS' && p.judgeVerdict !== 'PASS')
  }

  if (targets.length === 0) {
    showNotice({
      title: 'Все товары уже обработаны',
      description: selectedProds.length > 0 ? 'Среди выбранных товаров нет позиций для генерации.' : 'Все товары в этой категории уже имеют сгенерированные AI-характеристики.',
      type: 'info',
    })
    return
  }

  isBatchRunning.value = true
  abortBatchFlag.value = false
  batchProgress.total = targets.length
  batchProgress.current = 0
  batchProgress.currentProdName = targets[0]?.name || ''

  for (let i = 0; i < targets.length; i++) {
    if (abortBatchFlag.value) break

    const target = targets[i]
    target.status = 'generating'
    batchProgress.current = i + 1
    batchProgress.currentProdName = target.name

    const response = await runProductWorkflow(target)
    if (abortBatchFlag.value) {
      target.status = target.judgeVerdict || (target.isAiCharacteristics ? 'saved' : 'idle')
      break
    }

    if (response) {
      target.generatedCharacteristics = response.generatedCharacteristics || ''
      target.workingCharacteristics = response.generatedCharacteristics || ''
      target.judgeVerdict = response.judgeVerdict || null
      target.status = response.judgeVerdict === 'PASS' ? 'PASS' : 'FAIL'
      target.requiredCorrections = response.requiredCorrections || []
      target.hasUnsavedChanges = true
      target.isSaved = false
    } else {
      target.status = 'FAIL'
    }
  }

  const processedCount = batchProgress.current
  isBatchRunning.value = false
  playNotificationSound()
  showNotice({
    title: abortBatchFlag.value ? 'Генерация прервана' : 'Пакетная генерация завершена!',
    description: `Обработано товаров: ${processedCount} из ${targets.length}`,
    type: 'success',
  })
}

// Прерывание пакетной генерации
function stopBatchGeneration() {
  abortBatchFlag.value = true
  if (activeSocket) {
    activeSocket.close()
    activeSocket = null
  }
  isBatchRunning.value = false
  showNotice({
    title: 'Остановка очереди',
    description: 'Генерация остановлена оператором.',
    type: 'info',
  })
}

// Генерация одного товара
async function generateSingleProduct(prod) {
  if (!prod || isBatchRunning.value) return
  prod.status = 'generating'
  const response = await runProductWorkflow(prod)
  if (response) {
    prod.generatedCharacteristics = response.generatedCharacteristics || ''
    prod.workingCharacteristics = response.generatedCharacteristics || ''
    prod.judgeVerdict = response.judgeVerdict || null
    prod.status = response.judgeVerdict === 'PASS' ? 'PASS' : 'FAIL'
    prod.requiredCorrections = response.requiredCorrections || []
    prod.hasUnsavedChanges = true
    prod.isSaved = false
    playNotificationSound()
    showNotice({
      title: 'Генерация завершена',
      description: `Результат валидации: ${prod.judgeVerdict}`,
      type: prod.judgeVerdict === 'PASS' ? 'success' : 'warning',
    })
  } else {
    prod.status = prod.judgeVerdict || 'FAIL'
    showNotice({
      title: 'Ошибка генерации',
      description: 'Не удалось получить ответ от воркфлоу.',
      type: 'error',
    })
  }
}

// Скопировать исходные ТТХ из базы в рабочую область для ручной правки
function copyOriginalToWorking() {
  if (!activeProduct.value || !activeProduct.value.characteristics) return
  activeProduct.value.workingCharacteristics = activeProduct.value.characteristics
  activeProduct.value.hasUnsavedChanges = true
}

// Сохранение одного товара в БД
async function saveProduct(prod) {
  if (!prod || !prod.workingCharacteristics) {
    showNotice({ title: 'Предупреждение', description: 'Нет характеристик для сохранения.', type: 'warning' })
    return
  }

  if (prod.status === 'FAIL') {
    const proceed = await showMessage({
      title: 'Предупреждение: вердикт FAIL',
      description: `У товара «${prod.name}» валидатор выявил ошибки разметки (вердикт FAIL). Вы уверены, что хотите сохранить эти характеристики в базу данных?`,
      isDialog: true,
    })
    if (!proceed) return
  }

  try {
    isLoading.value = true
    const payload = [
      {
        id: prod.id,
        characteristics: prod.workingCharacteristics,
        is_ai_characteristics: 1,
      },
    ]

    const res = await $fetch('/api/admin/cms/products/updProds', {
      method: 'POST',
      body: payload,
    })

    isLoading.value = false
    if (res) {
      prod.characteristics = prod.workingCharacteristics
      prod.is_ai_characteristics = true
      prod.isAiCharacteristics = true
      prod.isSaved = true
      prod.status = 'saved'
      prod.hasUnsavedChanges = false
      showNotice({
        title: 'Товар сохранен!',
        description: `Характеристики товара «${prod.name}» сохранены в БД.`,
        type: 'success',
      })
    }
  } catch (err) {
    isLoading.value = false
    console.error('Error saving product:', err)
    showMessage({
      title: 'Ошибка сохранения',
      description: err.message || 'Не удалось сохранить характеристики товара.',
      type: 'error',
    })
  }
}

// Массовое сохранение товаров (PASS или все сгенерированные, включая FAIL)
async function saveBatchProducts() {
  const isSelected = counts.value.selected > 0
  let targets = []

  if (isSelected) {
    targets = products.value.filter(p => {
      if (!p.selected || p.isSaved || !p.workingCharacteristics) return false
      if (includeFailInSave.value) {
        return p.status === 'PASS' || p.judgeVerdict === 'PASS' || p.status === 'FAIL' || p.judgeVerdict === 'FAIL' || p.hasUnsavedChanges
      }
      return p.status === 'PASS' || p.judgeVerdict === 'PASS'
    })
  } else {
    targets = products.value.filter(p => {
      if (p.isSaved || !p.workingCharacteristics) return false
      if (includeFailInSave.value) {
        return p.status === 'PASS' || p.judgeVerdict === 'PASS' || p.status === 'FAIL' || p.judgeVerdict === 'FAIL' || p.hasUnsavedChanges
      }
      return p.status === 'PASS' || p.judgeVerdict === 'PASS'
    })
  }

  if (targets.length === 0) {
    showNotice({
      title: 'Информация',
      description: includeFailInSave.value ? 'Нет несохраненных сгенерированных товаров.' : 'Нет несохраненных товаров со статусом PASS.',
      type: 'info',
    })
    return
  }

  const failCount = targets.filter(p => p.status === 'FAIL' || p.judgeVerdict === 'FAIL').length
  let desc = `Будет сохранено ${targets.length} товаров в базу данных.`
  if (failCount > 0) {
    desc += ` Внимание: из них ${failCount} товаров имеют замечания валидатора (вердикт FAIL). Продолжить?`
  } else {
    desc += ' Продолжить?'
  }

  const proceed = await showMessage({
    title: 'Подтвердите сохранение',
    description: desc,
    isDialog: true,
  })
  if (!proceed) return

  try {
    isLoading.value = true
    const payload = targets.map(p => ({
      id: p.id,
      characteristics: p.workingCharacteristics,
      is_ai_characteristics: 1,
    }))

    const res = await $fetch('/api/admin/cms/products/updProds', {
      method: 'POST',
      body: payload,
    })

    isLoading.value = false
    if (res) {
      targets.forEach(p => {
        p.characteristics = p.workingCharacteristics
        p.is_ai_characteristics = true
        p.isAiCharacteristics = true
        p.isSaved = true
        p.status = 'saved'
        p.hasUnsavedChanges = false
      })
      showNotice({
        title: 'Успешно сохранено!',
        description: `Обновлены характеристики для ${targets.length} товаров.`,
        type: 'success',
      })
    }
  } catch (err) {
    isLoading.value = false
    console.error('Error batch saving products:', err)
    showMessage({
      title: 'Ошибка сохранения',
      description: err.message || 'Не удалось сохранить товары.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 pb-24 sm:p-6">
    <!-- Шапка страницы и выбор категории -->
    <div class="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold">
          <UIcon
            name="i-lucide-boxes"
            class="text-primary-500 size-6" />
          <span>AI Характеристики Товаров</span>
        </h1>
        <p class="mt-1 text-xs text-gray-500">Пакетная генерация технических характеристик по нормативным документам (ГОСТ / ГРСИ)</p>
      </div>

      <div class="flex items-center gap-3">
        <USelectMenu
          v-model="activeCatAlias"
          :items="cats"
          value-key="alias"
          :search-input="{
            placeholder: 'Поиск категории...',
            icon: 'i-lucide-filter',
            type: 'search',
          }"
          placeholder="Выберите категорию"
          class="w-80 sm:w-96" />
      </div>
    </div>

    <!-- Панель управления категорией и пакетными действиями -->
    <div
      v-if="catData"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {{ catData.name }}
        </span>
        <UBadge
          variant="subtle"
          color="neutral"
          size="sm">
          Всего: {{ products.length }}
        </UBadge>
        <UBadge
          variant="subtle"
          color="success"
          size="sm">
          С AI: {{ counts.withAi }}
        </UBadge>
        <UBadge
          variant="subtle"
          color="warning"
          size="sm">
          Без AI: {{ counts.withoutAi }}
        </UBadge>
        <UBadge
          variant="subtle"
          color="neutral"
          size="sm">
          ГОСТ: {{ Object.keys(docsDict.stnd || {}).length }}
        </UBadge>
        <UBadge
          variant="subtle"
          color="neutral"
          size="sm">
          ГРСИ: {{ Object.keys(docsDict.rstr || {}).length }}
        </UBadge>
      </div>

      <!-- Кнопки пакетных действий -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Кнопка остановки генерации -->
        <UButton
          v-if="isBatchRunning"
          icon="i-lucide-square"
          label="Прервать генерацию"
          color="error"
          variant="solid"
          size="sm"
          @click="stopBatchGeneration" />

        <!-- Кнопка запуска генерации -->
        <UButton
          v-else
          icon="i-lucide-sparkles"
          :label="counts.selected > 0 ? `Сгенерировать выбранные (${counts.selected})` : `Сгенерировать без AI (${counts.withoutAi})`"
          color="primary"
          variant="solid"
          size="sm"
          :disabled="products.length === 0 || (counts.selected === 0 && counts.withoutAi === 0)"
          @click="startBatchGeneration" />

        <!-- Блок массового сохранения с чекбоксом «Включая FAIL» -->
        <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 py-1 dark:border-gray-800 dark:bg-gray-800/40">
          <UCheckbox
            v-model="includeFailInSave"
            label="Включая FAIL"
            :disabled="isBatchRunning"
            class="text-xs" />

          <UButton
            icon="i-lucide-save"
            :label="saveButtonLabel"
            color="success"
            variant="outline"
            size="sm"
            :disabled="saveButtonDisabled"
            @click="saveBatchProducts" />
        </div>
      </div>
    </div>

    <!-- Индикатор прогресса пакета -->
    <div
      v-if="isBatchRunning"
      class="border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950/40 space-y-2 rounded-xl border p-4">
      <div class="flex items-center justify-between text-xs">
        <span class="text-primary-900 dark:text-primary-100 flex items-center gap-1.5 font-medium">
          <UIcon
            name="i-lucide-loader-2"
            class="text-primary-600 size-4 animate-spin" />
          Обработка очереди: {{ batchProgress.currentProdName }}
        </span>
        <span class="text-primary-800 dark:text-primary-200 font-semibold">{{ batchProgress.current }} / {{ batchProgress.total }}</span>
      </div>
      <UProgress
        :value="(batchProgress.current / (batchProgress.total || 1)) * 100"
        color="primary"
        size="sm" />
    </div>

    <!-- Основная рабочая область (Master-Detail, 2 колонки) -->
    <div
      v-if="catData"
      class="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
      <!-- ЛЕВАЯ КОЛОНКА: Список товаров категории (3 колонки) -->
      <div class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs lg:col-span-3 dark:border-gray-800 dark:bg-gray-900">
        <!-- Шапка списка и чекбокс «Выбрать все» -->
        <div class="flex items-center justify-between border-b border-gray-200 pb-2.5 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <UCheckbox
              v-model="allSelected"
              :indeterminate="isIndeterminate"
              aria-label="Выбрать все" />
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Список товаров ({{ filteredProducts.length }})</span>
          </div>
          <span class="text-xs text-gray-400">Выбрано: {{ counts.selected }}</span>
        </div>

        <!-- Фильтры по статусам -->
        <div class="flex flex-wrap gap-1 pb-1 text-xs">
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'all' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'all'">
            Все ({{ counts.all }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'without_ai' ? 'bg-amber-50 font-semibold text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'without_ai'">
            Без AI ({{ counts.withoutAi }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'with_ai' ? 'bg-emerald-50 font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'with_ai'">
            С AI ({{ counts.withAi }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'selected' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'selected'">
            Выбрано ({{ counts.selected }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'PASS' ? 'bg-emerald-50 font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'PASS'">
            PASS ({{ counts.pass }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'FAIL' ? 'bg-red-50 font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'FAIL'">
            FAIL ({{ counts.fail }})
          </button>
        </div>

        <!-- Простой скроллируемый список товаров -->
        <div class="custom-scrollbar max-h-[660px] space-y-2 overflow-y-auto pr-1">
          <div
            v-for="prod in filteredProducts"
            :key="prod.id"
            :class="['cursor-pointer rounded-xl border p-3 transition-all', activeProductId === prod.id ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/20 dark:border-primary-500 shadow-xs' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700']"
            @click="activeProductId = prod.id">
            <div class="flex items-start justify-between gap-2">
              <div class="flex min-w-0 items-start gap-2.5">
                <UCheckbox
                  v-model="prod.selected"
                  class="mt-0.5"
                  @click.stop />
                <div class="min-w-0">
                  <div class="line-clamp-2 text-xs leading-snug font-semibold text-gray-900 dark:text-gray-100">
                    {{ prod.name }}
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400">
                    <span>ID: {{ prod.id }}</span>
                    <span v-if="prod.brand">• {{ prod.brand }}</span>
                    <span
                      v-if="prod.stndIds?.length"
                      class="text-indigo-500">
                      • ГОСТ ({{ prod.stndIds.length }})
                    </span>
                    <span
                      v-if="prod.rstrIds?.length"
                      class="text-amber-500">
                      • ГРСИ ({{ prod.rstrIds.length }})
                    </span>
                    <span
                      v-if="!prod.stndIds?.length && !prod.rstrIds?.length"
                      class="text-gray-400">
                      • Fallback
                    </span>
                  </div>
                </div>
              </div>

              <!-- Бейджи статуса генерации -->
              <div class="flex-shrink-0">
                <UBadge
                  v-if="prod.status === 'generating'"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    name="i-lucide-loader-2"
                    class="size-3 animate-spin" />
                  Генерация
                </UBadge>
                <UBadge
                  v-else-if="prod.status === 'PASS' || (!prod.isSaved && prod.judgeVerdict === 'PASS')"
                  color="success"
                  variant="solid"
                  size="xs"
                  class="font-semibold">
                  PASS
                </UBadge>
                <UBadge
                  v-else-if="prod.status === 'FAIL' || prod.judgeVerdict === 'FAIL'"
                  color="error"
                  variant="subtle"
                  size="xs"
                  class="font-semibold">
                  FAIL
                </UBadge>
                <UBadge
                  v-else-if="prod.isAiCharacteristics || prod.isSaved"
                  color="success"
                  variant="subtle"
                  size="xs"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    name="i-lucide-check"
                    class="size-3" />
                  AI В БД
                </UBadge>
              </div>
            </div>
          </div>

          <div
            v-if="filteredProducts.length === 0"
            class="p-6 text-center text-xs text-gray-400">
            Нет товаров, соответствующих выбранному фильтру.
          </div>
        </div>
      </div>

      <!-- ПРАВАЯ КОЛОНКА: Рабочая область выбранного товара (9 колонок) -->
      <div class="space-y-4 lg:col-span-9">
        <UCard
          v-if="activeProduct"
          :ui="{ body: 'space-y-4 p-5 sm:p-6' }">
          <template #header>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h2 class="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                    {{ activeProduct.name }}
                  </h2>
                </div>

                <!-- Кликабельный Alias со ссылкой на товар в каталоге -->
                <div class="mt-1 flex flex-wrap items-center gap-2">
                  <span class="text-xs text-gray-400">Алиас:</span>
                  <NuxtLink
                    :to="`/product/${activeProduct.alias}`"
                    target="_blank"
                    class="text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1 font-mono text-xs hover:underline">
                    /product/{{ activeProduct.alias }}
                    <UIcon
                      name="i-lucide-external-link"
                      class="size-3" />
                  </NuxtLink>
                </div>
              </div>

              <!-- Тулбар сохранения карточки товара -->
              <div class="flex flex-shrink-0 items-center gap-2">
                <UBadge
                  v-if="activeProduct.isSaved || activeProduct.isAiCharacteristics"
                  color="success"
                  variant="subtle"
                  size="md"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    name="i-lucide-check"
                    class="size-3.5" />
                  В базе данных
                </UBadge>

                <UButton
                  v-if="!activeProduct.workingCharacteristics"
                  icon="i-lucide-sparkles"
                  label="Сгенерировать товар"
                  color="primary"
                  variant="solid"
                  size="sm"
                  :loading="activeProduct.status === 'generating'"
                  :disabled="isBatchRunning"
                  @click="generateSingleProduct(activeProduct)" />

                <template v-else>
                  <UButton
                    icon="i-lucide-rotate-cw"
                    label="Перегенерировать"
                    color="neutral"
                    variant="outline"
                    size="sm"
                    :loading="activeProduct.status === 'generating'"
                    :disabled="isBatchRunning"
                    @click="generateSingleProduct(activeProduct)" />

                  <UButton
                    icon="i-lucide-save"
                    :label="activeProduct.hasUnsavedChanges ? 'Сохранить изменения' : 'Сохранить товар'"
                    color="success"
                    :variant="activeProduct.hasUnsavedChanges ? 'solid' : 'outline'"
                    size="sm"
                    :disabled="!activeProduct.workingCharacteristics || !activeProduct.hasUnsavedChanges || isBatchRunning"
                    @click="saveProduct(activeProduct)" />
                </template>
              </div>
            </div>
          </template>

          <!-- Переключатель вкладок просмотра/редактирования -->
          <div class="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
            <UTabs
              v-model="activeTab"
              :content="false"
              :items="editorTabs"
              color="primary"
              variant="link" />

            <div class="font-mono text-xs text-gray-400">{{ activeProduct.workingCharacteristics?.length || 0 }} симв.</div>
          </div>

          <!-- 1. ВКЛАДКА: Полный предпросмотр (дефолтная) -->
          <div
            v-show="activeTab === 'preview'"
            class="custom-scrollbar info-block max-h-140 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 text-xs dark:border-gray-800 dark:bg-gray-900">
            <div
              v-if="activeProduct.workingCharacteristics"
              class="characteristics preview-tables max-w-none space-y-2 leading-relaxed"
              v-html="activeProduct.workingCharacteristics" />
            <div
              v-else
              class="flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <UIcon
                name="i-lucide-sparkles"
                class="mb-2 size-8 text-gray-300 dark:text-gray-600" />
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Характеристики еще не сгенерированы</p>
              <p class="mt-1 text-[11px] text-gray-400">Запустите генерацию для создания ТТХ на основе ГОСТ/ГРСИ</p>
              <UButton
                icon="i-lucide-sparkles"
                label="Сгенерировать этот товар"
                size="xs"
                color="primary"
                variant="subtle"
                class="mt-3"
                :loading="activeProduct.status === 'generating'"
                :disabled="isBatchRunning"
                @click="generateSingleProduct(activeProduct)" />
            </div>
          </div>

          <!-- 2. ВКЛАДКА: Редактирование HTML -->
          <div
            v-show="activeTab === 'edit'"
            class="space-y-2">
            <div
              v-if="!activeProduct.workingCharacteristics && activeProduct.characteristics"
              class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs dark:border-amber-900 dark:bg-amber-950/40">
              <span class="text-amber-800 dark:text-amber-200">Товар еще не сгенерирован через AI. Вы можете скопировать действующие ТТХ из БД для ручной правки.</span>
              <UButton
                icon="i-lucide-copy"
                label="Скопировать из БД"
                size="xs"
                color="warning"
                variant="subtle"
                @click="copyOriginalToWorking" />
            </div>

            <UTextarea
              v-model="activeProduct.workingCharacteristics"
              :rows="18"
              class="w-full font-mono text-xs"
              placeholder="Введите или отредактируйте HTML код характеристик..."
              @input="activeProduct.hasUnsavedChanges = true" />
            <p class="text-[11px] text-gray-400">Вы можете внести точечные изменения в разметку HTML вручную и нажать «Сохранить товар».</p>
          </div>

          <!-- 3. ВКЛАДКА: Сравнение «Было / Стало» -->
          <div
            v-show="activeTab === 'split'"
            class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Действующие ТТХ в БД (Было) -->
            <div class="flex flex-col rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60">
              <div class="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                <span class="text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">Действующие ТТХ (В БД)</span>
                <span class="text-[11px] text-gray-400">Было</span>
              </div>

              <div class="custom-scrollbar info-block max-h-120 overflow-y-auto text-xs">
                <div
                  v-if="activeProduct.characteristics"
                  class="characteristics preview-tables max-w-none space-y-1.5"
                  v-html="activeProduct.characteristics" />

                <!-- Если характеристик в БД не было, показываем исходные свойства i_properties -->
                <div
                  v-else
                  class="space-y-2 text-gray-500">
                  <p class="mb-2 text-gray-400 italic">Характеристики в БД отсутствовали. Исходные свойства:</p>
                  <table
                    v-if="Object.keys(activeProduct.props || {}).length"
                    class="w-full border-collapse text-left">
                    <tbody>
                      <tr
                        v-for="(val, propName) in activeProduct.props"
                        :key="propName"
                        class="border-b border-gray-200 dark:border-gray-800">
                        <td class="py-1 font-medium text-gray-400">{{ propName }}:</td>
                        <td class="py-1 font-semibold text-gray-800 dark:text-gray-200">{{ val }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p
                    v-else
                    class="text-gray-400 italic">
                    Свойства товара не заполнены.
                  </p>
                </div>
              </div>
            </div>

            <!-- Сгенерированные характеристики (Стало) -->
            <div class="border-primary-500/40 dark:border-primary-500/30 flex flex-col rounded-xl border-2 bg-white p-4 dark:bg-gray-900">
              <div class="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                <span class="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase">Сгенерировано AI (Стало)</span>
                <UBadge
                  v-if="activeProduct.judgeVerdict"
                  :color="activeProduct.judgeVerdict === 'PASS' ? 'success' : 'error'"
                  variant="subtle"
                  size="xs">
                  {{ activeProduct.judgeVerdict }}
                </UBadge>
              </div>

              <div class="custom-scrollbar info-block max-h-120 overflow-y-auto text-xs">
                <div
                  v-if="activeProduct.workingCharacteristics"
                  class="characteristics preview-tables max-w-none space-y-1.5"
                  v-html="activeProduct.workingCharacteristics" />
                <div
                  v-else
                  class="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="mb-2 size-8 text-gray-300 dark:text-gray-600" />
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Характеристики еще не сгенерированы</p>
                  <p class="mt-1 text-[11px] text-gray-400">Запустите генерацию для создания ТТХ на основе ГОСТ/ГРСИ</p>
                  <UButton
                    icon="i-lucide-sparkles"
                    label="Сгенерировать этот товар"
                    size="xs"
                    color="primary"
                    variant="subtle"
                    class="mt-3"
                    :loading="activeProduct.status === 'generating'"
                    :disabled="isBatchRunning"
                    @click="generateSingleProduct(activeProduct)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Блок проверки валидатором разметки -->
          <div
            v-if="activeProduct.judgeVerdict"
            class="space-y-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/60">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300">Валидация HTML / структуры:</span>
                <UBadge
                  :color="activeProduct.judgeVerdict === 'PASS' ? 'success' : 'error'"
                  variant="solid"
                  size="xs"
                  class="font-bold">
                  {{ activeProduct.judgeVerdict }}
                </UBadge>
              </div>
            </div>

            <!-- Ошибка валидации (если вердикт FAIL) -->
            <div
              v-if="activeProduct.requiredCorrections?.length"
              class="space-y-1">
              <span class="text-xs font-semibold text-red-600 dark:text-red-400">Причина ошибки:</span>
              <ul class="list-disc space-y-1 pl-5 text-xs text-red-600 dark:text-red-400">
                <li
                  v-for="(corr, idx) in activeProduct.requiredCorrections"
                  :key="idx">
                  {{ corr }}
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <!-- Пустое состояние (товар не выбран) -->
        <div
          v-else
          class="rounded-xl border border-dashed border-gray-300 p-12 text-center text-xs text-gray-400 dark:border-gray-700">
          Выберите товар из левого списка для просмотра и редактирования.
        </div>
      </div>
    </div>

    <!-- Заглушка, если категория еще не выбрана -->
    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 p-16 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <UIcon
        name="i-lucide-folder-search"
        class="mx-auto mb-3 size-12 text-gray-400" />
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">Категория не выбрана</h3>
      <p class="mt-1 text-xs text-gray-400">Выберите категорию в выпадающем списке сверху для загрузки товаров и нормативных документов.</p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.35);
  border-radius: 3px;
}

:deep(.preview-tables table) {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 0.75rem 0 !important;
  font-size: 0.8125rem !important;
}

:deep(.preview-tables th),
:deep(.preview-tables td) {
  border: 1px solid rgba(156, 163, 175, 0.35) !important;
  padding: 0.5rem 0.75rem !important;
  text-align: left !important;
}

:deep(.preview-tables th) {
  background-color: rgba(156, 163, 175, 0.12) !important;
  font-weight: 600 !important;
}

:deep(.preview-tables ul) {
  list-style-type: disc !important;
  padding-left: 1.25rem !important;
  margin: 0.5rem 0 !important;
}

:deep(.preview-tables p) {
  margin-bottom: 0.5rem !important;
  line-height: 1.5 !important;
}
</style>
