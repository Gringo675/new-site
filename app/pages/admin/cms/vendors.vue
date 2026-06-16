<script setup>
import { h, resolveComponent } from 'vue'

// Components
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

// State
const state = ref({
  products: [],
  vendorItems: [],
})
const activeVendor = ref()
const productFilter = ref('')
const vendorFilter = ref('')

// EAN Editing State
const isModalOpen = ref(false)
const editingProduct = ref(null)
const editingEans = ref('')

const vendors = [
  { label: 'ЧИЗ', value: 'chiz' },
  { label: 'Кибер', value: 'kiber' },
  { label: 'Киров', value: 'kirov' },
  { label: 'Стиз', value: 'stiz' },
]

// Computed
const allVendorEans = computed(() => {
  return new Set(state.value.vendorItems?.map(item => item.ean))
})

const allProductEans = computed(() => {
  const eans = new Set()
  state.value.products?.forEach(prod => {
    prod.brand_eans?.forEach(ean => eans.add(ean))
  })
  return eans
})

// Methods
async function saveProducts(id, brand_eans) {
  try {
    await myFetch('/api/admin/cms/vendors/setProducts', {
      method: 'POST',
      payload: { id, brand_eans },
    })
    // Update local state
    const prod = state.value.products?.find(p => p.id === id)
    if (prod) {
      prod.brand_eans = Array.isArray(brand_eans) ? brand_eans : brand_eans.split(' ').filter(Boolean)
    }
  } catch (e) {
    console.error('Failed to update products:', e)
  }
}

async function removeEan(id, ean) {
  const prod = state.value.products?.find(p => p.id === id)
  if (!prod) return
  const currentEans = Array.isArray(prod.brand_eans) ? prod.brand_eans : (prod.brand_eans || '').split(' ').filter(Boolean)
  const updatedEans = currentEans.filter(e => e !== ean)
  await saveProducts(id, updatedEans)
}

function openEditModal(product) {
  editingProduct.value = product
  editingEans.value = (product.brand_eans || []).join(' ')
  isModalOpen.value = true
}

async function saveModal() {
  if (!editingProduct.value) return
  const eans = editingEans.value.split(/\s+/).filter(Boolean)
  await saveProducts(editingProduct.value.id, eans)
  isModalOpen.value = false
}

const CellRenderer = {
  props: ['col', 'row'],
  setup(props) {
    return () => {
      if (props.col.cell) {
        return props.col.cell({ row: props.row })
      }
      return props.row.original[props.col.accessorKey]
    }
  },
}

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

const productColumns = [
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'Код'),
    meta: {
      class: {
        td: 'min-w-17 max-w-17 w-17',
      },
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Наименование'),
    meta: {
      class: {
        td: 'min-w-110 max-w-110 w-110',
      },
    },
  },
  {
    accessorKey: 'brand_eans',
    header: 'Brand EANs',
    cell: ({ row }) => {
      const product = row.original
      const eans = product.brand_eans || []
      return h('div', { class: 'relative flex flex-wrap gap-1 items-center' }, [
        ...eans.map(ean =>
          h(
            UBadge,
            {
              color: allVendorEans.value.has(ean) ? 'neutral' : 'error',
              variant: 'outline',
              class: `flex items-center gap-1`,
            },
            {
              default: () => [
                h('span', ean),
                h(
                  UButton,
                  {
                    icon: 'i-heroicons-x-mark',
                    size: 'xs',
                    color: 'neutral',
                    variant: 'ghost',
                    class: 'p-0 h-3 w-3',
                    onClick: e => {
                      e.stopPropagation()
                      removeEan(product.id, ean)
                    },
                  },
                  { default: () => [] },
                ),
              ],
            },
          ),
        ),
        h(
          UButton,
          {
            icon: 'i-lucide-pencil',
            size: 'xs',
            color: 'neutral',
            variant: 'ghost',
            class: 'absolute -top-2 -right-2',
            onClick: () => openEditModal(product),
          },
          { default: () => [] },
        ),
      ])
    },
  },
]

const vendorColumns = [
  {
    accessorKey: 'ean',
    header: ({ column }) => getHeader(column, 'Код'),
    meta: {
      class: {
        td: 'min-w-19 max-w-19 w-19',
      },
    },
    cell: ({ row }) => {
      const ean = row.original.ean
      return h(
        'span',
        {
          class: allProductEans.value.has(ean) ? 'text-green-600' : '',
        },
        ean,
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Наименование'),
  },
  {
    accessorKey: 'stock',
    header: 'К-во',
    meta: {
      class: {
        td: 'min-w-13 max-w-13 w-13',
      },
    },
  },
]

async function updateVendor() {
  const data = await myFetch(`/api/admin/cms/vendors/getVendor?vendor=${activeVendor.value}`)
  if (data && data.products) {
    data.products = data.products.map(prod => ({
      ...prod,
      brand_eans: typeof prod.brand_eans === 'string' ? prod.brand_eans.split(' ').filter(Boolean) : Array.isArray(prod.brand_eans) ? prod.brand_eans : [],
    }))
  }
  state.value = data
}

// Watchers
watch(activeVendor, updateVendor)
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
        v-model="productFilter"
        placeholder="Filter products..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />

      <UInput
        v-model="vendorFilter"
        placeholder="Filter vendor..."
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
            v-model:global-filter="productFilter"
            :data="state.products"
            :columns="productColumns"
            :ui="{
              tr: 'bg-gray-100/95 hover:bg-gray-200/95',
              th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
              td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
            }"
            class="h-full w-full">
            <template #tr-data="{ row }">
              <tr :class="['bg-gray-100/95 hover:bg-gray-200/95']">
                <td
                  v-for="col in productColumns"
                  :key="col.accessorKey"
                  class="p-2 wrap-break-word whitespace-normal even:bg-white/35">
                  <CellRenderer
                    :col="col"
                    :row="row" />
                </td>
              </tr>
            </template>
          </UTable>
        </div>
      </div>

      <div class="flex w-[40%] flex-col gap-1 pl-2">
        <div class="min-h-0 grow">
          <UTable
            ref="tableItems"
            sticky
            virtualize
            v-model:global-filter="vendorFilter"
            :data="state.vendorItems"
            :columns="vendorColumns"
            :ui="{
              tr: 'bg-gray-100/95 hover:bg-gray-200/95',
              th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
              td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
            }"
            class="h-full w-full">
            <template #tr-data="{ row }">
              <tr class="bg-gray-100/95 hover:bg-gray-200/95">
                <td
                  v-for="col in vendorColumns"
                  :key="col.accessorKey"
                  class="p-2 wrap-break-word whitespace-normal even:bg-white/35">
                  <CellRenderer
                    :col="col"
                    :row="row" />
                </td>
              </tr>
            </template>
          </UTable>
        </div>
      </div>
    </div>
    <UModal
      v-model:open="isModalOpen"
      title="Edit EANs"
      :dismissible="false"
      :ui="{
        content: 'max-w-md',
      }">
      <template #body>
        <div class="p-2">
          <UFormField label="EANs (separated by spaces)">
            <UInput
              v-model="editingEans"
              placeholder="Enter EANs separated by spaces..."
              class="w-full"
              autofocus />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-x-4">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="isModalOpen = false" />
          <UButton
            label="Save"
            color="primary"
            @click="saveModal" />
        </div>
      </template>
    </UModal>
  </div>
</template>
