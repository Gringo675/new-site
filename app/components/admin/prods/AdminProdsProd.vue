<script setup>
//
import { h, resolveComponent } from 'vue'
const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)
const columnPinning = ref({ left: ['select'], right: [] })
const activeCatId = ref(null)
const rowSelection = shallowRef({})
const globalFilter = ref('')
const prods = ref([])
const cats = shallowRef([])

const { prps, editPrps } = useProperties()

onMounted(async () => {
  cats.value = await myFetch('/api/admin/cms/getMainCats')
})

const prpsGroupsMap = computed(() => usePrpsGroupsMap(activeCatId.value))

watch(activeCatId, updateProds)

function getHeader(column, label) {
  const isSorted = column.getIsSorted()
  return h('div', { class: 'flex items-center gap-1 justify-start' }, [
    h('div', { class: 'flex flex-col' }, [
      h(UButton, {
        icon: column.getIsPinned() ? 'i-lucide-pin-off' : 'i-lucide-pin',
        size: 'xs',
        class: 'p-0',
        color: 'neutral',
        variant: 'ghost',
        onClick: e => {
          e.stopPropagation()
          const newPin = column.getIsPinned() === 'left' ? false : 'left'
          column.pin(newPin)
        },
      }),
      h(UButton, {
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        size: 'xs',
        class: 'p-0',
        color: 'neutral',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }),
    ]),

    h('div', label),
  ])
}
const columns = computed(() => [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': value => row.toggleSelected(!!value),
        'aria-label': 'Select row',
      }),
    enableGlobalFilter: false,
    enableHiding: false,
    enableColumnPinning: true,
    size: 32,
    meta: {
      class: {
        th: 'w-[32px] min-w-[32px] max-w-[32px]',
        td: 'w-[32px] min-w-[32px] max-w-[32px]',
      },
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'Код'),
    label: 'Код',
    enableColumnPinning: true,
    size: 70,
    meta: {
      class: {
        th: 'w-[70px] min-w-[70px] max-w-[70px]',
        td: 'w-[70px] min-w-[70px] max-w-[70px]',
      },
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Наименование'),
    label: 'Наименование',
    enableColumnPinning: true,
    size: 250,
    meta: {
      class: {
        th: 'w-[250px] min-w-[250px] max-w-[250px]',
        td: 'w-[250px] min-w-[250px] max-w-[250px]',
      },
    },
  },
  {
    accessorKey: 'alias',
    header: ({ column }) => getHeader(column, 'Алиас'),
    label: 'Алиас',
    enableColumnPinning: true,
    size: 150,
    meta: {
      class: {
        th: 'w-[150px] min-w-[150px] max-w-[150px]',
        td: 'w-[150px] min-w-[150px] max-w-[150px]',
      },
    },
  },
  {
    accessorKey: 'brand_eans',
    header: ({ column }) => getHeader(column, 'Brand EANs'),
    label: 'Brand EANs',
    enableColumnPinning: true,
    size: 150,
    meta: {
      class: {
        th: 'w-[150px] min-w-[150px] max-w-[150px]',
        td: 'w-[150px] min-w-[150px] max-w-[150px]',
      },
    },
  },
  {
    accessorKey: 'images',
    header: ({ column }) => getHeader(column, 'Images'),
    label: 'Images',
    enableColumnPinning: true,
    size: 150,
    meta: {
      class: {
        th: 'w-[150px] min-w-[150px] max-w-[150px]',
        td: 'w-[150px] min-w-[150px] max-w-[150px]',
      },
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => getHeader(column, 'Описание'),
    label: 'Описание',
    cell: ({ row }) => {
      const value = row.getValue('description') || ''
      return value.length > 30 ? value.slice(0, 30) + '...' : value
    },
    enableColumnPinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    meta: {
      class: {
        th: 'w-[200px] min-w-[200px] max-w-[200px]',
        td: 'w-[200px] min-w-[200px] max-w-[200px]',
      },
    },
  },
  {
    accessorKey: 'characteristics',
    header: ({ column }) => getHeader(column, 'Характеристики'),
    label: 'Характеристики',
    cell: ({ row }) => {
      const value = row.getValue('description') || ''
      return value.length > 30 ? value.slice(0, 30) + '...' : value
    },
    enableColumnPinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    meta: {
      class: {
        th: 'w-[200px] min-w-[200px] max-w-[200px]',
        td: 'w-[200px] min-w-[200px] max-w-[200px]',
      },
    },
  },
  ...Array.from(prpsGroupsMap.value.entries()).map(([pGroup, { name }]) => ({
    id: pGroup,
    header: ({ column }) => getHeader(column, name),
    label: name,
    accessorFn: row => row[pGroup]?.name || '',
    enableColumnPinning: true,
    size: 120,
    meta: {
      class: {
        th: 'w-[120px] min-w-[120px] max-w-[120px]',
        td: 'w-[120px] min-w-[120px] max-w-[120px]',
      },
    },
  })),
  {
    accessorKey: 'label',
    header: ({ column }) => getHeader(column, 'Метка'),
    label: 'Метка',
    enableColumnPinning: true,
    size: 120,
    minSize: 120,
    maxSize: 120,
    meta: {
      class: {
        th: 'w-[120px] min-w-[120px] max-w-[120px]',
        td: 'w-[120px] min-w-[120px] max-w-[120px]',
      },
    },
  },
  {
    accessorKey: 'published',
    header: ({ column }) => getHeader(column, 'Опубликован'),
    label: 'Опубликован',
    cell: ({ row }) => (row.original.published === 1 ? 'Да' : 'Нет'),
    enableColumnPinning: true,
    size: 120,
    minSize: 120,
    maxSize: 120,
    meta: {
      class: {
        th: 'w-[120px] min-w-[120px] max-w-[120px]',
        td: 'w-[120px] min-w-[120px] max-w-[120px]',
      },
    },
  },
])

