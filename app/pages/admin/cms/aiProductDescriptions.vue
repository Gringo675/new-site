<script setup>
//
useTitle('AI Описания Товаров | AdminPanel')
await checkAdminOnly()

// Состояние категорий и товаров
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
const currentFilter = ref('all') // 'all' | 'without_ai' | 'with_ai' | 'selected' | 'PASS' | 'WARN' | 'ERROR'
const activeTab = ref('preview') // 'preview' | 'edit' | 'split'

const editorTabs = [
  { value: 'preview', label: 'Предпросмотр', icon: 'i-lucide-eye' },
  { value: 'edit', label: 'Редактирование HTML', icon: 'i-lucide-code-xml' },
  { value: 'split', label: 'Сравнение (Было / Стало)', icon: 'i-lucide-columns-2' },
]

// Пакетная генерация и WebSocket
const isBatchRunning = ref(false)
const abortBatchFlag = ref(false)
const includeWarnInSave = ref(false)
const concurrencyLimit = ref(2)
const concurrencyOptions = [
  { label: '1 поток', value: 1 },
  { label: '2 потока', value: 2 },
  { label: '3 потока', value: 3 },
  { label: '4 потока', value: 4 },
  { label: '5 потоков', value: 5 },
]
const activeGeneratingProducts = ref([])
const activeSockets = new Set()
const batchProgress = reactive({
  current: 0,
  total: 0,
})

const activeGeneratingNames = computed(() => {
  return activeGeneratingProducts.value.map(p => p.name).join(', ')
})

// Индикатор несохраненных изменений
const hasUnsavedChanges = computed(() => {
  return products.value.some(p => p.hasUnsavedChanges)
})

// Предикаты статусов товаров (единая логика для счетчиков, фильтров, бейджей и сохранения)
function hasWorkingText(prod) {
  return Boolean(prod.workingDescription?.trim())
}

function isProductWithAi(prod) {
  return Boolean(prod.isAiDescription || prod.isSaved)
}

function isProductPass(prod) {
  return (prod.status === 'PASS' || prod.judgeVerdict === 'PASS') && !prod.isSaved && hasWorkingText(prod)
}

function isProductWarn(prod) {
  return (prod.status === 'WARN' || ((prod.status === 'FAIL' || prod.judgeVerdict === 'FAIL') && hasWorkingText(prod))) && !prod.isSaved
}

function isProductError(prod) {
  return prod.status === 'ERROR' || (!prod.isSaved && prod.judgeVerdict === 'FAIL' && !hasWorkingText(prod))
}

function isProductUnsavedGenerated(prod) {
  return !prod.isSaved && hasWorkingText(prod) && (prod.status === 'PASS' || prod.status === 'WARN' || prod.judgeVerdict === 'PASS' || prod.hasUnsavedChanges)
}

// Подсчет товаров по статусам
const counts = computed(() => {
  const all = products.value.length
  const withoutAi = products.value.filter(p => !isProductWithAi(p)).length
  const withAi = products.value.filter(p => isProductWithAi(p)).length
  const selected = products.value.filter(p => p.selected).length
  const pass = products.value.filter(p => isProductPass(p)).length
  const warn = products.value.filter(p => isProductWarn(p)).length
  const error = products.value.filter(p => isProductError(p)).length
  const unsavedGenerated = products.value.filter(p => isProductUnsavedGenerated(p)).length
  const selectedUnsavedPass = products.value.filter(p => p.selected && isProductPass(p)).length
  const selectedUnsavedGenerated = products.value.filter(p => p.selected && isProductUnsavedGenerated(p)).length
  return {
    all,
    withoutAi,
    withAi,
    selected,
    pass,
    warn,
    error,
    unsavedPass: pass,
    unsavedGenerated,
    selectedUnsavedPass,
    selectedUnsavedGenerated,
  }
})

