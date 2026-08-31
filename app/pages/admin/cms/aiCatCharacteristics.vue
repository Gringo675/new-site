<script setup>
//
await checkAdminOnly()

const aiResult = ref(null)
const isLoading = ref(false)
const isSaved = ref(false)

watch(isLoading, newVal => {
  if (newVal) showLoader()
  else hideLoader()
})

const revisionText = ref('')
const showRawOriginal = ref(false)

const activeCatAlias = ref(null)
const previousCatAlias = ref(null)
const cats = shallowRef([])

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

async function onCategoryChange(newAlias) {
  if (!newAlias) {
    activeCatAlias.value = null
    aiResult.value = null
    previousCatAlias.value = null
    return
  }

  if (aiResult.value && aiResult.value.generatedCharacteristics && previousCatAlias.value && previousCatAlias.value !== newAlias) {
    const proceed = await showMessage({
      title: 'Подтвердите смену категории',
      description: 'Есть сгенерированные характеристики для текущей категории. При смене категории текущие результаты будут сброшены. Продолжить?',
      isDialog: true,
    })
    if (!proceed) {
      activeCatAlias.value = previousCatAlias.value
      return
    }
  }

  previousCatAlias.value = newAlias
  isSaved.value = false
  aiResult.value = null

  try {
    isLoading.value = true
    const res = await $fetch(`/api/getData/category/${newAlias}`)
    isLoading.value = false
    if (res && typeof res === 'object' && 'catData' in res) {
      aiResult.value = {
        originalData: res.catData,
        generatedCharacteristics: null,
      }
    }
  } catch (e) {
    isLoading.value = false
    console.error('Error fetching category data:', e)
  }
}

watch(activeCatAlias, newVal => {
  onCategoryChange(newVal)
})

async function generateCharacteristics() {
  if (!activeCatAlias.value) return

  const response = await connectionHandler({
    workflowId: 'category-characteristics',
    inputData: {
      alias: activeCatAlias.value,
    },
  })

  if (response) {
    aiResult.value = response
  }
}

async function resetAndRegenerate() {
  const proceed = await showMessage({
    title: 'Подтвердите сброс',
    description: 'Текущие сгенерированные характеристики будут сброшены. Запустить генерацию заново?',
    isDialog: true,
  })
  if (proceed) {
    aiResult.value.generatedCharacteristics = null
    aiResult.value.failedAttempts = []
    aiResult.value.judgeVerdict = null
    await generateCharacteristics()
  }
}

const handleRevision = async () => {
  if (!revisionText.value.trim()) {
    showNotice({
      title: 'Ошибка!',
      description: 'Пожалуйста, введите текст для доработки.',
      type: 'error',
    })
    return
  }

  const response = await connectionHandler({
    workflowId: 'category-characteristics-revision',
    inputData: {
      originalData: aiResult.value.originalData,
      documentExtractions: aiResult.value.documentExtractions || [],
      fallbackResearch: aiResult.value.fallbackResearch || null,
      usedFallback: aiResult.value.usedFallback || false,
      generatedCharacteristics: aiResult.value.generatedCharacteristics,
      revisionText: revisionText.value,
    },
  })
  console.log(`response: ${JSON.stringify(response, null, 2)}`)
  if (response) {
    aiResult.value.judgeVerdict = response.judgeEvaluation?.verdict

    if (aiResult.value.failedAttempts?.length) {
      aiResult.value.failedAttempts[aiResult.value.failedAttempts.length - 1].editorContent = revisionText.value
    } else {
      aiResult.value.failedAttempts = aiResult.value.failedAttempts || []
      aiResult.value.failedAttempts.push({
        generatedCharacteristics: aiResult.value.generatedCharacteristics,
        editorContent: revisionText.value,
      })
    }

    aiResult.value.failedAttempts.push({
      generatedCharacteristics: response.finalCharacteristics,
      critique: response.judgeEvaluation?.critique,
      requiredCorrections: response.judgeEvaluation?.requiredCorrections || [],
    })

    aiResult.value.generatedCharacteristics = response.finalCharacteristics
    revisionText.value = ''
  }
}

