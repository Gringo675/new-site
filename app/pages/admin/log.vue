<script setup>
//
import { h } from 'vue'
const table = useTemplateRef('table')

const logs = ref([])
const updateLog = async () => {
  logs.value = await myFetch('/api/admin/log/getLog')
}
const clearLog = async () => {
  const proceed = await showMessage({
    title: `Clear all logs?`,
    description: 'Are you sure you want to proceed? This operation cannot be undone.',
    type: 'info',
    isDialog: true,
  })
  if (!proceed) return

  const response = await myFetch('/api/admin/log/clearLog')
  if (response.success) logs.value = []
}
await updateLog()

const columns = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'text-center',
        td: 'align-top w-12',
      },
    },
  },
  {
    accessorKey: 'created',
    cell: ({ row }) => {
      return new Date(row.getValue('created')).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
    meta: {
      class: {
        th: 'text-center',
        td: 'align-top w-30',
      },
    },
  },
  {
    accessorKey: 'error',
    header: 'status',
    filterFn: 'equals',
    cell: ({ row }) => {
      return h('div', {
        class: `w-3 h-3 rounded-full ${row.getValue('error') ? 'bg-red-500' : 'bg-green-500'}`,
      })
    },
    meta: {
      class: {
        th: 'w-20',
        td: 'flex justify-center items-center',
      },
    },
  },
  {
    accessorKey: 'text',
    filterFn: 'includesString',

    cell: ({ row }) => {
      const text = row.getValue('text')
      try {
        const parsed = JSON.parse(text)
        return h('pre', { class: 'text-xs whitespace-pre-wrap' }, JSON.stringify(parsed, null, 2))
      } catch (e) {
        return text
      }
    },
    meta: {
      class: {
        th: 'text-center',
        td: 'align-top whitespace-normal',
      },
    },
  },
]

const selected = ref(null)
const selectItems = [
  { label: 'Show all', value: null },
  { label: 'Errors', value: 1 },
  { label: 'Infos', value: 0 },
]
watch(selected, newVal => {
  table.value.tableApi.getColumn('error').setFilterValue(newVal)
})

const countLogs = computed(() => logs.value.length)
const countFilteredLog = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)
</script>

<template>
  <header class="mb-8">
    <div class="flex justify-between border-b border-gray-300 pb-2">
      <h1 class="font-accent text-3xl">
        Лог
        <span class="px-2 text-base text-gray-500"
          >(Всего: {{ countLogs }}
          <template v-if="countLogs !== countFilteredLog">, отфильтровано: {{ countFilteredLog }}</template> )
        </span>
      </h1>

      <div class="flex gap-4">
        <UInput
          :model-value="table?.tableApi?.getColumn('text')?.getFilterValue()"
          class="w-50"
          placeholder="Filter by text..."
          @update:model-value="table?.tableApi?.getColumn('text')?.setFilterValue($event)">
          <template
            v-if="table?.tableApi?.getColumn('text')?.getFilterValue()"
            #trailing>
            <UButton
              color="neutral"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="p-0"
              @click="table?.tableApi?.getColumn('text')?.setFilterValue('')" />
          </template>
        </UInput>
        <USelect
          v-model="selected"
          :items="selectItems"
          class="w-25" />
        <UButton
          label="Refresh"
          @click="updateLog" />
        <UButton
          label="Clear all"
          @click="clearLog" />
      </div>
    </div>
  </header>
  <div class="w-full">
    <UTable
      ref="table"
      :data="logs"
      :columns="columns"
      class="flex-1" />
  </div>
</template>
