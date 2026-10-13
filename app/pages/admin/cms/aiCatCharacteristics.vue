<script setup>
//
useTitle('AI Характеристики Категорий | AdminPanel')
await checkAdminOnly()

const aiResult = ref(null)
const workingCharacteristics = ref('')
const previousCharacteristics = ref(null)
const isSplitMode = ref(false)
const isAiDrawerOpen = ref(false)
const aiMode = ref('quick') // 'quick' | 'deep'
const quickAiPrompt = ref('')
const activeTab = ref('preview')

const isLoading = ref(false)
const initialCharacteristics = ref('')

const hasUnsavedChanges = computed(() => {
  return workingCharacteristics.value !== initialCharacteristics.value
})

const isSaved = computed(() => {
  return Boolean(workingCharacteristics.value && workingCharacteristics.value === initialCharacteristics.value)
})

watch(isLoading, newVal => {
  if (newVal) showLoader()
  else hideLoader()
})

watch(aiMode, newMode => {
  if (newMode === 'deep' && quickAiPrompt.value && !revisionText.value) {
    revisionText.value = quickAiPrompt.value
  } else if (newMode === 'quick' && revisionText.value && !quickAiPrompt.value) {
    quickAiPrompt.value = revisionText.value
  }
})

const hasFullGeneration = computed(() => {
  return Boolean(aiResult.value?.documentExtractions?.length || aiResult.value?.judgeVerdict || aiResult.value?.generatedCharacteristics)
})

const revisionText = ref('')
const reextractDocuments = ref(false)
const showRawOriginal = ref(false)
const isOriginalExpanded = ref(false)

const activeCatAlias = ref(null)
const previousCatAlias = ref(null)
const cats = shallowRef([])

const pageContainerRef = ref(null)
const drawerStyle = ref({})

const updateDrawerLayout = () => {
  if (!pageContainerRef.value) return
  const sampleCard = pageContainerRef.value.querySelector('[data-slot="root"]')
  if (sampleCard) {
    const cardRect = sampleCard.getBoundingClientRect()
    drawerStyle.value = {
      left: `${cardRect.left}px`,
      width: `${cardRect.width}px`,
    }
    return
  }
  const rect = pageContainerRef.value.getBoundingClientRect()
  const paddingX = 24
  drawerStyle.value = {
    left: `${rect.left + paddingX}px`,
    width: `${Math.max(0, rect.width - paddingX * 2)}px`,
  }
}

let drawerResizeObserver = null

const drawerHeight = ref(null)

