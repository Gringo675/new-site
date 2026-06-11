<script setup>
import { h, resolveComponent } from 'vue'
//
const UButton = resolveComponent('UButton')

const state = shallowRef({
  products: [],
  vendorItems: [],
})

const vendors = [
  { label: 'ЧИЗ', value: 'chiz' },
  { label: 'Кибер', value: 'kiber' },
  { label: 'Киров', value: 'kirov' },
  { label: 'Стиз', value: 'stiz' },
]

const activeVendor = ref()
const globalFilterProds = ref('')
const globalFilterItems = ref('')

const tableProds = useTemplateRef('tableProds')
const tableItems = useTemplateRef('tableItems')

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

const columnsProds = [
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

const columnsItems = [
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

watch(activeVendor, updateVendor)

async function updateVendor() {
  state.value = await myFetch(`/api/admin/cms/vendors/getVendor?vendor=${activeVendor.value}`)
}
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <div class="flex items-center gap-4">
      <USelectMenu
        v-model="activeVendor"
        :items="vendors"
        value-key="value"
        :search-input="{
          placeholder: 'Filter...',
          icon: 'i-lucide-filter',
          type: 'search',
        }"
        placeholder="Выберите поставщика"
        class="w-64" />

      <UInput
        v-model="globalFilterProds"
        placeholder="Filter products..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />

      <UInput
        v-model="globalFilterItems"
        placeholder="Filter items..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />
    </div>
    <div class="flex min-h-0 w-full grow divide-x divide-gray-200">
      <div class="flex w-[60%] flex-col gap-1 pr-2">
        <div class="min-h-0 grow">
          <UTable
            ref="tableProds"
            sticky
            virtualize
            v-model:global-filter="globalFilterProds"
            :data="state.products"
            :columns="columnsProds"
            :ui="{
              tr: 'bg-gray-100/95 hover:bg-gray-200/95',
              th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
              td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
            }"
            class="h-full w-full" />
        </div>
      </div>

      <div class="flex w-[40%] flex-col gap-1 pl-2">
        <div class="min-h-0 grow">
          <UTable
            ref="tableItems"
            sticky
            virtualize
            v-model:global-filter="globalFilterItems"
            :data="state.vendorItems"
            :columns="columnsItems"
            :ui="{
              tr: 'bg-gray-100/95 hover:bg-gray-200/95',
              th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
              td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
            }"
            class="h-full w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
