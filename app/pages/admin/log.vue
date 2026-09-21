<script setup>
useTitle('Логи | AdminPanel')

const logs = ref([])
const isLoading = ref(false)

const updateLog = async () => {
  isLoading.value = true
  try {
    const data = await myFetch('/api/admin/log/getLog')
    logs.value = Array.isArray(data) ? data : []
  } catch (e) {
    showNotice({
      title: 'Ошибка загрузки логов',
      description: e.message,
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const clearLog = async () => {
  const proceed = await showMessage({
    title: 'Очистить все логи?',
    description: 'Вы уверены, что хотите безвозвратно удалить все записи логов? Данную операцию нельзя отменить.',
    type: 'info',
    isDialog: true,
  })
  if (!proceed) return

  try {
    const response = await myFetch('/api/admin/log/clearLog')
    if (response?.success) {
      logs.value = []
      showNotice({
        title: 'Логи очищены',
        description: 'Все записи успешно удалены из базы данных',
        type: 'success',
      })
    }
  } catch (e) {
    showNotice({
      title: 'Ошибка очистки',
      description: e.message,
      type: 'error',
    })
  }
}

// Initial load
await updateLog()

// Process and normalize incoming logs
const processedLogs = computed(() => {
  return logs.value.map(log => {
    let parsed = null
    let isJson = false

    if (log.text && typeof log.text === 'string') {
      try {
        parsed = JSON.parse(log.text)
        isJson = true
      } catch {
        parsed = null
      }
    } else if (typeof log.text === 'object' && log.text !== null) {
      parsed = log.text
      isJson = true
    }

    const isError = Number(log.error) === 1
    const statusCode = parsed?.statusCode || (isError && !parsed ? 500 : null)
    const statusMessage = parsed?.statusMessage || (!isError && !parsed ? log.text : '')
    const url = parsed?.url || null
    const onServer = parsed?.onServer
    const isBot = Boolean(parsed?.isBot)
    const isChunkError = Boolean(parsed?.isChunkError)
    const isSuppressed = Boolean(parsed?.isSuppressed)
    const stack = parsed?.stack && parsed.stack !== 'No stack' ? parsed.stack : null
    const userAgent = parsed?.userAgent || null
    const build = parsed?.build || null

    let summaryText = ''
    if (statusMessage) {
      summaryText = statusMessage
    } else if (parsed) {
      summaryText = JSON.stringify(parsed)
    } else {
      summaryText = log.text || ''
    }

    return {
      id: log.id,
      created: log.created,
      error: log.error,
      rawText: typeof log.text === 'string' ? log.text : JSON.stringify(log.text),
      isError,
      isJson,
      parsed,
      statusCode,
      statusMessage,
      url,
      onServer,
      source: onServer === true ? 'Server' : onServer === false ? 'Client' : null,
      isBot,
      isChunkError,
      isSuppressed,
      stack,
      userAgent,
      build,
      summaryText,
    }
  })
})

// Filters
const searchQuery = ref('')
const filterType = ref('all')
const filterSource = ref('all')
const filterBot = ref('all')
const filterChunkError = ref('all')
const filterSuppressed = ref('all')

const typeOptions = [
  { label: 'Все типы', value: 'all' },
  { label: 'errors', value: 'error' },
  { label: 'infos', value: 'info' },
]

const sourceOptions = [
  { label: 'Все источники', value: 'all' },
  { label: 'server', value: 'server' },
  { label: 'client', value: 'client' },
]

const botOptions = [
  { label: 'Все субъекты', value: 'all' },
  { label: 'humans', value: 'exclude' },
  { label: 'bots', value: 'only' },
]

const chunkErrorOptions = [
  { label: 'Все загрузки', value: 'all' },
  { label: 'успешные', value: 'exclude' },
  { label: 'chunk errors', value: 'only' },
]

const suppressedOptions = [
  { label: 'Все состояния', value: 'all' },
  { label: 'unsuppressed', value: 'exclude' },
  { label: 'suppressed', value: 'only' },
]

const isErrorFiltersDisabled = computed(() => filterType.value === 'info')
const hasActiveErrorFilters = computed(() => {
  return (
    filterSource.value !== 'all' ||
    filterBot.value !== 'all' ||
    filterChunkError.value !== 'all' ||
    filterSuppressed.value !== 'all'
  )
})

// Auto-switch to 'error' when any error-specific filter is selected
watch(hasActiveErrorFilters, active => {
  if (active) {
    filterType.value = 'error'
  }
})

// Reset error-specific filters when switched to 'info'
watch(filterType, type => {
  if (type === 'info') {
    filterSource.value = 'all'
    filterBot.value = 'all'
    filterChunkError.value = 'all'
    filterSuppressed.value = 'all'
  }
})

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    filterType.value !== 'all' ||
    hasActiveErrorFilters.value
  )
})

const resetFilters = () => {
  searchQuery.value = ''
  filterSource.value = 'all'
  filterBot.value = 'all'
  filterChunkError.value = 'all'
  filterSuppressed.value = 'all'
  filterType.value = 'all'
  page.value = 1
}

// Filtered logs computation
const filteredLogs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return processedLogs.value.filter(log => {
    // Type filter
    if (filterType.value === 'error' && !log.isError) return false
    if (filterType.value === 'info' && log.isError) return false

    // Source filter
    if (filterSource.value === 'server' && log.onServer !== true) return false
    if (filterSource.value === 'client' && log.onServer !== false) return false

    // Bot filter (3-state)
    if (filterBot.value === 'only' && !log.isBot) return false
    if (filterBot.value === 'exclude' && log.isBot) return false

    // Chunk error filter (3-state)
    if (filterChunkError.value === 'only' && !log.isChunkError) return false
    if (filterChunkError.value === 'exclude' && log.isChunkError) return false

    // Suppressed filter (3-state)
    if (filterSuppressed.value === 'only' && !log.isSuppressed) return false
    if (filterSuppressed.value === 'exclude' && log.isSuppressed) return false

    // Search query
    if (query) {
      const matchId = String(log.id).includes(query)
      const matchUrl = log.url ? log.url.toLowerCase().includes(query) : false
      const matchStatus = log.statusCode ? String(log.statusCode).includes(query) : false
      const matchMsg = log.statusMessage ? log.statusMessage.toLowerCase().includes(query) : false
      const matchText = log.summaryText ? log.summaryText.toLowerCase().includes(query) : false
      const matchUserAgent = log.userAgent ? log.userAgent.toLowerCase().includes(query) : false
      const matchStack = log.stack ? log.stack.toLowerCase().includes(query) : false

      if (!matchId && !matchUrl && !matchStatus && !matchMsg && !matchText && !matchUserAgent && !matchStack) {
        return false
      }
    }

    return true
  })
})

