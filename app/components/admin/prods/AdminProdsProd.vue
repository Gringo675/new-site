<script setup>
//
import { h, resolveComponent } from 'vue'
const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)
const columnPinning = ref({ left: ['select'], right: [] })

const { prps } = useProperties()

const state = shallowReactive({
  cats: [],
  prods: [],
  activeCatId: null,
  rowSelection: {},
  globalFilter: '',
})

onMounted(async () => {
  state.cats = await myFetch('/api/admin/cms/getMainCats')
})

watch(
  () => state.activeCatId,
  async newVal => {
    if (newVal) {
      await updateProds()
    }
  },
)

const prpsGroupsMap = usePrpsGroupsMap()

const updateProds = async () => {
  if (!state.activeCatId) return

  state.prods = (await myFetch('/api/admin/cms/products/getProds?cat_id=' + state.activeCatId)).map(prod => {
    for (const gName of prpsGroupsMap.keys()) {
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
  state.rowSelection = {}
  state.globalFilter = ''
}

function getHeader(column, label) {
  const isPinned = column.getIsPinned()
  return h('div', { class: 'flex items-center gap-1 justify-start' }, [
    h(UButton, {
      icon: isPinned ? 'i-lucide-pin-off' : 'i-lucide-pin',
      size: 'xs',
      color: 'neutral',
      variant: 'ghost',
      onClick: e => {
        e.stopPropagation()
        const newPin = isPinned === 'left' ? false : 'left'
        column.pin(newPin)
      },
    }),
    label,
  ])
}

const columns = [
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
  {
    accessorKey: 'p0_brand',
    header: ({ column }) => getHeader(column, 'Бренд'),
    label: 'Бренд',
    accessorFn: row => row.p0_brand?.name || '',
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
    accessorKey: 'p1_type',
    header: ({ column }) => getHeader(column, 'Тип'),
    label: 'Тип',
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
    accessorKey: 'p2_counting_system',
    header: ({ column }) => getHeader(column, 'Система счисления'),
    label: 'Система счисления',
    enableColumnPinning: true,
    size: 150,
    minSize: 150,
    maxSize: 150,
    meta: {
      class: {
        th: 'w-[150px] min-w-[150px] max-w-[150px]',
        td: 'w-[150px] min-w-[150px] max-w-[150px]',
      },
    },
  },
  {
    accessorKey: 'p3_range',
    header: ({ column }) => getHeader(column, 'Диапазон'),
    label: 'Диапазон',
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
    accessorKey: 'p4_size',
    header: ({ column }) => getHeader(column, 'Размер'),
    label: 'Размер',
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
    accessorKey: 'p5_accuracy',
    header: ({ column }) => getHeader(column, 'Точность'),
    label: 'Точность',
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
    accessorKey: 'p6_class',
    header: ({ column }) => getHeader(column, 'Класс'),
    label: 'Класс',
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
    accessorKey: 'p7_feature',
    header: ({ column }) => getHeader(column, 'Особенность'),
    label: 'Особенность',
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
    accessorKey: 'p8_pack',
    header: ({ column }) => getHeader(column, 'Упаковка'),
    label: 'Упаковка',
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
]
</script>

<template>
  <div class="prods flex h-full flex-col gap-1">
    <div class="flex items-center gap-4">
      <USelectMenu
        v-model="state.activeCatId"
        :items="state.cats"
        value-key="value"
        :search-input="{
          placeholder: 'Filter...',
          icon: 'i-lucide-filter',
          type: 'search',
        }"
        placeholder="Выберите категорию"
        class="w-96" />
      <UInput
        v-model="state.globalFilter"
        placeholder="Filter..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />
      <div
        v-if="state.prods.length"
        class="text-sm text-gray-600">
        Всего: {{ state.prods.length }}
        <span v-if="state.globalFilter.length">, отфильтровано: {{ countFilteredRows }}</span>
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
        v-model:row-selection="state.rowSelection"
        v-model:global-filter="state.globalFilter"
        v-model:column-pinning="columnPinning"
        sticky
        :data="state.prods"
        :columns="columns"
        :ui="{
          th: 'text-center bg-gray-100 px-2',
          td: 'p-2 wrap-break-word whitespace-normal',
          tr: 'bg-gray-50/95 hover:bg-gray-200/95 data-[selected=true]:bg-violet-100/95',
        }"
        class="h-full w-full overflow-auto" />
    </div>
  </div>
</template>
