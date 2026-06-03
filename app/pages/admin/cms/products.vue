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
const { editText } = useTextEditor()

function mapCats(catsArr, level = 0, rootId = null) {
  if (!Array.isArray(catsArr)) return []
  const result = []
  for (const cat of catsArr) {
    const currentRootId = rootId || cat.id
    result.push({
      value: cat.id,
      label: '- '.repeat(level) + cat.name,
      rootId: currentRootId,
    })
    if (cat.children && Array.isArray(cat.children)) {
      result.push(...mapCats(cat.children, level + 1, currentRootId))
    }
  }
  return result
}

onMounted(async () => {
  try {
    const data = await myFetch('/api/getData/categories')
    cats.value = mapCats(data)
  } catch (e) {
    console.error('Error fetching categories:', e)
  }
})

const prpsGroupsMap = computed(() => usePrpsGroupsMap(activeCatId.value))

watch(activeCatId, getProds)

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
      const value = row.getValue('characteristics') || ''
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
    accessorFn: prod => {
      return prod[pGroup] > 0 ? prps.value[pGroup].find(p => p.id === prod[pGroup]).name : ''
    },
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
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.original.published == 1,
        'onUpdate:modelValue': async value => {
          const newValue = value ? 1 : 0
          if (await updateProds({ id: row.original.id, published: newValue })) {
            row.original.published = newValue
          }
        },
        'aria-label': 'Опубликован',
      }),
    enableColumnPinning: true,
    enableGlobalFilter: false,
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

function sortProdsByProperties(products) {
  if (!products.length) return products

  // 1. Prepare sorted structure of groups and their properties
  const sortedGroups = Array.from(prpsGroupsMap.value.entries()).sort((a, b) => a[1].ordering - b[1].ordering)

  const filter = sortedGroups.map(([pGroup, { name }]) => {
    const groupProps = prps.value[pGroup] || []
    const sortedValues = [...groupProps].sort((a, b) => a.ordering - b.ordering)
    return {
      name,
      values: sortedValues.map(p => p.id),
    }
  })

  // 2. Normalize products: add a 'props' array containing all property IDs
  products.forEach(prod => {
    prod.props = []
    for (const [pGroup] of prpsGroupsMap.value.entries()) {
      if (prod[pGroup]) prod.props.push(prod[pGroup])
    }
  })

  // 3. Apply sorting logic
  products.sort((a, b) => {
    for (const fGroup of filter) {
      for (const propVal of fGroup.values) {
        const isA = a.props.includes(propVal)
        const isB = b.props.includes(propVal)
        if (isA && !isB) return -1
        if (!isA && isB) return 1
      }
    }
    return 0
  })

  return products
}

async function getProds() {
  if (!activeCatId.value) return

  const selectedCat = cats.value.find(c => c.value === activeCatId.value)
  const rootId = selectedCat?.rootId

  if (!rootId) return

  const parentId = rootId === activeCatId.value ? 0 : rootId

  try {
    const fetchedProds = await myFetch(`/api/admin/cms/products/getProds?cat_id=${activeCatId.value}&parent_id=${parentId}`)

    if (Array.isArray(fetchedProds)) {
      prods.value = sortProdsByProperties(fetchedProds)
    } else {
      prods.value = []
    }

    rowSelection.value = {}
    globalFilter.value = ''
  } catch (e) {
    console.error('Error fetching products:', e)
  }
}

const onTableDbClick = async event => {
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

  const field = clickedCell.column.id
  const selectedIndices = Object.keys(rowSelection.value).filter(index => rowSelection.value[index])

  if (selectedIndices.length > 1) {
    const selectedProds = selectedIndices.map(index => prods.value[parseInt(index)])
    await editField(field, selectedProds)
  } else {
    const product = prods.value[clickedCell.row.index]
    await editField(field, [product])
  }
}

const editField = async (field, productsToEdit) => {
  const isMass = productsToEdit.length > 1
  let initialValue

  if (isMass) {
    const values = productsToEdit.map(p => p[field])
    const allSame = values.every(v => v === values[0])
    initialValue = values[0]

    if (!allSame) {
      const proceed = await showMessage({
        title: 'Массовое редактирование',
        description: 'Значения в выбранных товарах различаются. Продолжить редактирование?',
        isDialog: true,
      })
      if (!proceed) return
    }
  } else {
    initialValue = productsToEdit[0][field]
  }

  let newValue

  if (/^p\d_/.test(field)) {
    const pGroupName = prpsGroupsMap.value.get(field)?.name || 'Unknown group'
    newValue = (await editPrps(field, pGroupName, initialValue))?.[0]
  } else if (['name', 'alias', 'brand_eans', 'images', 'description', 'characteristics'].includes(field)) {
    const column = columns.value.find(col => col['accessorKey'] === field || col['id'] === field)
    const label = column?.label || field
    newValue = await editText(initialValue, field, label)
  } else {
    return
  }

  if (newValue === undefined) return
  if (!isMass && newValue === initialValue) return

  const updates = productsToEdit.map(p => ({ id: p.id, [field]: newValue }))
  if (await updateProds(updates)) {
    productsToEdit.forEach(p => (p[field] = newValue))
    if (field === 'name') {
      for (const p of productsToEdit) {
        await createAlias(p)
      }
    }
  }
}

