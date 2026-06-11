<script setup>
import { h, resolveComponent } from 'vue'
//
const UButton = resolveComponent('UButton')

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const globalFilter = ref('')

const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)

function getHeader(column, label) {
  const isSorted = column.getIsSorted()
  return h('div', { class: 'flex items-center gap-1 justify-start' }, [
    h(UButton, {
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      size: 'xs',
      class: 'p-0',
      color: 'neutral',
      variant: 'ghost',
      onClick: () => column.toggleSorting(),
    }),
    h('div', label),
  ])
}

const columns = [
  {
    accessorKey: 'ean',
    header: ({ column }) => getHeader(column, 'EAN'),
    label: 'EAN',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Наименование'),
    label: 'Наименование',
  },
]
</script>

<template>
  <div class="flex h-full flex-col gap-1">
    <div class="flex items-center gap-4">
      <UInput
        v-model="globalFilter"
        placeholder="Filter brands..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />

      <div
        v-if="items.length"
        class="text-sm text-gray-600">
        Всего: {{ items.length }}
        <span v-if="globalFilter.length">, отфильтровано: {{ countFilteredRows }}</span>
      </div>
    </div>

    <div class="min-h-0 w-full grow">
      <UTable
        ref="table"
        sticky
        virtualize
        v-model:global-filter="globalFilter"
        :data="items"
        :columns="columns"
        :ui="{
          tr: 'bg-gray-100/95 hover:bg-gray-200/95',
          th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
          td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
        }"
        class="h-full w-full" />
    </div>
  </div>
</template>
