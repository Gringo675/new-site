<script setup>
//
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)
const globalFilter = ref('')
const prods = ref([])
const labels = ref([])

async function fetchData() {
  try {
    const [labelsData, prodsData] = await Promise.all([myFetch('/api/admin/cms/labels/getLabels'), myFetch('/api/admin/cms/labels/getProds')])
    labels.value = labelsData || []
    prods.value = prodsData || []
  } catch (e) {
    console.error('Error fetching data:', e)
  }
}

onMounted(fetchData)

function getHeader(column, label) {
  const isSorted = column.getIsSorted()
  return h('div', { class: 'flex items-center gap-1 justify-start' }, [
    h('div', { class: 'flex flex-col' }, [
      h(UButton, {
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
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
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'Product ID'),
    label: 'Product ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Product Name'),
    label: 'Product Name',
  },
  ...labels.value.map(label => {
    const labelId = Number(label.id)
    return {
      id: `label_${label.id}`,
      accessorFn: prod => (prod.label === labelId ? 1 : 0),
      header: ({ column }) => {
        const labelContent = h('div', { class: 'flex items-center gap-1', title: label.description }, [h('img', { src: `/static/img/labels/${label.image}`, class: 'h-6 w-6', width: 24, height: 24, alt: 'label' }), h('span', label.name)])
        return getHeader(column, labelContent)
      },
      label: label.name,
      cell: ({ row }) => {
        const product = row.original
        return h(UCheckbox, {
          modelValue: product.label === labelId,
          'onUpdate:modelValue': async val => {
            let newLabel = product.label
            if (val === true) {
              newLabel = labelId
            } else if (val === false && product.label === labelId) {
              newLabel = 0
            } else {
              return
            }

            if (await updateProductLabel(product.id, newLabel)) {
              product.label = newLabel
            }
          },
          'aria-label': label.description,
        })
      },
    }
  }),
])

async function updateProductLabel(id, label) {
  return await myFetch('/api/admin/cms/labels/updProds', {
    method: 'POST',
    payload: [{ id, label }],
  })
}
</script>

<template>
  <div class="flex h-full flex-col gap-1">
    <div class="flex items-center gap-4">
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
        virtualize
        v-model:global-filter="globalFilter"
        :data="prods"
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
