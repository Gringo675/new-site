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
          baseUrl: 'http://localhost:4111',
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

async function generateDescription() {
  if (!activeCatAlias.value) return

  aiResult.value = await connectionHandler({
    workflowId: 'category-description',
    inputData: {
      alias: activeCatAlias.value,
    },
    // runId: 'edd6f830-3bd8-43ff-b35d-dbf2be0ac2f1',
  })
}

watch(activeCatAlias, () => {
  isSaved.value = false
  generateDescription()
})

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
    workflowId: 'category-revision',
    inputData: {
      originalData: aiResult.value.originalData,
      research: aiResult.value.research,
      generatedDescription: aiResult.value.generatedDescription,
      revisionText: revisionText.value,
    },
    // runId: '49e90651-ed31-41e9-a3b3-36f3cbcf6e70',
  })
  console.log(`response: ${JSON.stringify(response, null, 2)}`)
  if (response) {
    aiResult.value.judgeVerdict = response.judgeEvaluation.verdict

    if (aiResult.value.failedAttempts.length) {
      aiResult.value.failedAttempts[aiResult.value.failedAttempts.length - 1].editorContent = revisionText.value
    } else {
      aiResult.value.failedAttempts.push({
        generatedDescription: aiResult.value.generatedDescription,
        editorContent: revisionText.value,
      })
    }

    aiResult.value.failedAttempts.push({
      generatedDescription: response.finalDescription,
      critique: response.judgeEvaluation.critique,
      requiredCorrections: response.judgeEvaluation.requiredCorrections,
    })

    aiResult.value.generatedDescription = response.finalDescription
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
        description: aiResult.value.generatedDescription,
      },
    }

    const response = await myFetch('/api/admin/setCategories', {
      method: 'POST',
      payload: payload,
    })

    if (response && response.status === 'ok') {
      isSaved.value = true
      await showNotice({
        title: 'Описание успешно сохранено!',
        type: 'success',
      })
    } else {
      throw new Error(response?.message || 'Ошибка при сохранении')
    }
  } catch (e) {
    await showMessage({
      title: 'Ошибка!',
      description: e.message || 'Не удалось сохранить описание.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">AI Описание Категорий</h1>
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
      <!-- Original Description -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-file-text" />
            Исходное описание
          </h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Raw HTML</span>
            <USwitch v-model="showRawOriginal" />
          </div>
        </div>
        <div class="info-block">
          <div
            v-if="!showRawOriginal"
            class="description max-w-none space-y-2 rounded-lg border border-gray-200 bg-white p-4"
            v-html="aiResult.originalData?.description" />
          <pre
            v-else
            class="max-w-none overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap"
            >{{ aiResult.originalData?.description }}</pre
          >
        </div>
      </section>

      <!-- Generated Description -->
      <section class="space-y-3">
        <h2 class="flex items-center gap-2 text-lg font-semibold">
          <UIcon name="i-lucide-sparkles" />
          Сгенерированное описание
        </h2>

        <div class="grid grid-cols-1 gap-4">
          <UTabs
            :items="[
              { slot: 'preview', label: 'Предпросмотр' },
              { slot: 'edit', label: 'Редактирование' },
            ]"
            color="primary">
            <template #preview>
              <div class="info-block">
                <div
                  class="description max-w-none space-y-2 rounded-lg border border-gray-200 bg-white p-4"
                  v-html="aiResult.generatedDescription" />
              </div>
            </template>
            <template #edit>
              <UTextarea
                v-model="aiResult.generatedDescription"
                class="w-full font-mono"
                :rows="20"
                placeholder="HTML content..." />
            </template>
          </UTabs>
        </div>

        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium">Вердикт:</span>
            <UBadge
              :color="aiResult.judgeVerdict === 'PASS' ? 'success' : 'error'"
              variant="solid"
              class="font-bold">
              {{ aiResult.judgeVerdict }}
            </UBadge>
          </div>
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
              variant="outline"
              color="success"
              @click="handleSave" />
          </div>
        </div>
      </section>

      <!--Last critique-->
      <section
        v-if="aiResult.failedAttempts?.length"
        class="space-y-3">
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
          <ul class="mt-1 ml-4 list-disc">
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
        class="space-y-3">
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
                  v-html="item.attempt.generatedDescription"></div>
              </div>
              <div class="rounded border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Критика:</strong>
                <div class="mt-1 whitespace-pre-wrap">{{ item.attempt.critique }}</div>
              </div>
              <div
                v-if="item.attempt.requiredCorrections.length"
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
      <section class="mt-12 space-y-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
        <h2 class="flex items-center gap-2 text-lg font-semibold">
          <UIcon name="i-lucide-rotate-ccw" />
          Запрос на доработку
        </h2>
        <p class="text-sm text-gray-600">Опишите, что нужно изменить в описании, чтобы AI перегенерировал его.</p>
        <UTextarea
          v-model="revisionText"
          class="w-full"
          placeholder="Например: добавьте больше внимания к ГОСТ 6507-90 или сделайте текст более техническим..."
          :rows="4" />
        <div class="flex justify-end">
          <UButton
            icon="i-lucide-send"
            label="Отправить на доработку"
            variant="outline"
            @click="handleRevision" />
        </div>
      </section>
    </div>
  </div>
</template>