async function updateProds() {
  if (!activeCatId.value) return

  prods.value = (await myFetch('/api/admin/cms/products/getProds?cat_id=' + activeCatId.value)).map(prod => {
    for (const gName of prpsGroupsMap.value.keys()) {
      prod[gName] =
        prod[gName] > 0
          ? {
              id: prod[gName],
              name: prps.value[gName].find(p => p.id === prod[gName]).name,
            }
          : null
    }

    return prod
  })
  rowSelection.value = {}
  globalFilter.value = ''
}

const onTableClick = event => {
  // calculate clicked element
  const cell = event.target.closest('td')
  if (!cell) return
  const rowElement = cell.closest('tr')
  if (!rowElement) return
  const rowIndex = rowElement.rowIndex - 2
  const cellIndex = cell.cellIndex

  const tableApi = table.value?.tableApi
  const visibleRows = tableApi.getRowModel().rows

  const clickedRow = visibleRows[rowIndex]
  const clickedCell = clickedRow.getVisibleCells()[cellIndex]

  const clicked = {
    rowIndex: clickedCell.row.index,
    columnId: clickedCell.column.id,
  }

  const product = prods.value[clicked.rowIndex]

  if (/^p\d_/.test(clicked.columnId)) {
    // prps clicked
    const pGroup = clicked.columnId
    const pGroupName = prpsGroupsMap.value.get(pGroup)?.name || 'Unknown group'
    const pId = product[pGroup].id

    editPrps(pGroup, pGroupName, [pId])
  }
}
</script>

<template>
  <div class="flex h-full flex-col gap-1">
    <div class="flex items-center gap-4">
      <USelectMenu
        v-model="activeCatId"
        :items="cats"
        value-key="value"
        :search-input="{
          placeholder: 'Filter...',
          icon: 'i-lucide-filter',
          type: 'search',
        }"
        placeholder="Выберите категорию"
        class="w-96" />
      <UInput
        v-model="globalFilter"
        placeholder="Filter..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />
      <div
        v-if="prods.length"
        class="text-sm text-gray-600">
        Всего: {{ prods.length }}
        <span v-if="globalFilter.length">, отфильтровано: {{ countFilteredRows }}</span>
      </div>
      <div class="flex grow justify-end gap-1">
        <UDropdownMenu
          :items="[
            {
              label: 'Скрыть/показать все',
              onSelect(e) {
                e.preventDefault()
                const allVisible = table?.tableApi
                  ?.getAllColumns()
                  .filter(column => column.getCanHide())
                  .every(column => column.getIsVisible())
                const columnIds =
                  table?.tableApi
                    ?.getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => column.id) ?? []
                columnIds.forEach(id => {
                  table?.tableApi?.getColumn(id)?.toggleVisibility(!allVisible)
                })
              },
            },
            { type: 'separator' },
            ...(table?.tableApi
              ?.getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => ({
                label: column.columnDef.label,
                type: 'checkbox',
                checked: column.getIsVisible(),
                onUpdateChecked(checked) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e) {
                  e.preventDefault()
                },
              })) ?? []),
          ]"
          :content="{ align: 'end' }">
          <UButton
            label="Колонки"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down" />
        </UDropdownMenu>
      </div>
    </div>

    <div class="min-h-0 w-full grow">
      <UTable
        ref="table"
        sticky
        v-model:row-selection="rowSelection"
        v-model:global-filter="globalFilter"
        v-model:column-pinning="columnPinning"
        :data="prods"
        :columns="columns"
        :ui="{
          th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
          td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
          tr: 'bg-gray-100/95 hover:bg-gray-200/95 data-[selected=true]:bg-violet-100/95',
        }"
        class="h-full w-full overflow-auto"
        @click="onTableClick" />
    </div>
  </div>
</template>