const handleSave = async () => {
  if (!activeCatAlias.value || !aiResult.value) return

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
        characteristics: aiResult.value.generatedCharacteristics,
      },
    }

    const response = await myFetch('/api/admin/setCategories', {
      method: 'POST',
      payload: payload,
    })

    if (response && response.status === 'ok') {
      isSaved.value = true
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
  <div class="mx-auto max-w-5xl space-y-8 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">AI Характеристики Категорий</h1>
      <div class="flex items-center gap-3">
        <USelectMenu
          v-model="activeCatAlias"
          :items="cats"
          value-key="alias"
          :search-input="{
            placeholder: 'Filter...',
            icon: 'i-lucide-filter',
            type: 'search',
          }"
          placeholder="Выберите категорию"
          class="w-96" />
      </div>
    </div>

    <div
      v-if="aiResult"
      class="space-y-8">
      <!-- Original Characteristics -->
      <section class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-file-text" />
            Исходные характеристики
          </h2>
          <div class="flex items-center gap-3">
            <UBadge
              variant="subtle"
              color="neutral"
              class="font-mono text-xs">
              {{ aiResult.originalData?.alias || activeCatAlias }}
            </UBadge>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Raw HTML</span>
              <USwitch v-model="showRawOriginal" />
            </div>
          </div>
        </div>
        <div class="info-block">
          <div
            v-if="!showRawOriginal"
            class="description max-w-none space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4"
            v-html="aiResult.originalData?.characteristics || '<em class=\'text-gray-400\'>Характеристики отсутствуют</em>'" />
          <pre
            v-else
            class="max-w-none overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap"
            >{{ aiResult.originalData?.characteristics }}</pre
          >
        </div>
      </section>

      <!-- Generate Action CTA (shown when generatedCharacteristics is not yet present) -->
      <section
        v-if="!aiResult.generatedCharacteristics"
        class="border-primary-300 bg-primary-50/30 space-y-4 rounded-xl border-2 border-dashed p-8 text-center shadow-sm">
        <h2 class="text-lg font-semibold">Готово к генерации</h2>
        <p class="text-sm text-gray-600">Нажмите кнопку ниже, чтобы запустить AI-генерацию характеристик категории.</p>
        <UButton
          icon="i-lucide-sparkles"
          size="lg"
          label="Сгенерировать характеристики"
          color="primary"
          @click="generateCharacteristics" />
      </section>

      <div
        v-if="aiResult.generatedCharacteristics"
        class="space-y-8">
        <!-- Generated Characteristics -->
        <section class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-lg font-semibold">
              <UIcon name="i-lucide-sparkles" />
              Сгенерированные характеристики
            </h2>
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-500">Вердикт:</span>
              <UBadge
                :color="aiResult.judgeVerdict === 'PASS' ? 'success' : 'error'"
                variant="solid"
                class="font-bold">
                {{ aiResult.judgeVerdict }}
              </UBadge>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <UTabs
              :items="[
                { slot: 'preview', label: 'Предпросмотр' },
                { slot: 'edit', label: 'Редактирование' },
              ]"
              color="neutral"
              variant="link">
              <template #preview>
                <div class="info-block pt-2">
                  <div
                    class="description max-w-none space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4"
                    v-html="aiResult.generatedCharacteristics" />
                </div>
              </template>
              <template #edit>
                <div class="pt-2">
                  <UTextarea
                    v-model="aiResult.generatedCharacteristics"
                    class="w-full font-mono"
                    :rows="20"
                    placeholder="HTML content..." />
                </div>
              </template>
            </UTabs>
          </div>

          <div class="flex items-center justify-between border-t border-gray-100 pt-4">
            <UButton
              icon="i-lucide-rotate-ccw"
              label="Сбросить и сгенерировать заново"
              variant="ghost"
              color="neutral"
              @click="resetAndRegenerate" />
            <div class="flex items-center gap-3">
              <UBadge
                v-if="isSaved"
                color="success"
                variant="solid">
                Сохранено
              </UBadge>
              <UButton
                icon="i-lucide-save"
                label="Сохранить"
                variant="solid"
                color="success"
                @click="handleSave" />
            </div>
          </div>
        </section>

        <!-- Sources / Document Extractions Section -->
        <section
          v-if="aiResult.usedFallback || aiResult.documentExtractions?.length"
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-lg font-semibold">
              <UIcon name="i-lucide-book-open" />
              Источники данных
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
              Официальные документы ({{ aiResult.documentExtractions?.length || 0 }})
            </UBadge>
          </div>

          <!-- Fallback Research Content -->
          <div
            v-if="aiResult.usedFallback && aiResult.fallbackResearch"
            class="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-2 text-sm text-amber-900">
            <strong class="font-semibold">Синтезированное исследование (Tavily):</strong>
            <p class="whitespace-pre-wrap font-mono text-xs">{{ aiResult.fallbackResearch.technicalSummary }}</p>
          </div>

          <!-- Document Extractions List -->
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
                <div class="space-y-2 p-4 text-sm">
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span>Тип: {{ item.doc.docType === 'stnd' ? 'ГОСТ/Стандарт' : 'ГРСИ (Реестр)' }}</span>
                    <span>•</span>
                    <span>Товаров соотнесено: {{ item.doc.productsCount }}</span>
                    <span v-if="item.doc.fileLink">•</span>
                    <a
                      v-if="item.doc.fileLink"
                      :href="item.doc.fileLink"
                      target="_blank"
                      class="text-primary-600 underline"
                      >Открыть документ</a
                    >
                  </div>
                  <pre class="max-w-none overflow-auto rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs whitespace-pre-wrap">{{ item.doc.extractedMarkdown }}</pre>
                </div>
              </template>
            </UAccordion>
          </div>
        </section>

        <!-- Last Critique -->
        <section
          v-if="aiResult.failedAttempts?.length"
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-message-square-warning" />
            Последняя критика
          </h2>
          <div
            v-if="aiResult.failedAttempts.length >= 2 && aiResult.failedAttempts[aiResult.failedAttempts.length - 2]?.editorContent"
            class="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
            {{ aiResult.failedAttempts[aiResult.failedAttempts.length - 2].editorContent }}
          </div>

          <div
            v-if="aiResult.failedAttempts.length >= 1 && aiResult.failedAttempts[aiResult.failedAttempts.length - 1]?.requiredCorrections?.length"
            class="rounded border border-red-200 bg-red-50 p-3">
            <ul class="mt-1 ml-4 list-disc text-sm text-red-800">
              <li
                v-for="correction in aiResult.failedAttempts[aiResult.failedAttempts.length - 1].requiredCorrections"
                :key="correction">
                {{ correction }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Failed Attempts -->
        <section
          v-if="aiResult.failedAttempts?.length"
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-history" />
            Неудачные попытки
          </h2>
          <UAccordion
            type="multiple"
            :items="
              aiResult.failedAttempts.map((attempt, index) => ({
                label: `Попытка №${index + 1}`,
                attempt,
              }))
            ">
            <template #content="{ item }">
              <div class="space-y-4 p-4">
                <div class="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
                  <strong>Текст:</strong>
                  <div
                    class="mt-1 max-w-none"
                    v-html="item.attempt.generatedCharacteristics"></div>
                </div>
                <div
                  v-if="item.attempt.critique"
                  class="rounded border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Критика:</strong>
                  <div class="mt-1 whitespace-pre-wrap">{{ typeof item.attempt.critique === 'string' ? item.attempt.critique : JSON.stringify(item.attempt.critique, null, 2) }}</div>
                </div>
                <div
                  v-if="item.attempt.requiredCorrections?.length"
                  class="rounded border border-red-100 bg-red-50 p-3 text-sm text-red-800">
                  <strong>Требуемые исправления:</strong>
                  <ul class="mt-1 ml-4 list-disc">
                    <li
                      v-for="correction in item.attempt.requiredCorrections"
                      :key="correction">
                      {{ correction }}
                    </li>
                  </ul>
                </div>
                <div
                  v-if="item.attempt.editorContent"
                  class="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                  <strong>Комментарий редактора:</strong>
                  <div class="mt-1 whitespace-pre-wrap">{{ item.attempt.editorContent }}</div>
                </div>
              </div>
            </template>
          </UAccordion>
        </section>

        <!-- Revision Section -->
        <section class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-rotate-ccw" />
            Запрос на доработку
          </h2>
          <p class="text-sm text-gray-600">Опишите, что нужно изменить в характеристиках, чтобы AI перегенерировал их.</p>
          <UTextarea
            v-model="revisionText"
            class="w-full"
            placeholder="Например: уточните пределы погрешности для микрометров или добавите сноску на ГОСТ 6507-90..."
            :rows="4" />
          <div class="flex justify-end">
            <UButton
              icon="i-lucide-send"
              label="Отправить на доработку"
              variant="solid"
              color="neutral"
              @click="handleRevision" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