const createAlias = async (product, isSilent = false) => {
  const name = product.name
  if (product.alias?.length && !isSilent) {
    const proceed = await showMessage({
      title: 'Обновить алиас товара?',
      description: `Будет создан новый алиас из наименования "${name}". Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return
  }
  const newAlias = slugify(name)
  const isUpdated = await updateProds({ id: product.id, alias: newAlias })
  if (isUpdated) {
    product.alias = newAlias
  }
}

const addNewProd = async () => {
  const selectedCat = cats.value.find(c => c.value === activeCatId.value)
  const rootId = selectedCat?.rootId

  if (!rootId) return

  const id = await myFetch(`/api/admin/cms/products/getNextProdId?cat_id=${rootId}`)

  const newProd = {
    id,
    name: '',
    published: 0,
    category_id: rootId,
  }

  const isUpdated = await updateProds({ ...newProd, isNew: true })
  if (isUpdated) {
    const selectedIndices = Object.keys(rowSelection.value).filter(index => rowSelection.value[index])
    if (selectedIndices.length === 1) {
      const index = parseInt(selectedIndices[0])
      prods.value.splice(index + 1, 0, newProd)
    } else {
      prods.value.push(newProd)
    }
  }
}

const copyType = async () => {
  const selectedIndices = Object.keys(rowSelection.value).filter(index => rowSelection.value[index])
  if (selectedIndices.length !== 2) {
    await showCopyError()
    return
  }

  const p1 = prods.value[selectedIndices[0]]
  const p2 = prods.value[selectedIndices[1]]

  let donor, recipient
  if (!p1.name && p2.name) {
    donor = p2
    recipient = p1
  } else if (p1.name && !p2.name) {
    donor = p1
    recipient = p2
  } else {
    await showCopyError()
    return
  }

  const donorNameWords = donor.name.split(' ')
  const recipientName = donorNameWords.slice(0, -1).join(' ').trim()

  const updates = {
    id: recipient.id,
    name: recipientName,
    description: donor.description,
    characteristics: donor.characteristics,
    p1_type: donor.p1_type,
    p2_counting_system: donor.p2_counting_system,
    p3_range: donor.p3_range,
    p4_size: donor.p4_size,
    p5_accuracy: donor.p5_accuracy,
    p6_class: donor.p6_class,
    p7_feature: donor.p7_feature,
  }

  const isUpdated = await updateProds(updates)
  if (isUpdated) {
    Object.assign(recipient, updates)
    await createAlias(recipient)
  }
}

const copyBrand = async () => {
  const selectedIndices = Object.keys(rowSelection.value).filter(index => rowSelection.value[index])
  if (selectedIndices.length !== 2) {
    await showCopyError()
    return
  }

  const p1 = prods.value[selectedIndices[0]]
  const p2 = prods.value[selectedIndices[1]]

  let donor, recipient
  if (!p1.p0_brand && p2.p0_brand) {
    donor = p2
    recipient = p1
  } else if (p1.p0_brand && !p2.p0_brand) {
    donor = p1
    recipient = p2
  } else {
    await showCopyError()
    return
  }

  const donorWords = donor.name.split(' ')
  const donorBrand = donorWords[donorWords.length - 1]

  const updatedName = recipient.name ? `${recipient.name} ${donorBrand}`.trim() : ''

  const updates = {
    id: recipient.id,
    name: updatedName,
    images: donor.images,
    p0_brand: donor.p0_brand,
    p8_pack: donor.p8_pack,
  }

  const isUpdated = await updateProds(updates)
  if (isUpdated) {
    Object.assign(recipient, updates)
    updatedName && (await createAlias(recipient, true))
  }
}

const showCopyError = async () => {
  await showMessage({
    title: 'Ошибка',
    description: 'Убедитесь, что выбрано 2 товара, и у получателя не заполнено поле "Наименование" при копировании Типа, или "Производитель" при копировании Бренда',
    type: 'error',
  })
}

const deleteSelectedProds = async () => {
  const selectedIndices = Object.keys(rowSelection.value).filter(index => rowSelection.value[index])
  if (selectedIndices.length === 0) return

  const selectedProds = selectedIndices.map(index => prods.value[index])
  const prodNames = selectedProds.map(p => `- ${p.name}`).join('\n')

  const confirmed = await showMessage({
    title: 'Удаление товаров',
    description: `Вы уверены, что хотите удалить следующие товары:\n${prodNames}`,
    type: 'error',
    isDialog: true,
  })

  if (confirmed) {
    const payload = selectedProds.map(p => ({ id: p.id, isDel: true }))
    const isUpdated = await updateProds(payload)
    if (isUpdated) {
      await getProds()
    }
  }
}

const updateProds = async prods => {
  /**
   * Receives an array of products or a single product object with updated fields, e.g.:
   * {"id": 140002, "p2_counting_system": 277}
   * if 'isNew' -> new product
   * if 'isDel' -> delete product
   */
  prods = Array.isArray(prods) ? prods : [prods]
  return await myFetch('/api/admin/cms/products/updProds', {
    method: 'POST',
    payload: prods,
  })
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
        <UButton
          label="Добавить"
          color="success"
          variant="outline"
          @click="addNewProd" />
        <UButton
          label="Копировать тип"
          color="neutral"
          variant="outline"
          @click="copyType" />
        <UButton
          label="Копировать бренд"
          color="neutral"
          variant="outline"
          @click="copyBrand" />
        <UButton
          label="Удалить"
          color="secondary"
          variant="outline"
          @click="deleteSelectedProds" />
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
          tr: 'bg-gray-100/95 hover:bg-gray-200/95 data-[selected=true]:bg-violet-100/95',
          th: 'text-center bg-gray-100 px-2 even:bg-white/35 wrap-break-word whitespace-normal',
          td: 'p-2 wrap-break-word whitespace-normal even:bg-white/35',
        }"
        class="h-full w-full overflow-auto"
        @dblclick="onTableDbClick" />
    </div>
  </div>
</template>
