<script setup>
//
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')

const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)

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

const updateProds = async () => {
  if (!state.activeCatId) return
  const prods = await myFetch('/api/admin/cms/products/getProds?cat_id=' + state.activeCatId)

  state.prods = prods
  state.rowSelection = {}
  state.globalFilter = ''
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
  },
  {
    accessorKey: 'id',
    header: 'Код',
  },
  {
    accessorKey: 'name',
    header: 'Наименование',
  },
  {
    accessorKey: 'alias',
    header: 'Алиас',
  },
  {
    accessorKey: 'brand_eans',
    header: 'Brand EANs',
  },
  {
    accessorKey: 'images',
    header: 'Images',
  },
  {
    accessorKey: 'description',
    header: 'Описание',
    cell: ({ row }) => {
      const value = row.getValue('description') || ''
      return value.length > 30 ? value.slice(0, 30) + '...' : value
    },
  },
  {
    accessorKey: 'characteristics',
    header: 'Характеристики',
    cell: ({ row }) => {
      const value = row.getValue('description') || ''
      return value.length > 30 ? value.slice(0, 30) + '...' : value
    },
  },
  {
    accessorKey: 'p0_brand',
    header: 'Бренд',
  },
  {
    accessorKey: 'p1_type',
    header: 'Тип',
  },
  {
    accessorKey: 'p2_counting_system',
    header: 'Система счисления',
  },
  {
    accessorKey: 'p3_range',
    header: 'Диапазон',
  },
  {
    accessorKey: 'p4_size',
    header: 'Размер',
  },
  {
    accessorKey: 'p5_accuracy',
    header: 'Точность',
  },
  {
    accessorKey: 'p6_class',
    header: 'Класс',
  },
  {
    accessorKey: 'p7_feature',
    header: 'Особенность',
  },
  {
    accessorKey: 'p8_pack',
    header: 'Упаковка',
  },
  {
    accessorKey: 'label',
    header: 'Метка',
  },
  {
    accessorKey: 'published',
    header: 'Опубликован',
    cell: ({ row }) => (row.original.published === 1 ? 'Да' : 'Нет'),
  },
]
</script>

<template>
  <div class="flex h-full flex-col gap-1">
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
    </div>

    <div class="w-full grow overflow-x-auto">
      <!-- <div class="h-200 w-500 bg-green-300">plank</div> -->
      <UTable
        ref="table"
        v-model:row-selection="state.rowSelection"
        v-model:global-filter="state.globalFilter"
        :data="state.prods"
        :columns="columns"
        :ui="{
          th: 'text-center bg-gray-100 px-2',
          td: 'p-2',
          tr: 'hover:bg-gray-200 data-[selected=true]:bg-violet-100/50',
        }"
        class="w-max" />
    </div>
  </div>
</template>