// Текст и состояние доступности кнопки сохранения
const saveButtonLabel = computed(() => {
  const isSelected = counts.value.selected > 0
  if (isSelected) {
    if (includeWarnInSave.value) {
      return `Сохранить выбранные (${counts.value.selectedUnsavedGenerated})`
    }
    return `Сохранить выбранные PASS (${counts.value.selectedUnsavedPass})`
  }
  if (includeWarnInSave.value) {
    return `Сохранить все с описанием (${counts.value.unsavedGenerated})`
  }
  return `Сохранить все PASS (${counts.value.unsavedPass})`
})

const saveButtonDisabled = computed(() => {
  if (isBatchRunning.value) return true
  const isSelected = counts.value.selected > 0
  if (isSelected) {
    return includeWarnInSave.value ? counts.value.selectedUnsavedGenerated === 0 : counts.value.selectedUnsavedPass === 0
  }
  return includeWarnInSave.value ? counts.value.unsavedGenerated === 0 : counts.value.unsavedPass === 0
})

// Фильтрация списка товаров
const filteredProducts = computed(() => {
  if (currentFilter.value === 'without_ai') {
    return products.value.filter(p => !isProductWithAi(p))
  }
  if (currentFilter.value === 'with_ai') {
    return products.value.filter(p => isProductWithAi(p))
  }
  if (currentFilter.value === 'selected') {
    return products.value.filter(p => p.selected)
  }
  if (currentFilter.value === 'PASS') {
    return products.value.filter(p => isProductPass(p))
  }
  if (currentFilter.value === 'WARN') {
    return products.value.filter(p => isProductWarn(p))
  }
  if (currentFilter.value === 'ERROR' || currentFilter.value === 'FAIL') {
    return products.value.filter(p => isProductError(p))
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
      description: 'Есть несохраненные сгенерированные описания для текущей категории. При смене категории они будут сброшены. Продолжить?',
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
    includeWarnInSave.value = false
    return
  }

  previousCatAlias.value = newAlias
  activeProductId.value = null
  catData.value = null
  docsDict.value = { stnd: {}, rstr: {} }
  products.value = []
  includeWarnInSave.value = false

  try {
    isLoading.value = true
    showLoader()
    const res = await $fetch(`/api/ai/productsData/${newAlias}`, {
      query: {
        skipDocText: 1,
        includeDescription: 1,
      },
    })
    hideLoader()
    isLoading.value = false

    if (res && res.category) {
      catData.value = res.category
      docsDict.value = res.docs || { stnd: {}, rstr: {} }
      products.value = (res.products || []).map(p => {
        const isAi = Boolean(p.is_ai_description)
        return {
          ...p,
          selected: false,
          status: isAi ? 'saved' : 'idle',
          isAiDescription: isAi,
          workingDescription: isAi ? p.description : '',
          generatedDescription: isAi ? p.description : null,
          judgeVerdict: null,
          requiredCorrections: [],
          isSaved: isAi,
          hasUnsavedChanges: false,
        }
      })
      if (products.value.length > 0) {
        const firstPending = products.value.find(p => !p.isAiDescription)
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

// Разрешение нормативных документов ГОСТ/ГРСИ для товара (без текстов документов)
function getProductDocuments(product) {
  const resolved = []
  if (product.stndIds && Array.isArray(product.stndIds)) {
    for (const id of product.stndIds) {
      const doc = docsDict.value.stnd?.[id] || docsDict.value.stnd?.[String(id)]
      if (doc) {
        const rawYear = Number(doc.year)
        resolved.push({
          docNumber: doc.number || '',
          docName: doc.name || '',
          docType: 'stnd',
          year: Number.isFinite(rawYear) && rawYear > 0 ? rawYear : null,
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
        const rawYear = Number(doc.year)
        resolved.push({
          docNumber: formattedNum,
          docName: doc.name || '',
          docType: 'rstr',
          year: Number.isFinite(rawYear) && rawYear > 0 ? rawYear : null,
        })
      }
    }
  }

  // Сортировка: сначала ГОСТ/ТУ (stnd), затем Госреестр (rstr), внутри групп по убыванию года
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
    let socket = null
    let isSettled = false

    const safeResolve = val => {
      if (!isSettled) {
        isSettled = true
        resolve(val)
      }
    }

    const errorHandler = (err, logMsg = 'WebSocket error', errVal = null) => {
      console.error(logMsg, err)
      if (socket) {
        activeSockets.delete(socket)
      }
      safeResolve(errVal)
    }

    try {
      socket = new WebSocket('/api/admin/mastraWsAdapter')
      activeSockets.add(socket)

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
            safeResolve(response.data)
            socket.close()
            activeSockets.delete(socket)
          } else {
            const serverErr = response?.error || 'Bad response from server'
            errorHandler(serverErr, 'Workflow error response', { __error: serverErr })
            socket.close()
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

      socket.onclose = () => {
        if (socket) {
          activeSockets.delete(socket)
        }
        safeResolve(null)
      }
    } catch (error) {
      errorHandler(error, 'WebSocket setup error')
    }
  })
}

// Запуск генерации описания для одного товара
async function runProductWorkflow(product) {
  const documents = getProductDocuments(product)
  const inputData = {
    product: {
      id: product.id,
      name: product.name,
      alias: product.alias,
      brand: product.brand || null,
      description: product.description || '',
      characteristics: product.characteristics || '',
      props: product.props || {},
    },
    documents,
    category: {
      name: catData.value?.name || '',
      description: catData.value?.description || '',
      characteristics: catData.value?.characteristics || '',
    },
  }

  return await connectionHandler({
    workflowId: 'product-description',
    inputData,
  })
}

// Единая обработка результата генерации для пакетного и одиночного режима
function applyGenerationResult(target, response, error = null) {
  const hasContent = Boolean(response && !response.__error && response.generatedDescription && response.generatedDescription.trim().length > 0)

  if (hasContent) {
    target.generatedDescription = response.generatedDescription
    target.workingDescription = response.generatedDescription
    target.judgeVerdict = response.judgeVerdict || null
    target.status = response.judgeVerdict === 'PASS' ? 'PASS' : 'WARN'
    target.requiredCorrections = response.requiredCorrections || []
    target.hasUnsavedChanges = true
    target.isSaved = false
    return { ok: true, isPass: response.judgeVerdict === 'PASS' }
  }

  target.status = 'ERROR'
  target.generatedDescription = ''
  target.workingDescription = ''
  target.judgeVerdict = 'FAIL'
  if (response?.requiredCorrections?.length) {
    target.requiredCorrections = response.requiredCorrections
  } else if (response?.__error) {
    target.requiredCorrections = [String(response.__error)]
  } else if (error?.message) {
    target.requiredCorrections = [error.message]
  } else {
    target.requiredCorrections = ['Сбой генерации: модель недоступна или вернула пустой ответ.']
  }
  target.hasUnsavedChanges = false
  target.isSaved = false
  return { ok: false, isPass: false }
}

// Пакетная генерация (многопоточная)
async function startBatchGeneration() {
  if (isBatchRunning.value) return

  const selectedProds = products.value.filter(p => p.selected)
  let targets = []
  if (selectedProds.length > 0) {
    targets = selectedProds.filter(p => p.status !== 'generating')
  } else {
    // По умолчанию берем только товары без сгенерированного AI-описания
    targets = products.value.filter(p => !isProductWithAi(p) && p.status !== 'PASS' && p.judgeVerdict !== 'PASS')
  }

  if (targets.length === 0) {
    showNotice({
      title: 'Все товары уже обработаны',
      description: selectedProds.length > 0 ? 'Среди выбранных товаров нет позиций для генерации.' : 'Все товары в этой категории уже имеют сгенерированные AI-описания.',
      type: 'info',
    })
    return
  }

  const limit = Math.max(1, Math.min(5, Number(concurrencyLimit.value) || 2))
  const workerCount = Math.min(limit, targets.length)

  isBatchRunning.value = true
  abortBatchFlag.value = false
  activeGeneratingProducts.value = []
  batchProgress.total = targets.length
  batchProgress.current = 0

  let nextIndex = 0
  let completedCount = 0

  async function worker() {
    while (nextIndex < targets.length && !abortBatchFlag.value) {
      const currentIndex = nextIndex++
      const target = targets[currentIndex]
      if (!target) break

      target.status = 'generating'
      activeGeneratingProducts.value = [...activeGeneratingProducts.value, target]

      try {
        const response = await runProductWorkflow(target)
        if (abortBatchFlag.value) {
          target.status = target.judgeVerdict || (target.isAiDescription ? 'saved' : 'idle')
          break
        }
        applyGenerationResult(target, response)
      } catch (err) {
        console.error('Error generating product description:', target.name, err)
        if (!abortBatchFlag.value) {
          applyGenerationResult(target, null, err)
        }
      } finally {
        activeGeneratingProducts.value = activeGeneratingProducts.value.filter(p => p.id !== target.id)
        if (!abortBatchFlag.value) {
          completedCount++
          batchProgress.current = Math.min(completedCount, targets.length)
        }
      }
    }
  }

  try {
    await Promise.all(Array.from({ length: workerCount }, () => worker()))

    if (!abortBatchFlag.value) {
      playNotificationSound()
      showNotice({
        title: 'Пакетная генерация завершена!',
        description: `Обработано товаров: ${completedCount} из ${targets.length}`,
        type: 'success',
      })
    } else {
      showNotice({
        title: 'Генерация прервана',
        description: `Обработано товаров до остановки: ${completedCount} из ${targets.length}`,
        type: 'info',
      })
    }
  } finally {
    isBatchRunning.value = false
    activeGeneratingProducts.value = []
    activeSockets.clear()
  }
}

// Прерывание пакетной генерации
function stopBatchGeneration() {
  if (!isBatchRunning.value) return
  abortBatchFlag.value = true

  // Немедленно возвращаем активные товары в исходный статус
  activeGeneratingProducts.value.forEach(prod => {
    prod.status = prod.judgeVerdict || (prod.isAiDescription ? 'saved' : 'idle')
  })
  activeGeneratingProducts.value = []

  activeSockets.forEach(socket => {
    try {
      socket.close()
    } catch (e) {
      console.error('Error closing socket:', e)
    }
  })
  activeSockets.clear()

  showNotice({
    title: 'Остановка очереди',
    description: 'Генерация прервана оператором.',
    type: 'info',
  })
}

// Генерация одного товара
async function generateSingleProduct(prod) {
  if (!prod || isBatchRunning.value) return
  prod.status = 'generating'

  try {
    const response = await runProductWorkflow(prod)
    const outcome = applyGenerationResult(prod, response)

    if (outcome.ok) {
      playNotificationSound()
      showNotice({
        title: 'Генерация завершена',
        description: outcome.isPass ? 'Описание успешно сгенерировано.' : 'Сгенерировано с замечаниями валидатора.',
        type: outcome.isPass ? 'success' : 'warning',
      })
    } else {
      showNotice({
        title: 'Ошибка генерации',
        description: 'Не удалось получить текст описания от LLM.',
        type: 'error',
      })
    }
  } catch (err) {
    console.error('Error generating single product description:', prod.name, err)
    applyGenerationResult(prod, null, err)
    showNotice({
      title: 'Ошибка генерации',
      description: err.message || 'Не удалось получить текст описания от LLM.',
      type: 'error',
    })
  }
}

// Скопировать исходное описание из БД в рабочую область для ручной правки
function copyOriginalToWorking() {
  if (!activeProduct.value || !activeProduct.value.description) return
  activeProduct.value.workingDescription = activeProduct.value.description
  activeProduct.value.hasUnsavedChanges = true
}

// Единый хелпер сохранения описаний в БД
async function persistProducts(targets) {
  try {
    isLoading.value = true
    const payload = targets.map(p => ({
      id: p.id,
      description: p.workingDescription,
      is_ai_description: 1,
    }))

    const res = await $fetch('/api/admin/cms/products/updProds', {
      method: 'POST',
      body: payload,
    })

    isLoading.value = false
    if (!res) return false

    targets.forEach(p => {
      p.description = p.workingDescription
      p.is_ai_description = true
      p.isAiDescription = true
      p.isSaved = true
      p.status = 'saved'
      p.hasUnsavedChanges = false
    })
    return true
  } catch (err) {
    isLoading.value = false
    console.error('Error saving product descriptions:', err)
    showMessage({
      title: 'Ошибка сохранения',
      description: err.message || 'Не удалось сохранить описания товаров.',
      type: 'error',
    })
    return false
  }
}

// Сохранение одного товара в БД
async function saveProduct(prod) {
  if (!prod || !hasWorkingText(prod)) {
    showNotice({ title: 'Предупреждение', description: 'Нет описания для сохранения.', type: 'warning' })
    return
  }

  if (prod.status === 'WARN' || prod.status === 'FAIL' || prod.judgeVerdict === 'FAIL') {
    const proceed = await showMessage({
      title: 'Предупреждение: замечания валидатора',
      description: `У товара «${prod.name}» валидатор выявил замечания к описанию или разметке HTML. Вы уверены, что хотите сохранить это описание в базу данных?`,
      isDialog: true,
    })
    if (!proceed) return
  }

  const ok = await persistProducts([prod])
  if (ok) {
    showNotice({
      title: 'Товар сохранен!',
      description: `Описание товара «${prod.name}» сохранено в БД.`,
      type: 'success',
    })
  }
}

// Массовое сохранение товаров (PASS или с замечаниями валидатора)
async function saveBatchProducts() {
  const isSelected = counts.value.selected > 0
  const targets = products.value.filter(p => {
    if (p.isSaved || !hasWorkingText(p)) return false
    if (isSelected && !p.selected) return false

    if (includeWarnInSave.value) {
      return isProductUnsavedGenerated(p)
    }
    return isProductPass(p)
  })

  if (targets.length === 0) {
    showNotice({
      title: 'Информация',
      description: includeWarnInSave.value ? 'Нет несохраненных товаров с описанием.' : 'Нет несохраненных товаров со статусом PASS.',
      type: 'info',
    })
    return
  }

  const passCount = targets.filter(p => p.status === 'PASS' || p.judgeVerdict === 'PASS').length
  const warnCount = targets.length - passCount
  const totalErrors = counts.value.error

  let desc = `Будет сохранено ${targets.length} товаров в базу данных.`
  if (warnCount > 0) {
    desc += ` (Из них ${passCount} PASS, ${warnCount} с замечаниями валидатора).`
  }
  if (totalErrors > 0 && !isSelected) {
    desc += ` Позиции со сбоем генерации (${totalErrors}) будут пропущены.`
  }
  desc += ' Продолжить?'

  const proceed = await showMessage({
    title: 'Подтвердите сохранение',
    description: desc,
    isDialog: true,
  })
  if (!proceed) return

  const ok = await persistProducts(targets)
  if (ok) {
    showNotice({
      title: 'Успешно сохранено!',
      description: `Обновлены описания для ${targets.length} товаров.`,
      type: 'success',
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
            name="i-lucide-file-pen-line"
            class="text-primary-500 size-6" />
          <span>AI Описания Товаров</span>
        </h1>
        <p class="mt-1 text-xs text-gray-500">Пакетная генерация SEO-описаний товаров на основе характеристик и нормативных документов (ГОСТ / ГРСИ)</p>
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
      class="space-y-3.5 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <!-- Верхний ярус: Название категории и сводная статистика -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <UIcon
            name="i-lucide-folder"
            class="text-primary-500 size-4 shrink-0" />
          <h2
            class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100"
            :title="catData.name">
            {{ catData.name }}
          </h2>
        </div>

        <!-- Сводная плашка метрик категории -->
        <div class="flex items-center divide-x divide-gray-200 rounded-lg border border-gray-200 bg-gray-50/80 py-1 text-xs dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/40">
          <span class="px-2.5 text-gray-600 dark:text-gray-400">
            Всего:
            <strong class="font-semibold text-gray-900 dark:text-gray-100">{{ products.length }}</strong>
          </span>
          <span class="px-2.5 text-emerald-600 dark:text-emerald-400">
            С AI:
            <strong class="font-semibold">{{ counts.withAi }}</strong>
          </span>
          <span class="px-2.5 text-amber-600 dark:text-amber-400">
            Без AI:
            <strong class="font-semibold">{{ counts.withoutAi }}</strong>
          </span>
          <span class="px-2.5 text-gray-600 dark:text-gray-400">
            ГОСТ:
            <strong class="font-semibold text-gray-800 dark:text-gray-200">{{ Object.keys(docsDict.stnd || {}).length }}</strong>
          </span>
          <span class="px-2.5 text-gray-600 dark:text-gray-400">
            ГРСИ:
            <strong class="font-semibold text-gray-800 dark:text-gray-200">{{ Object.keys(docsDict.rstr || {}).length }}</strong>
          </span>
        </div>
      </div>

      <!-- Разделитель между инфо и действиями -->
      <div class="border-t border-gray-100 dark:border-gray-800/80" />

      <!-- Нижний ярус: Тулбар пакетных действий -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Блок пакетной генерации (слева) -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Выбор количества потоков -->
          <USelect
            v-model="concurrencyLimit"
            :items="concurrencyOptions"
            :disabled="isBatchRunning"
            size="sm"
            class="w-32" />

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
        </div>

        <!-- Блок массового сохранения (справа) -->
        <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 py-1 dark:border-gray-800 dark:bg-gray-800/40">
          <UCheckbox
            v-model="includeWarnInSave"
            label="Включая замечания"
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

    <!-- Индикатор прогресса пакета (Nuxt UI v4 UProgress) -->
    <UProgress
      v-if="isBatchRunning"
      v-model="batchProgress.current"
      :max="batchProgress.total"
      status
      size="md"
      color="primary"
      :ui="{ status: 'w-full justify-between' }">
      <template #status="{ percent }">
        <span class="flex min-w-0 items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200">
          <UIcon
            name="i-lucide-loader-2"
            class="text-primary-500 size-4 shrink-0 animate-spin" />
          <span class="truncate">
            В работе (потоков: {{ activeGeneratingProducts.length }}/{{ concurrencyLimit }}):
            <span class="font-normal text-gray-500 dark:text-gray-400">{{ activeGeneratingNames || 'запуск...' }}</span>
          </span>
        </span>
        <span class="ml-2 shrink-0 text-xs font-semibold text-gray-800 dark:text-gray-100">{{ batchProgress.current }} / {{ batchProgress.total }} ({{ percent }}%)</span>
      </template>
    </UProgress>

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
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'WARN' ? 'bg-amber-50 font-semibold text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'WARN'">
            Замечания ({{ counts.warn }})
          </button>
          <button
            type="button"
            :class="['cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors', currentFilter === 'ERROR' ? 'bg-red-50 font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800']"
            @click="currentFilter = 'ERROR'">
            Ошибки ({{ counts.error }})
          </button>
        </div>

        <!-- Скроллируемый список товаров -->
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
                      v-else
                      class="text-gray-400">
                      • Калибровка
                    </span>
                  </div>
                </div>
              </div>

              <!-- Бейджи статуса генерации -->
              <div class="flex-shrink-0">
                <UBadge
                  v-if="prod.status === 'generating'"
                  color="primary"
                  variant="subtle"
                  size="xs"
                  class="border-primary-200 dark:border-primary-800 flex animate-pulse items-center gap-1 border font-semibold">
                  <UIcon
                    name="i-lucide-loader-2"
                    class="text-primary-600 dark:text-primary-400 size-3 animate-spin" />
                  Генерация
                </UBadge>
                <UBadge
                  v-else-if="isProductPass(prod)"
                  color="success"
                  variant="solid"
                  size="xs"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    name="i-lucide-check-circle"
                    class="size-3" />
                  PASS
                </UBadge>
                <UBadge
                  v-else-if="isProductWarn(prod)"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  class="flex items-center gap-1 border border-amber-200 font-semibold dark:border-amber-800/60">
                  <UIcon
                    name="i-lucide-alert-triangle"
                    class="size-3 text-amber-600 dark:text-amber-400" />
                  Замечания
                </UBadge>
                <UBadge
                  v-else-if="isProductError(prod)"
                  color="error"
                  variant="solid"
                  size="xs"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    name="i-lucide-circle-alert"
                    class="size-3" />
                  Ошибка
                </UBadge>
                <UBadge
                  v-else-if="isProductWithAi(prod)"
                  color="success"
                  variant="subtle"
                  size="xs"
                  class="flex items-center gap-1 border border-emerald-200 font-semibold dark:border-emerald-800/60">
                  <UIcon
                    name="i-lucide-check"
                    class="size-3 text-emerald-600 dark:text-emerald-400" />
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
                  v-if="activeProduct.isSaved || activeProduct.isAiDescription"
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
                  v-if="!activeProduct.workingDescription"
                  icon="i-lucide-sparkles"
                  :label="activeProduct.status === 'ERROR' ? 'Повторить генерацию' : 'Сгенерировать товар'"
                  :color="activeProduct.status === 'ERROR' ? 'error' : 'primary'"
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
                    :disabled="!activeProduct.workingDescription || !activeProduct.hasUnsavedChanges || isBatchRunning"
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

            <div class="font-mono text-xs text-gray-400">{{ activeProduct.workingDescription?.length || 0 }} симв.</div>
          </div>

          <!-- 1. ВКЛАДКА: Полный предпросмотр (дефолтная) -->
          <div
            v-show="activeTab === 'preview'"
            class="custom-scrollbar info-block max-h-140 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-gray-800 dark:bg-gray-900">
            <div
              v-if="activeProduct.workingDescription"
              class="description preview-description max-w-none space-y-2 leading-relaxed"
              v-html="activeProduct.workingDescription" />
            <div
              v-else
              class="flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <UIcon
                name="i-lucide-sparkles"
                class="mb-2 size-8 text-gray-300 dark:text-gray-600" />
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Описание еще не сгенерировано</p>
              <p class="mt-1 text-[11px] text-gray-400">Запустите генерацию для создания SEO-описания на основе характеристик и ГОСТ/ГРСИ</p>
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
              v-if="!activeProduct.workingDescription && activeProduct.description"
              class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs dark:border-amber-900 dark:bg-amber-950/40">
              <span class="text-amber-800 dark:text-amber-200">Товар еще не сгенерирован через AI. Вы можете скопировать действующее описание из БД для ручной правки.</span>
              <UButton
                icon="i-lucide-copy"
                label="Скопировать из БД"
                size="xs"
                color="warning"
                variant="subtle"
                @click="copyOriginalToWorking" />
            </div>

            <UTextarea
              v-model="activeProduct.workingDescription"
              :rows="18"
              class="w-full font-mono text-xs"
              placeholder="Введите или отредактируйте HTML код описания..."
              @input="activeProduct.hasUnsavedChanges = true" />
            <p class="text-[11px] text-gray-400">Разрешены только чистые теги &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt; без атрибутов. Вы можете внести точечные изменения вручную и нажать «Сохранить товар».</p>
          </div>

          <!-- 3. ВКЛАДКА: Сравнение «Было / Стало» -->
          <div
            v-show="activeTab === 'split'"
            class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Действующее описание в БД (Было) -->
            <div class="flex flex-col rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60">
              <div class="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                <span class="text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">Действующее описание (В БД)</span>
                <span class="text-[11px] text-gray-400">Было</span>
              </div>

              <div class="custom-scrollbar info-block max-h-120 overflow-y-auto text-xs">
                <div
                  v-if="activeProduct.description"
                  class="description preview-description max-w-none space-y-1.5"
                  v-html="activeProduct.description" />

                <!-- Если описания в БД не было, показываем исходные свойства -->
                <div
                  v-else
                  class="space-y-2 text-gray-500">
                  <p class="mb-2 text-gray-400 italic">Описание в БД отсутствовало. Исходные свойства:</p>
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

            <!-- Сгенерированное описание (Стало) -->
            <div class="border-primary-500/40 dark:border-primary-500/30 flex flex-col rounded-xl border-2 bg-white p-4 dark:bg-gray-900">
              <div class="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                <span class="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase">Сгенерировано AI (Стало)</span>
                <UBadge
                  v-if="activeProduct.judgeVerdict"
                  :color="activeProduct.judgeVerdict === 'PASS' ? 'success' : activeProduct.status === 'WARN' ? 'warning' : 'error'"
                  variant="subtle"
                  size="xs"
                  class="flex items-center gap-1 font-semibold">
                  <UIcon
                    :name="activeProduct.judgeVerdict === 'PASS' ? 'i-lucide-check-circle' : activeProduct.status === 'WARN' ? 'i-lucide-alert-triangle' : 'i-lucide-circle-alert'"
                    class="size-3" />
                  {{ activeProduct.status === 'WARN' ? 'Замечания' : activeProduct.status === 'ERROR' ? 'Ошибка' : activeProduct.judgeVerdict }}
                </UBadge>
              </div>

              <div class="custom-scrollbar info-block max-h-120 overflow-y-auto text-xs">
                <div
                  v-if="activeProduct.workingDescription"
                  class="description preview-description max-w-none space-y-1.5"
                  v-html="activeProduct.workingDescription" />
                <div
                  v-else
                  class="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="mb-2 size-8 text-gray-300 dark:text-gray-600" />
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Описание еще не сгенерировано</p>
                  <p class="mt-1 text-[11px] text-gray-400">Запустите генерацию для создания SEO-описания на основе характеристик и ГОСТ/ГРСИ</p>
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

          <!-- Блок проверки валидатором разметки / статуса генерации -->
          <div
            v-if="activeProduct.judgeVerdict"
            class="space-y-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/60">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300">Валидация HTML / структуры:</span>
                <UBadge
                  :color="activeProduct.judgeVerdict === 'PASS' ? 'success' : activeProduct.status === 'WARN' ? 'warning' : 'error'"
                  variant="solid"
                  size="xs"
                  class="flex items-center gap-1 font-bold">
                  <UIcon
                    :name="activeProduct.judgeVerdict === 'PASS' ? 'i-lucide-check-circle' : activeProduct.status === 'WARN' ? 'i-lucide-alert-triangle' : 'i-lucide-circle-alert'"
                    class="size-3.5" />
                  {{ activeProduct.status === 'WARN' ? 'Замечания (FAIL)' : activeProduct.status === 'ERROR' ? 'Ошибка генерации' : activeProduct.judgeVerdict }}
                </UBadge>
              </div>
            </div>

            <!-- Ошибка / замечания -->
            <div
              v-if="activeProduct.requiredCorrections?.length"
              class="space-y-1">
              <span :class="['text-xs font-semibold', activeProduct.status === 'ERROR' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400']">
                {{ activeProduct.status === 'ERROR' ? 'Причина сбоя:' : 'Замечания валидатора:' }}
              </span>
              <ul :class="['list-disc space-y-1 pl-5 text-xs', activeProduct.status === 'ERROR' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400']">
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
      <p class="mt-1 text-xs text-gray-400">Выберите категорию в выпадающем списке сверху для загрузки товаров и запуска генерации описаний.</p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  --scrollbar-thumb: rgba(156, 163, 175, 0.4);
  --scrollbar-track: rgba(0, 0, 0, 0.03);
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

@supports not (scrollbar-color: auto) {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
  }
}

:deep(.preview-description p) {
  margin-bottom: 0.625rem;
  line-height: 1.6;
}

:deep(.preview-description p:last-child) {
  margin-bottom: 0;
}

:deep(.preview-description ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0.625rem 0;
}

:deep(.preview-description li) {
  margin-bottom: 0.25rem;
  line-height: 1.55;
}
</style>