// Pagination
const page = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [
  { label: '20 строк', value: 20 },
  { label: '50 строк', value: 50 },
  { label: '100 строк', value: 100 },
]

watch(
  [searchQuery, filterType, filterSource, filterBot, filterChunkError, filterSuppressed, pageSize],
  () => {
    page.value = 1
  }
)

const totalLogs = computed(() => logs.value.length)
const totalFiltered = computed(() => filteredLogs.value.length)

const paginatedLogs = computed(() => {
  const size = Number(pageSize.value) || 20
  const start = (page.value - 1) * size
  return filteredLogs.value.slice(start, start + size)
})

const pageRangeText = computed(() => {
  if (totalFiltered.value === 0) return '0 из 0'
  const size = Number(pageSize.value) || 20
  const start = (page.value - 1) * size + 1
  const end = Math.min(page.value * size, totalFiltered.value)
  return `${start}–${end} из ${totalFiltered.value}`
})

// Date formatter
const formatDate = isoString => {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return isoString
  }
}

// Table columns
const columns = [
  {
    id: 'created',
    accessorKey: 'created',
    header: 'Время',
    meta: {
      class: {
        th: 'w-32 text-center',
        td: 'w-32 text-center text-xs whitespace-nowrap text-gray-600 dark:text-gray-400 align-top py-2.5',
      },
    },
  },
  {
    id: 'info',
    header: 'Info',
    meta: {
      class: {
        th: 'w-80 min-w-72',
        td: 'w-80 min-w-72 max-w-sm align-top py-2.5',
      },
    },
  },
  {
    id: 'summaryText',
    accessorKey: 'summaryText',
    header: 'Данные',
    meta: {
      class: {
        th: 'text-left',
        td: 'align-top py-2.5',
      },
    },
  },
]