const initDrawerResize = e => {
  e.preventDefault()
  const startY = e.clientY
  const drawerCard = document.querySelector('.bottom-0 [data-slot="root"]')
  const startHeight = drawerCard ? drawerCard.getBoundingClientRect().height : 220

  const onMouseMove = moveEvent => {
    const deltaY = startY - moveEvent.clientY
    const newHeight = Math.max(180, Math.min(window.innerHeight * 0.85, startHeight + deltaY))
    drawerHeight.value = newHeight
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const defaultWorkingAreaHeight = 520
const workingAreaHeight = ref(defaultWorkingAreaHeight)

const initWorkingAreaResize = e => {
  e.preventDefault()
  const startY = e.clientY
  const startHeight = workingAreaHeight.value

  const onMouseMove = moveEvent => {
    const deltaY = moveEvent.clientY - startY
    const newHeight = Math.max(220, Math.min(window.innerHeight * 0.9, startHeight + deltaY))
    workingAreaHeight.value = Math.round(newHeight)
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const resetWorkingAreaHeight = () => {
  workingAreaHeight.value = defaultWorkingAreaHeight
}

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
    localStorage.removeItem('ai_cms_working_area_height')
  } catch (_) {}

  try {
    const { data: catsData } = await useCats()
    cats.value = mapCats(catsData.value)
  } catch (e) {
    console.error('Error fetching categories:', e)
  }

  updateDrawerLayout()
  window.addEventListener('resize', updateDrawerLayout, { passive: true })
  if (pageContainerRef.value && typeof ResizeObserver !== 'undefined') {
    drawerResizeObserver = new ResizeObserver(() => {
      updateDrawerLayout()
    })
    drawerResizeObserver.observe(pageContainerRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDrawerLayout)
  if (drawerResizeObserver) {
    drawerResizeObserver.disconnect()
    drawerResizeObserver = null
  }
})

watch(isAiDrawerOpen, isOpen => {
  if (isOpen) {
    nextTick(() => {
      updateDrawerLayout()
    })
  }
})

watch(
  () => aiResult.value,
  () => {
    nextTick(() => {
      updateDrawerLayout()
    })
  },
)

function connectionHandler(options = {}) {
  if (!options.workflowId || !options.inputData) {
    showNotice({
      title: 'Ошибка!',
      description: 'workflowId и inputData обязательны для подключения к WebSocket.',
      type: 'error',
    })
    return Promise.resolve(null)
  }

  isLoading.value = true

  return new Promise((resolve, reject) => {
    const errorHandler = (err, logMsg = 'WebSocket error') => {
      isLoading.value = false
      console.error(logMsg, err)
      showMessage({
        title: 'Ошибка!',
        description: 'Ошибка при получении данных от сервера. Подробности в консоли.',
        type: 'error',
      })
      resolve(null)
    }

    try {
      const socket = new WebSocket(`/api/admin/mastraWsAdapter`)

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
            isLoading.value = false
            socket.close()
            playNotificationSound()
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

let isReverting = false

async function onCategoryChange(newAlias) {
  if (isReverting) {
    isReverting = false
    return
  }

  if (hasUnsavedChanges.value && previousCatAlias.value && previousCatAlias.value !== newAlias) {
    const proceed = await showMessage({
      title: 'Подтвердите смену категории',
      description: 'Есть несохраненные изменения для текущей категории. При смене категории текущие результаты будут сброшены. Продолжить?',
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
    aiResult.value = null
    previousCatAlias.value = null
    initialCharacteristics.value = ''
    workingCharacteristics.value = ''
    previousCharacteristics.value = null
    isSplitMode.value = false
    resetWorkingAreaHeight()
    return
  }

  previousCatAlias.value = newAlias
  aiResult.value = null
  previousCharacteristics.value = null
  isSplitMode.value = false
  resetWorkingAreaHeight()

  try {
    isLoading.value = true
    const res = await $fetch(`/api/getData/category/${newAlias}`)
    isLoading.value = false
    if (res && typeof res === 'object' && 'catData' in res) {
      aiResult.value = {
        originalData: res.catData,
        generatedCharacteristics: null,
      }
      const loadedChars = res.catData?.characteristics || ''
      initialCharacteristics.value = loadedChars
      workingCharacteristics.value = loadedChars
      aiMode.value = 'quick'
    }
  } catch (e) {
    isLoading.value = false
    console.error('Error fetching category data:', e)
  }
}

watch(activeCatAlias, newVal => {
  onCategoryChange(newVal)
})

const editorTabs = [
  { value: 'preview', label: 'Предпросмотр', icon: 'i-lucide-eye' },
  { value: 'edit', label: 'Редактирование HTML', icon: 'i-lucide-code-xml' },
]

// Быстрая AI-правка (html-content-edit)
const handleQuickAiEdit = async () => {
  if (!quickAiPrompt.value.trim()) {
    showNotice({
      title: 'Ошибка!',
      description: 'Пожалуйста, введите текст инструкции для AI.',
      type: 'error',
    })
    return
  }

  const response = await connectionHandler({
    workflowId: 'html-content-edit',
    inputData: {
      text: workingCharacteristics.value,
      instruction: quickAiPrompt.value,
    },
  })

  if (response) {
    const updatedHtml = response.modifiedText || (typeof response === 'string' ? response : null)
    if (updatedHtml) {
      previousCharacteristics.value = workingCharacteristics.value
      workingCharacteristics.value = updatedHtml
      isSplitMode.value = false
      activeTab.value = 'preview'
      quickAiPrompt.value = ''
      showNotice({
        title: 'Правки применены!',
        description: 'Предыдущая версия сохранена. Нажмите «Сравнить», если хотите сопоставить.',
        type: 'success',
      })
    }
  }
}

const revertToPrevious = () => {
  if (!previousCharacteristics.value) return
  const temp = workingCharacteristics.value
  workingCharacteristics.value = previousCharacteristics.value
  previousCharacteristics.value = temp
  showNotice({
    title: 'Предыдущая версия восстановлена',
    type: 'info',
  })
}

const toggleSplitMode = explicitVal => {
  if (explicitVal !== undefined) isSplitMode.value = explicitVal
  else isSplitMode.value = !isSplitMode.value
  activeTab.value = 'preview'
}

// Полная генерация с нуля (ГОСТ/ГРСИ)
async function handleFullRegenerate() {
  if (!activeCatAlias.value) return

  if (workingCharacteristics.value && workingCharacteristics.value.trim().length > 0) {
    const proceed = await showMessage({
      title: 'Подтвердите полную генерацию',
      description: 'В редакторе уже есть характеристики. Полная генерация перезапишет текущий текст. Продолжить?',
      isDialog: true,
    })
    if (!proceed) return
  }

  await generateCharacteristics()
}

async function generateCharacteristics() {
  if (!activeCatAlias.value) return

  const response = await connectionHandler({
    workflowId: 'category-characteristics',
    inputData: {
      alias: activeCatAlias.value,
    },
    // runId: '592973ef-724c-412e-b485-c2110d6d5d50',
  })

  if (response) {
    aiResult.value = response
    const finalHtml = response.finalCharacteristics || response.generatedCharacteristics || ''
    if (workingCharacteristics.value && workingCharacteristics.value !== finalHtml) {
      previousCharacteristics.value = workingCharacteristics.value
      isSplitMode.value = false
    }
    workingCharacteristics.value = finalHtml
    aiMode.value = 'deep'
    activeTab.value = 'preview'
  }
}

async function resetAndRegenerate() {
  const proceed = await showMessage({
    title: 'Подтвердите сброс',
    description: 'Текущие характеристики будут сброшены. Запустить генерацию заново?',
    isDialog: true,
  })
  if (proceed) {
    if (aiResult.value) {
      aiResult.value.generatedCharacteristics = null
      aiResult.value.failedAttempts = []
      aiResult.value.judgeVerdict = null
    }
    await generateCharacteristics()
  }
}

// Глубокий запрос на доработку (Mastra Workflow)
const handleRevision = async () => {
  if (!revisionText.value.trim()) {
    showNotice({
      title: 'Ошибка!',
      description: 'Пожалуйста, введите текст для доработки.',
      type: 'error',
    })
    return
  }

  if (reextractDocuments.value || !aiResult.value?.documentExtractions?.length) {
    const prevFailed = aiResult.value?.failedAttempts || []
    const currentHTML = workingCharacteristics.value
    const currentRevisionText = revisionText.value

    const response = await connectionHandler({
      workflowId: 'category-characteristics',
      inputData: {
        alias: activeCatAlias.value,
        editorFeedback: currentRevisionText,
      },
    })
    if (response) {
      const mergedFailedAttempts = [
        ...prevFailed,
        ...(currentHTML
          ? [
              {
                generatedCharacteristics: currentHTML,
                editorContent: `[Переизвлечение из документов]: ${currentRevisionText}`,
              },
            ]
          : []),
        ...(response.failedAttempts || []),
      ]

      aiResult.value = {
        ...response,
        failedAttempts: mergedFailedAttempts,
      }
      const finalHtml = response.finalCharacteristics || response.generatedCharacteristics || ''
      previousCharacteristics.value = workingCharacteristics.value
      workingCharacteristics.value = finalHtml
      isSplitMode.value = false
      revisionText.value = ''
      reextractDocuments.value = false
    }
  } else {
    const response = await connectionHandler({
      workflowId: 'category-characteristics-revision',
      inputData: {
        originalData: aiResult.value?.originalData,
        documentExtractions: aiResult.value?.documentExtractions || [],
        fallbackResearch: aiResult.value?.fallbackResearch || null,
        usedFallback: aiResult.value?.usedFallback || false,
        generatedCharacteristics: workingCharacteristics.value,
        revisionText: revisionText.value,
      },
    })

    if (response) {
      if (aiResult.value) {
        aiResult.value.judgeVerdict = response.judgeEvaluation?.verdict

        if (aiResult.value.failedAttempts?.length) {
          aiResult.value.failedAttempts[aiResult.value.failedAttempts.length - 1].editorContent = revisionText.value
        } else {
          aiResult.value.failedAttempts = aiResult.value.failedAttempts || []
          aiResult.value.failedAttempts.push({
            generatedCharacteristics: workingCharacteristics.value,
            editorContent: revisionText.value,
          })
        }

        aiResult.value.failedAttempts.push({
          generatedCharacteristics: response.finalCharacteristics,
          critique: response.judgeEvaluation?.critique,
          requiredCorrections: response.judgeEvaluation?.requiredCorrections || [],
        })
      }

      previousCharacteristics.value = workingCharacteristics.value
      workingCharacteristics.value = response.finalCharacteristics
      isSplitMode.value = false
      revisionText.value = ''
    }
  }
}

const handleSave = async () => {
  if (!activeCatAlias.value) return

  const cat = cats.value.find(c => c.alias === activeCatAlias.value)
  if (!cat) {
    await showMessage({
      title: 'Ошибка!',
      description: 'Категория не найдена.',
      type: 'error',
    })
    return
  }

  try {
    const payload = {
      [cat.id]: {
        characteristics: workingCharacteristics.value,
      },
    }

    const response = await myFetch('/api/admin/setCategories', {
      method: 'POST',
      payload: payload,
    })

    if (response && response.status === 'ok') {
      initialCharacteristics.value = workingCharacteristics.value
      await showNotice({
        title: 'Характеристики успешно сохранены!',
        type: 'success',
      })
    } else {
      throw new Error(response?.message || 'Ошибка при сохранении')
    }
  } catch (e) {
    await showMessage({
      title: 'Ошибка!',
      description: e.message || 'Не удалось сохранить характеристики.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div
    ref="pageContainerRef"
    class="mx-auto max-w-5xl space-y-6 p-6 pb-48">
    <!-- Шапка страницы и выбор категории -->
    <div class="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold">
          <span>AI Характеристики Категорий</span>
        </h1>
        <p class="mt-1 text-xs text-gray-500">Редактирование, быстрые AI-правки и глубокая генерация по стандартам</p>
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
          class="w-96" />
      </div>
    </div>

    <div
      v-if="aiResult"
      class="space-y-6">
      <!-- Снимок исходных характеристик в базе данных (до изменений) -->
      <UCard :ui="{ body: isOriginalExpanded ? 'p-4 sm:p-5' : 'hidden' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <UIcon
                  name="i-lucide-file-text"
                  class="size-4 text-gray-500" />
                Исходные характеристики в БД (снимок)
              </h2>
              <NuxtLink
                :to="`/catalog/${aiResult.originalData?.alias || activeCatAlias}`"
                target="_blank"
                class="inline-flex">
                <UBadge
                  variant="subtle"
                  color="neutral"
                  class="cursor-pointer font-mono text-xs">
                  {{ aiResult.originalData?.alias || activeCatAlias }}
                </UBadge>
              </NuxtLink>
            </div>
            <div class="flex items-center gap-2">
              <template v-if="isOriginalExpanded">
                <span class="text-xs text-gray-500">Raw HTML</span>
                <USwitch
                  v-model="showRawOriginal"
                  size="xs" />
              </template>
              <UButton
                :icon="isOriginalExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                :label="isOriginalExpanded ? 'Свернуть снимок' : 'Показать снимок БД'"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="isOriginalExpanded = !isOriginalExpanded" />
            </div>
          </div>
        </template>

        <div
          v-if="isOriginalExpanded"
          class="info-block">
          <div
            v-if="!showRawOriginal"
            class="characteristics preview-tables max-h-96 max-w-none space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-gray-900"
            v-html="aiResult.originalData?.characteristics || '<em class=\'text-gray-400\'>Характеристики отсутствуют</em>'" />
          <pre
            v-else
            class="max-h-96 max-w-none overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs whitespace-pre-wrap dark:border-gray-800 dark:bg-gray-900"
            >{{ aiResult.originalData?.characteristics }}</pre>
        </div>
      </UCard>

      <!-- ОСНОВНАЯ РАБОЧАЯ ОБЛАСТЬ (EDITOR) -->
      <UCard :ui="{ body: 'space-y-4 p-5 sm:p-6' }">
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base leading-none font-semibold">Рабочая область характеристик</h2>
                <UBadge
                  v-if="aiResult.judgeVerdict"
                  :color="aiResult.judgeVerdict === 'PASS' ? 'success' : 'error'"
                  variant="solid"
                  size="xs"
                  class="font-bold">
                  Арбитр: {{ aiResult.judgeVerdict }}
                </UBadge>
              </div>
              <p class="mt-1 text-xs text-gray-500">Редактируйте HTML вручную или вызовите панель ИИ внизу экрана</p>
            </div>

            <!-- Тулбар действий (без дублирования кнопки ИИ) -->
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                icon="i-lucide-sparkles"
                label="Полная генерация"
                variant="outline"
                color="primary"
                size="sm"
                @click="handleFullRegenerate" />

              <UBadge
                v-if="isSaved"
                color="success"
                variant="subtle"
                size="md"
                class="font-semibold">
                Сохранено
              </UBadge>

              <UButton
                icon="i-lucide-save"
                label="Сохранить"
                variant="solid"
                color="success"
                size="sm"
                @click="handleSave" />
            </div>
          </div>
        </template>

        <!-- Переключатели вкладок и сплит-режима -->
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
            <UTabs
              v-model="activeTab"
              :content="false"
              :items="editorTabs"
              color="primary"
              variant="link" />

            <!-- Кнопка включения/выключения сплит-просмотра -->
            <div class="flex items-center gap-3">
              <div
                v-if="previousCharacteristics"
                class="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs dark:border-amber-800 dark:bg-amber-950/40">
                <span class="font-medium text-amber-800 dark:text-amber-300">Есть предыдущая версия:</span>
                <UButton
                  :icon="isSplitMode ? 'i-lucide-columns-1' : 'i-lucide-columns-2'"
                  :label="isSplitMode ? 'Свернуть' : 'Сравнить'"
                  variant="link"
                  color="warning"
                  size="xs"
                  @click="toggleSplitMode()" />
                <span class="text-amber-300 dark:text-amber-700">|</span>
                <UButton
                  icon="i-lucide-undo-2"
                  label="Вернуть"
                  variant="link"
                  color="warning"
                  size="xs"
                  @click="revertToPrevious" />
              </div>
              <span class="font-mono text-xs text-gray-400">{{ workingCharacteristics?.length || 0 }} символов</span>
            </div>
          </div>

          <!-- 1. Вкладка предпросмотра -->
          <div v-show="activeTab === 'preview'">
            <!-- Обычный режим предпросмотра (1 колонка) -->
            <div
              v-if="!isSplitMode"
              :style="{ height: `${workingAreaHeight}px` }"
              class="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
              <div
                class="characteristics preview-tables max-w-none space-y-2 overflow-x-auto text-sm leading-relaxed"
                v-html="workingCharacteristics || '<em class=\'text-gray-400\'>Характеристики пока не заданы. Введите HTML во вкладке «Редактирование» или запустите генерацию.</em>'" />
            </div>

            <!-- Сплит-режим сравнения (Side-by-Side: Было / Стало в 2 колонки) -->
            <div
              v-else
              :style="{ height: `${workingAreaHeight}px` }"
              class="grid min-h-[260px] grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Левая колонка: Предыдущая версия (Было) -->
              <div class="flex h-full flex-col overflow-hidden rounded-lg border-2 border-amber-300 bg-amber-50/20 dark:border-amber-800">
                <div class="flex shrink-0 items-center justify-between border-b border-amber-200 bg-amber-100/60 p-2.5 dark:border-amber-800 dark:bg-amber-950/60">
                  <span class="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <UIcon
                      name="i-lucide-history"
                      class="size-3.5" />
                    Было (Предыдущая версия)
                  </span>
                  <div class="flex items-center gap-1.5">
                    <UButton
                      icon="i-lucide-undo-2"
                      label="Вернуть"
                      color="warning"
                      variant="solid"
                      size="xs"
                      @click="revertToPrevious" />
                    <UButton
                      icon="i-lucide-chevron-left"
                      label="Свернуть"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      @click="toggleSplitMode(false)" />
                  </div>
                </div>
                <div
                  class="characteristics preview-tables flex-1 overflow-auto bg-white p-4 text-xs leading-relaxed dark:bg-gray-900"
                  v-html="previousCharacteristics" />
              </div>

              <!-- Правая колонка: Текущая версия (Стало) -->
              <div class="border-primary-300 bg-primary-50/20 dark:border-primary-800 flex h-full flex-col overflow-hidden rounded-lg border-2">
                <div class="border-primary-200 bg-primary-100/60 dark:border-primary-800 dark:bg-primary-950/60 flex shrink-0 items-center justify-between border-b p-2.5">
                  <span class="text-primary-900 dark:text-primary-200 flex items-center gap-1.5 text-xs font-bold">
                    <UIcon
                      name="i-lucide-sparkles"
                      class="size-3.5" />
                    Стало (Текущая версия)
                  </span>
                  <UButton
                    icon="i-lucide-minimize-2"
                    label="Свернуть сравнение"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    @click="toggleSplitMode(false)" />
                </div>
                <div
                  class="characteristics preview-tables flex-1 overflow-auto bg-white p-4 text-xs leading-relaxed dark:bg-gray-900"
                  v-html="workingCharacteristics" />
              </div>
            </div>
          </div>

          <!-- 2. Вкладка редактирования сырого HTML -->
          <div
            v-show="activeTab === 'edit'"
            :style="{ height: `${workingAreaHeight}px` }">
            <UTextarea
              v-model="workingCharacteristics"
              class="working-area-textarea h-full w-full font-mono text-xs"
              :ui="{
                root: 'h-full w-full flex flex-col',
                base: 'h-full w-full flex-1 font-mono text-xs resize-none',
              }"
              placeholder="Введите или отредактируйте HTML разметку характеристик..." />
          </div>

          <!-- Маркер изменения высоты рабочей области (перетягивание вверх/вниз) -->
          <div
            class="group mt-1 -mb-1 flex h-4 w-full cursor-row-resize items-center justify-center select-none"
            title="Потяните вниз/вверх для изменения высоты рабочей области (двойной клик — сброс)"
            @mousedown="initWorkingAreaResize"
            @dblclick="resetWorkingAreaHeight">
            <div class="group-hover:bg-primary-500 dark:group-hover:bg-primary-400 h-1.5 w-16 rounded-full bg-gray-200 transition-all group-hover:w-24 dark:bg-gray-700" />
          </div>
        </div>
      </UCard>

      <!-- ========================================================================= -->
      <!-- АРТЕФАКТЫ ПОЛНОЙ ГЕНЕРАЦИИ (Показываются только при наличии контекста)     -->
      <!-- ========================================================================= -->
      <div
        v-if="aiResult.failedAttempts?.length || aiResult.documentExtractions?.length || aiResult.usedFallback"
        class="space-y-6">
        <!-- Последняя критика арбитра -->
        <UCard
          v-if="aiResult.failedAttempts?.length"
          :ui="{ body: 'space-y-3 p-5' }"
          class="border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/20">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-message-square-warning"
              class="size-5 text-red-600" />
            <h2 class="text-sm font-bold text-red-900 dark:text-red-200">Последняя критика арбитра качества</h2>
          </div>

          <div
            v-if="aiResult.failedAttempts.length >= 2 && aiResult.failedAttempts[aiResult.failedAttempts.length - 2]?.editorContent"
            class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
            <strong>Инструкция редактора:</strong>
            {{ aiResult.failedAttempts[aiResult.failedAttempts.length - 2].editorContent }}
          </div>

          <div
            v-if="aiResult.failedAttempts[aiResult.failedAttempts.length - 1]?.requiredCorrections?.length"
            class="rounded-lg border border-red-200 bg-white p-3 text-xs text-red-900 dark:border-red-800 dark:bg-gray-900 dark:text-red-300">
            <span class="mb-1 block font-semibold">Требуемые исправления:</span>
            <ul class="list-disc space-y-0.5 pl-4">
              <li
                v-for="correction in aiResult.failedAttempts[aiResult.failedAttempts.length - 1].requiredCorrections"
                :key="correction">
                {{ correction }}
              </li>
            </ul>
          </div>
        </UCard>

        <!-- Неудачные попытки (Аккордеон истории попыток Mastra) -->
        <UCard
          v-if="aiResult.failedAttempts?.length"
          :ui="{ body: 'space-y-3 p-5' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="flex items-center gap-2 text-sm font-semibold">
                <UIcon
                  name="i-lucide-history"
                  class="size-4 text-gray-500" />
                Неудачные попытки (История итераций Mastra)
              </h2>
              <UBadge
                variant="subtle"
                color="neutral"
                size="xs">
                Итераций: {{ aiResult.failedAttempts.length }}
              </UBadge>
            </div>
          </template>

          <UAccordion
            type="multiple"
            :items="
              aiResult.failedAttempts.map((attempt, index) => ({
                label: `Попытка №${index + 1}`,
                attempt,
              }))
            ">
            <template #content="{ item }">
              <div class="space-y-2 p-3 text-xs">
                <div class="info-block">
                  <div
                    class="characteristics preview-tables max-w-none space-y-2 rounded border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-900"
                    v-html="item.attempt.generatedCharacteristics" />
                </div>

                <div
                  v-if="item.attempt.critique"
                  class="rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  <strong>Критика арбитра:</strong>
                  <div class="mt-1 whitespace-pre-wrap">{{ typeof item.attempt.critique === 'string' ? item.attempt.critique : JSON.stringify(item.attempt.critique, null, 2) }}</div>
                </div>

                <div
                  v-if="item.attempt.requiredCorrections?.length"
                  class="rounded border border-red-200 bg-red-50 p-2.5 text-xs text-red-900 dark:bg-red-950/40 dark:text-red-200">
                  <strong>Требуемые исправления:</strong>
                  <ul class="mt-1 list-disc space-y-0.5 pl-4">
                    <li
                      v-for="correction in item.attempt.requiredCorrections"
                      :key="correction">
                      {{ correction }}
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </UAccordion>
        </UCard>

        <!-- ИСТОЧНИКИ ДАННЫХ (Официальные документы ГОСТ / ГРСИ) — В САМОМ НИЗУ СТРАНИЦЫ -->
        <UCard
          v-if="aiResult.usedFallback || aiResult.documentExtractions?.length"
          :ui="{ body: 'space-y-4 p-5 sm:p-6' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="flex items-center gap-2 text-base font-semibold">
                <UIcon
                  name="i-lucide-book-open"
                  class="text-primary-600 size-5" />
                Источники данных (Официальные документы)
              </h2>
              <UBadge
                v-if="aiResult.usedFallback"
                color="warning"
                variant="subtle">
                Режим Fallback-исследования
              </UBadge>
              <UBadge
                v-else
                color="info"
                variant="subtle">
                Документов: {{ aiResult.documentExtractions?.length || 0 }}
              </UBadge>
            </div>
          </template>

          <div
            v-if="aiResult.usedFallback && aiResult.fallbackResearch"
            class="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <strong class="font-semibold">Синтезированное исследование (Tavily):</strong>
            <p class="font-mono text-xs whitespace-pre-wrap">{{ aiResult.fallbackResearch.technicalSummary }}</p>
          </div>

          <div
            v-if="!aiResult.usedFallback && aiResult.documentExtractions?.length"
            class="space-y-3">
            <UAccordion
              type="multiple"
              :items="
                aiResult.documentExtractions.map((doc, index) => ({
                  label: `${doc.docType === 'stnd' ? 'Стандарт' : 'ГРСИ'} ${doc.docNumber} (${doc.docName || 'Без названия'}) — ${doc.year} г.`,
                  doc,
                }))
              ">
              <template #content="{ item }">
                <div class="space-y-2 p-3 text-xs">
                  <div class="flex items-center gap-2 text-gray-500">
                    <span>Тип: {{ item.doc.docType === 'stnd' ? 'ГОСТ/Стандарт' : 'ГРСИ (Реестр)' }}</span>
                    <span>•</span>
                    <span>Товаров соотнесено: {{ item.doc.productsCount }}</span>
                    <span v-if="item.doc.fileLink">•</span>
                    <a
                      v-if="item.doc.fileLink"
                      :href="item.doc.fileLink"
                      target="_blank"
                      class="text-primary-600 underline">
                      Открыть документ
                    </a>
                  </div>
                  <div class="info-block">
                    <div
                      class="characteristics preview-tables max-w-none overflow-x-auto rounded border border-gray-200 bg-white p-3 text-xs whitespace-pre-wrap dark:border-gray-800 dark:bg-gray-900 [&_table]:whitespace-normal"
                      v-html="item.doc.extractedMarkdown" />
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
        </UCard>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ПЛАВАЮЩАЯ КНОПКА ИИ (Внизу справа: строгая круглая иконка без анимаций)    -->
    <!-- ========================================================================= -->
    <div
      v-if="aiResult && !isAiDrawerOpen"
      class="fixed right-6 bottom-6 z-40">
      <UButton
        icon="i-lucide-sparkles"
        size="xl"
        color="primary"
        variant="solid"
        class="flex size-12 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105"
        title="Панель ИИ-ассистента"
        @click="isAiDrawerOpen = true" />
    </div>

    <!-- ========================================================================= -->
    <!-- ЗАКРЕПЛЕННЫЙ ВЫДВИЖНОЙ ФУТЕР (Fixed AI Dock Drawer)                       -->
    <!-- ========================================================================= -->
    <div
      v-if="aiResult"
      :style="drawerStyle"
      :class="['fixed bottom-0 z-50 transition-all duration-300', isAiDrawerOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0']">
      <UCard
        :ui="{ body: 'p-4 sm:p-5 flex flex-col flex-1' }"
        :style="{ height: drawerHeight ? `${drawerHeight}px` : undefined }"
        class="border-primary-500 flex w-full flex-col rounded-t-2xl rounded-b-none border-t-2 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-gray-900/95">
        <!-- Верхний маркер изменения высоты футера (перетягивание вверх/вниз) -->
        <div
          class="group -mt-2 mb-2 flex h-3 w-full cursor-row-resize items-center justify-center select-none"
          title="Потяните вверх/вниз для изменения высоты футера (двойной клик — сброс)"
          @mousedown="initDrawerResize"
          @dblclick="drawerHeight = null">
          <div class="group-hover:bg-primary-500 dark:group-hover:bg-primary-400 h-1 w-12 rounded-full bg-gray-300 transition-colors dark:bg-gray-700" />
        </div>

        <div class="flex flex-1 items-stretch gap-4">
          <!-- ЛЕВАЯ КОЛОНКА: TEXTAREA (МАКСИМУМ ПРОСТРАНСТВА) -->
          <div class="flex min-w-0 flex-1 flex-col">
            <UTextarea
              v-if="aiMode === 'quick'"
              v-model="quickAiPrompt"
              :rows="5"
              placeholder="Опишите, что изменить в характеристиках (например: добавить колонку с погрешностью по ГОСТ, оформить компактной таблицей, исключить устаревшие типоразмеры)..."
              class="ai-drawer-textarea w-full flex-1"
              :ui="{
                root: 'w-full flex-1 flex flex-col',
                base: 'w-full min-h-[140px] text-xs font-sans',
              }"
              @keydown.ctrl.enter="handleQuickAiEdit" />
            <UTextarea
              v-else
              v-model="revisionText"
              :rows="5"
              placeholder="Замечание к ГОСТ/ГРСИ для глубокого цикла с арбитром (например: скорректируй диапазоны измерений по ГОСТ 166-89, добавь поверку)..."
              class="ai-drawer-textarea w-full flex-1"
              :ui="{
                root: 'w-full flex-1 flex flex-col',
                base: 'w-full min-h-[140px] text-xs font-sans',
              }"
              @keydown.ctrl.enter="handleRevision" />
          </div>

          <!-- ПРАВАЯ КОЛОНКА: УПРАВЛЕНИЕ (УЖАТАЯ ШИРИНА w-52) -->
          <div class="flex w-52 shrink-0 flex-col justify-between border-l border-gray-200 pl-4 dark:border-gray-800">
            <div class="space-y-2">
              <!-- Верх: кнопка сворачивания в правом углу -->
              <div class="flex items-center justify-end">
                <UButton
                  icon="i-lucide-chevron-down"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  title="Свернуть"
                  @click="isAiDrawerOpen = false" />
              </div>

              <!-- Вертикальный список режимов (без лишних меток HTML и Mastra) -->
              <div class="space-y-1">
                <button
                  type="button"
                  :class="['w-full rounded-lg px-3 py-2 text-left text-xs transition-all', aiMode === 'quick' ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800 border font-semibold' : 'border border-transparent font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800']"
                  @click="aiMode = 'quick'">
                  Быстрая правка
                </button>
                <button
                  type="button"
                  :disabled="!hasFullGeneration"
                  :title="!hasFullGeneration ? 'Сначала запустите «Полная генерация (ГОСТ)»' : ''"
                  :class="['w-full rounded-lg px-3 py-2 text-left text-xs transition-all', !hasFullGeneration ? 'cursor-not-allowed border border-transparent text-gray-400 opacity-40' : aiMode === 'deep' ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800 border font-semibold' : 'border border-transparent font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800']"
                  @click="hasFullGeneration && (aiMode = 'deep')">
                  Запрос на доработку
                </button>
              </div>

              <!-- Чекбокс: Переизвлечь из документов (зарезервированное место без скачков) -->
              <div class="flex min-h-[26px] items-center pt-1">
                <UCheckbox
                  v-model="reextractDocuments"
                  :class="{ 'pointer-events-none invisible': aiMode !== 'deep' }"
                  label="Переизвлечь из документов"
                  size="xs" />
              </div>
            </div>

            <!-- Низ: кнопка действия «Отправить» -->
            <div class="pt-2">
              <UButton
                icon="i-lucide-send"
                label="Отправить"
                color="primary"
                size="md"
                block
                @click="aiMode === 'quick' ? handleQuickAiEdit() : handleRevision()" />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
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

:deep(.ai-drawer-textarea) {
  width: 100% !important;
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.ai-drawer-textarea textarea) {
  width: 100% !important;
  height: 100%;
  min-height: 140px;
  max-height: 75vh;
  resize: vertical !important;
  box-sizing: border-box !important;
}

:deep(.ai-drawer-textarea textarea::-webkit-resizer) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M10 2L2 10M10 6L6 10M10 10L10 10' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-position: bottom 2px right 2px;
  background-repeat: no-repeat;
  width: 14px;
  height: 14px;
}

:deep(.working-area-textarea) {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.working-area-textarea textarea) {
  height: 100% !important;
  flex: 1 1 auto !important;
  resize: none !important;
}
</style>
