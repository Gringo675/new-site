<script setup>
import { h, resolveComponent } from 'vue'
//
const UButton = resolveComponent('UButton')

const vendors = [
  { label: 'ЧИЗ', value: 'chiz' },
  { label: 'Кибер', value: 'kiber' },
  { label: 'Киров', value: 'kirov' },
  { label: 'Стиз', value: 'stiz' },
]
const selectedVendor = ref()
const products = ref([])
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
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'Код'),
    label: 'Код',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Наименование'),
    label: 'Наименование',
  },
  {
    accessorKey: 'brand_eans',
    header: ({ column }) => getHeader(column, 'Brand EANs'),
    label: 'Brand EANs',
  },
]

async function fetchProducts() {
  const fetchedProducts = await myFetch(`/api/admin/cms/vendors/getProducts?vendor=${selectedVendor.value}`)
  if (Array.isArray(fetchedProducts)) {
    products.value = fetchedProducts
  } else {
    products.value = []
  }
}

watch(selectedVendor, fetchProducts)
</script>

<template>
  <div class="flex h-full flex-col gap-1">
    <div class="flex items-center gap-4">
      <USelectMenu
        v-model="selectedVendor"
        :items="vendors"
        value-key="value"
        placeholder="Выберите бренд"
        class="w-48" />

      <UInput
        v-model="globalFilter"
        placeholder="Filter products..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />

      <div
        v-if="products.length"
        class="text-sm text-gray-600">
        Всего: {{ products.length }}
        <span v-if="globalFilter.length">, отфильтровано: {{ countFilteredRows }}</span>
      </div>
    </div>

    <div class="min-h-0 w-full grow">
      <UTable
        ref="table"
        sticky
        virtualize
        v-model:global-filter="globalFilter"
        :data="products"
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