// Slideover Details
const isSlideoverOpen = ref(false)
const selectedLog = ref(null)

const openDetails = log => {
  if (!log) return
  selectedLog.value = log
  isSlideoverOpen.value = true
}

const copyToClipboard = async (text, label = 'Данные') => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    showNotice({
      title: `${label} скопированы`,
      description: 'Значение успешно помещено в буфер обмена',
      type: 'success',
    })
  } catch (e) {
    showNotice({
      title: 'Не удалось скопировать',
      description: e.message || 'Ошибка доступа к буферу обмена',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <!-- Header with Title and Global Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3 dark:border-gray-800">
      <div class="flex items-baseline gap-3">
        <h1 class="font-accent text-3xl font-bold text-gray-900 dark:text-gray-100">
          Логи
        </h1>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Всего: <strong class="text-gray-700 dark:text-gray-200">{{ totalLogs }}</strong>
          <template v-if="totalLogs !== totalFiltered">
            , отфильтровано: <strong class="text-primary">{{ totalFiltered }}</strong>
          </template>
        </span>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          label="Обновить"
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="isLoading"
          @click="updateLog" />
        <UButton
          label="Очистить все"
          icon="i-lucide-trash-2"
          color="error"
          variant="subtle"
          size="sm"
          @click="clearLog" />
      </div>
    </div>

    <!-- Adaptive Filter Toolbar -->
    <div class="flex flex-wrap items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <!-- Search Input -->
      <UInput
        v-model="searchQuery"
        placeholder="Поиск по тексту, URL, коду..."
        icon="i-lucide-search"
        size="sm"
        class="min-w-56 grow sm:grow-0">
        <template
          v-if="searchQuery"
          #trailing>
          <UButton
            color="neutral"
            variant="link"
            icon="i-lucide-x"
            size="xs"
            class="p-0"
            @click="searchQuery = ''" />
        </template>
      </UInput>

      <!-- Type Select -->
      <USelect
        v-model="filterType"
        :items="typeOptions"
        :disabled="hasActiveErrorFilters"
        :title="hasActiveErrorFilters ? 'Заблокировано на errors, пока активны фильтры ошибок' : ''"
        size="sm"
        class="w-36" />

      <!-- Source Select -->
      <USelect
        v-model="filterSource"
        :items="sourceOptions"
        :disabled="isErrorFiltersDisabled"
        :title="isErrorFiltersDisabled ? 'Недоступно для записей типа info' : ''"
        size="sm"
        class="w-40" />

      <!-- Bot Select -->
      <USelect
        v-model="filterBot"
        :items="botOptions"
        :disabled="isErrorFiltersDisabled"
        :title="isErrorFiltersDisabled ? 'Недоступно для записей типа info' : ''"
        size="sm"
        class="w-36" />

      <!-- Chunk Error Select -->
      <USelect
        v-model="filterChunkError"
        :items="chunkErrorOptions"
        :disabled="isErrorFiltersDisabled"
        :title="isErrorFiltersDisabled ? 'Недоступно для записей типа info' : ''"
        size="sm"
        class="w-40" />

      <!-- Suppressed Select -->
      <USelect
        v-model="filterSuppressed"
        :items="suppressedOptions"
        :disabled="isErrorFiltersDisabled"
        :title="isErrorFiltersDisabled ? 'Недоступно для записей типа info' : ''"
        size="sm"
        class="w-44" />

      <!-- Reset Filters Button -->
      <UButton
        v-if="hasActiveFilters"
        icon="i-lucide-rotate-ccw"
        color="neutral"
        variant="ghost"
        size="sm"
        label="Сбросить"
        class="ml-auto"
        @click="resetFilters" />
    </div>

    <!-- Table Container -->
    <div class="flex min-h-0 grow flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <UTable
        :data="paginatedLogs"
        :columns="columns"
        :loading="isLoading"
        :meta="{
          class: {
            tr: () => 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors',
          },
        }"
        class="w-full grow overflow-auto"
        @select="(e, row) => openDetails(row.original)">
        <!-- Created Cell -->
        <template #created-cell="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">
            {{ formatDate(row.original.created) }}
          </span>
        </template>

        <!-- Info Cell: 2 lines (Top: statuses & error code, Bottom: URL) -->
        <template #info-cell="{ row }">
          <div class="flex flex-col gap-1 min-w-0">
            <!-- Top line: Statuses & Code -->
            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Error Code (replaces 'Error' badge) -->
              <UBadge
                v-if="row.original.statusCode"
                :color="row.original.statusCode >= 500 ? 'error' : row.original.statusCode >= 400 ? 'warning' : 'neutral'"
                variant="subtle"
                size="xs"
                class="shrink-0 font-mono font-bold">
                {{ row.original.statusCode }}
              </UBadge>
              <UBadge
                v-else-if="!row.original.isError"
                color="success"
                variant="subtle"
                size="xs"
                label="Info" />

              <!-- Environment: Server or Client -->
              <UBadge
                v-if="row.original.source === 'Server'"
                color="info"
                variant="outline"
                size="xs"
                label="Server" />
              <UBadge
                v-else-if="row.original.source === 'Client'"
                color="neutral"
                variant="outline"
                size="xs"
                label="Client" />

              <!-- Subject: bot or human (only for errors) -->
              <template v-if="row.original.isError">
                <UBadge
                  v-if="row.original.isBot"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  icon="i-lucide-bot"
                  label="bot" />
                <UBadge
                  v-else
                  color="neutral"
                  variant="outline"
                  size="xs"
                  icon="i-lucide-user"
                  label="human" />
              </template>

              <!-- Chunk Error Badge -->
              <UBadge
                v-if="row.original.isChunkError"
                color="warning"
                variant="solid"
                size="xs"
                icon="i-lucide-zap"
                label="chunkError" />

              <!-- Suppressed Badge -->
              <UBadge
                v-if="row.original.isSuppressed"
                color="neutral"
                variant="subtle"
                size="xs"
                icon="i-lucide-volume-x"
                label="Suppressed" />
            </div>

            <!-- Bottom line: URL -->
            <div
              v-if="row.original.url"
              class="flex max-w-full self-start min-w-0">
              <NuxtLink
                :to="row.original.url"
                target="_blank"
                class="truncate font-mono text-xs text-primary underline underline-offset-2 hover:opacity-80"
                :title="row.original.url"
                @click.stop>
                {{ row.original.url }}
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- Summary Message Cell (Данные) -->
        <template #summaryText-cell="{ row }">
          <div
            class="line-clamp-2 text-xs font-mono text-gray-800 dark:text-gray-200"
            :title="row.original.summaryText">
            {{ row.original.summaryText }}
          </div>
        </template>

        <!-- Empty State -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-lucide-inbox"
              class="mb-2 size-10 opacity-40" />
            <p class="text-sm font-medium">
              Записей логов не найдено
            </p>
            <p
              v-if="hasActiveFilters"
              class="mt-1 text-xs text-gray-400">
              Попробуйте сбросить фильтры или изменить поисковый запрос
            </p>
            <UButton
              v-if="hasActiveFilters"
              label="Сбросить фильтры"
              variant="link"
              color="primary"
              size="xs"
              class="mt-2"
              @click="resetFilters" />
          </div>
        </template>
      </UTable>

      <!-- Pagination & Range Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Показано <span class="font-semibold text-gray-700 dark:text-gray-200">{{ pageRangeText }}</span>
          <span v-if="totalFiltered !== totalLogs"> (из {{ totalLogs }} записей)</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-gray-500 dark:text-gray-400">На странице:</span>
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

    <!-- Details Slideover Drawer -->
    <USlideover
      v-model:open="isSlideoverOpen"
      :title="selectedLog ? `Лог #${selectedLog.id}` : ''"
      :description="selectedLog ? formatDate(selectedLog.created) : ''"
      :ui="{ content: 'max-w-2xl sm:max-w-3xl' }">
      <template #body>
        <div
          v-if="selectedLog"
          class="flex flex-col gap-6 text-sm">
          <!-- Status & Badges Group -->
          <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <!-- Error Code or Info Badge -->
            <UBadge
              v-if="selectedLog.statusCode"
              :color="selectedLog.statusCode >= 500 ? 'error' : selectedLog.statusCode >= 400 ? 'warning' : 'neutral'"
              variant="subtle"
              size="md"
              class="font-mono font-bold">
              HTTP {{ selectedLog.statusCode }}
            </UBadge>
            <UBadge
              v-else-if="!selectedLog.isError"
              color="success"
              variant="subtle"
              size="md"
              label="Инфо" />

            <!-- Environment: Server or Client -->
            <UBadge
              v-if="selectedLog.source === 'Server'"
              color="info"
              variant="outline"
              size="md"
              label="Server" />
            <UBadge
              v-else-if="selectedLog.source === 'Client'"
              color="neutral"
              variant="outline"
              size="md"
              label="Client" />

            <!-- Subject: bot or human (only for errors) -->
            <template v-if="selectedLog.isError">
              <UBadge
                v-if="selectedLog.isBot"
                color="warning"
                variant="subtle"
                size="md"
                icon="i-lucide-bot"
                label="bot" />
              <UBadge
                v-else
                color="neutral"
                variant="outline"
                size="md"
                icon="i-lucide-user"
                label="human" />
            </template>

            <!-- Chunk Error Badge -->
            <UBadge
              v-if="selectedLog.isChunkError"
              color="warning"
              variant="solid"
              size="md"
              icon="i-lucide-zap"
              label="chunkError" />

            <!-- Suppressed Badge -->
            <UBadge
              v-if="selectedLog.isSuppressed"
              color="neutral"
              variant="subtle"
              size="md"
              icon="i-lucide-volume-x"
              label="Suppressed" />
          </div>

          <!-- Structured Metadata Grid -->
          <div class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900/50">
            <div
              v-if="selectedLog.url"
              class="col-span-full">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                URL:
              </div>
              <div class="mt-1 flex items-center gap-2">
                <a
                  :href="selectedLog.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="break-all font-mono text-xs text-primary underline underline-offset-2 hover:opacity-80">
                  {{ selectedLog.url }}
                </a>
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3.5 shrink-0 text-gray-400" />
              </div>
            </div>

            <div
              v-if="selectedLog.statusMessage"
              class="col-span-full">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Сообщение:
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-900 dark:text-gray-100">
                {{ selectedLog.statusMessage }}
              </div>
            </div>

            <div v-if="selectedLog.build">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Сборка (Build):
              </div>
              <div class="mt-1 font-mono text-xs text-gray-800 dark:text-gray-200">
                {{ selectedLog.build }}
              </div>
            </div>

            <div>
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Время записи:
              </div>
              <div class="mt-1 text-xs text-gray-800 dark:text-gray-200">
                {{ formatDate(selectedLog.created) }}
              </div>
            </div>

            <div
              v-if="selectedLog.userAgent"
              class="col-span-full">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                User-Agent:
              </div>
              <div class="mt-1 break-all font-mono text-xs text-gray-600 dark:text-gray-300">
                {{ selectedLog.userAgent }}
              </div>
            </div>
          </div>

          <!-- Stack Trace Section -->
          <div
            v-if="selectedLog.stack"
            class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-900 dark:text-gray-100">
                Стек вызовов (Stack Trace):
              </span>
              <UButton
                icon="i-lucide-copy"
                size="xs"
                color="neutral"
                variant="ghost"
                label="Копировать стек"
                @click="copyToClipboard(selectedLog.stack, 'Стек ошибки')" />
            </div>
            <pre class="max-h-64 overflow-x-auto rounded-lg border border-gray-200 bg-gray-950 p-3 font-mono text-xs text-red-300 dark:border-gray-800">{{ selectedLog.stack }}</pre>
          </div>

          <!-- Raw Data / JSON Section -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {{ selectedLog.isJson ? 'Сырые данные (JSON):' : 'Исходный текст:' }}
              </span>
              <UButton
                icon="i-lucide-copy"
                size="xs"
                color="neutral"
                variant="ghost"
                :label="selectedLog.isJson ? 'Копировать JSON' : 'Копировать текст'"
                @click="copyToClipboard(selectedLog.isJson ? JSON.stringify(selectedLog.parsed, null, 2) : selectedLog.rawText, selectedLog.isJson ? 'JSON' : 'Текст')" />
            </div>
            <pre class="max-h-72 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-3 font-mono text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">{{ selectedLog.isJson ? JSON.stringify(selectedLog.parsed, null, 2) : selectedLog.rawText }}</pre>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
