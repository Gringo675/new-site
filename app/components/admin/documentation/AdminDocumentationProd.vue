<script setup>
//
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')

const emit = defineEmits(['navigateToDoc'])

const table = useTemplateRef('table')
const countFilteredRows = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length || 0)

const state = shallowReactive({
  cats: [],
  prods: [],
  activeCatId: null,
  rowSelection: {},
  globalFilter: '',
})

const { docState } = defineProps({
  docState: {
    type: Object,
  },
})

const goToDocument = (docType, doc) => {
  // Get the search text based on document type
  const searchText = docType === 'passports' ? doc.name : doc.number
  emit('navigateToDoc', { type: docType, searchText })
}

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
    state.cats = mapCats(data)
  } catch (e) {
    console.error('Error fetching categories:', e)
  }
})

const updateProds = async () => {
  if (!state.activeCatId) return

  const selectedCat = state.cats.find(c => c.value === state.activeCatId)
  const rootId = selectedCat?.rootId

  if (!rootId) return

  const parentId = rootId === state.activeCatId ? 0 : rootId

  const prods = await myFetch('/api/admin/cms/documentation/getProds?cat_id=' + state.activeCatId + '&parent_id=' + parentId)
  state.prods = prods.map(p => {
    const standarts = p.standart_ids ? p.standart_ids.split(',').map(id => docState.stnd.find(s => s.id === Number(id)) || { id, error: true }) : []
    const reestrs = p.reestr_ids ? p.reestr_ids.split(',').map(id => docState.rstr.find(r => r.id === Number(id)) || { id, error: true }) : []
    const pasports = p.pasport_ids ? p.pasport_ids.split(',').map(id => docState.pasp.find(pa => pa.id === Number(id)) || { id, error: true }) : []
    return {
      id: p.id,
      name: p.name,
      alias: p.alias,
      standarts,
      reestrs,
      pasports,
      _standart_search: standarts.map(s => s.number || '').join(' '),
      _reestr_search: reestrs.map(r => r.number || '').join(' '),
      _pasp_search: pasports.map(pa => pa.name || '').join(' '),
    }
  })
  state.rowSelection = {}
  state.globalFilter = ''
}

watch(
  () => state.activeCatId,
  async newVal => {
    if (newVal) {
      await updateProds()
    }
  },
)
watch(
  () => [docState.stnd, docState.rstr, docState.pasp],
  () => {
    if (state.activeCatId) {
      updateProds()
    }
  },
)

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
    accessorKey: 'standarts',
    header: 'Стандарты',
    accessorFn: row => row._standart_search,
  },
  {
    accessorKey: 'reestrs',
    header: 'ГРСИ',
    accessorFn: row => row._reestr_search,
  },
  {
    accessorKey: 'pasports',
    header: 'Паспорта',
    accessorFn: row => row._pasp_search,
  },
  {
    accessorKey: 'actions',
    header: '',
    enableGlobalFilter: false,
  },
]

const formState = reactive({
  isOpen: false,
  prods: [],
  standarts: [],
  reestrs: [],
  pasports: [],
})

const closeForm = () => {
  formState.isOpen = false
  formState.prods = []
  formState.standarts = []
  formState.reestrs = []
  formState.pasports = []
}

const editTypes = ref(['standarts', 'reestrs', 'pasports'])
const editCheckboxes = ref([
  {
    label: 'Стнд',
    title: 'Изменять стандарты',
    value: 'standarts',
  },
  {
    label: 'Рстр',
    title: 'Изменять реестры',
    value: 'reestrs',
  },
  {
    label: 'Пасп',
    title: 'Изменять паспорта',
    value: 'pasports',
  },
])

const editProd = async prod => {
  //
  if (!editTypes.value.length) {
    await showMessage({
      title: 'Все типы документов отключены!',
      description: 'Пожалуйста, выберите хотя бы один тип документов для редактирования.',
      type: 'error',
    })
    return
  }

  formState.isOpen = true
  formState.prods = [prod]
  for (const type of editTypes.value) {
    formState[type] = prod[type]
  }
}

const editMassProds = async () => {
  //
  if (!editTypes.value.length) {
    await showMessage({
      title: 'Все типы документов отключены!',
      description: 'Пожалуйста, выберите хотя бы один тип документов для редактирования.',
      type: 'error',
    })
    return
  }
  const selectedIndices = Object.keys(state.rowSelection).map(Number)
  if (!selectedIndices.length) return

  formState.prods = selectedIndices.map(index => state.prods[index])

  const firstProd = formState.prods[0]

  // Check if all products have identical docs (compare arrays using cached IDs)
  const allIdentical = formState.prods.every(p => editTypes.value.every(type => p[type].length === firstProd[type].length && p[type].every(doc => firstProd[type].includes(doc))))

  if (!allIdentical) {
    const proceed = await showMessage({
      title: 'Документы у выбранных товаров отличаются (или присутствуют некорректные документы)!',
      description: 'Будут оставлены только общие для всех действующие документы. Продолжаем?',
      isDialog: true,
    })
    if (!proceed) {
      closeForm()
      return
    }
  }

  if (allIdentical) {
    for (const type of editTypes.value) {
      formState[type] = firstProd[type]
    }
  } else {
    for (const type of editTypes.value) {
      formState[type] = formState.prods.reduce((common, prod) => {
        return common.filter(d => prod[type].some(pd => pd === d))
      }, formState.prods[0][type])
    }
  }
  formState.isOpen = true
}

const moveDoc = (type, index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= formState[type].length) return
  const arr = [...formState[type]]
  const [item] = arr.splice(index, 1)
  arr.splice(newIndex, 0, item)
  formState[type] = arr
}

const removeDoc = (type, id) => {
  formState[type] = formState[type].filter(d => d.id !== id)
}

const saveProds = async () => {
  // check for errors first
  if (editTypes.value.some(type => formState[type].some(doc => doc.error))) {
    await showMessage({
      title: 'Ошибка в документах',
      description: 'Проверьте, что все выбранные документы корректны.',
      type: 'error',
    })
    return
  }

  for (const prod of formState.prods) {
    const formData = new FormData()
    formData.append('id', prod.id)
    editTypes.value.forEach(type => {
      const paramName = type === 'standarts' ? 'standart_ids' : type === 'reestrs' ? 'reestr_ids' : 'pasport_ids'
      formData.append(paramName, formState[type].map(d => d.id).join(','))
    })

    await myFetch('/api/admin/cms/documentation/setProd', {
      method: 'post',
      payload: formData,
    })
  }

  showNotice({
    title: 'Данные сохранены',
    type: 'success',
  })
  closeForm()
  await updateProds()
}

const onTest = () => {
  console.log('Test function called')
  state.prods[0].name = 'Updated Name ' + new Date().toLocaleTimeString()
}
</script>

<template>
  <div>
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
      <div class="flex grow items-center justify-end gap-4">
        <UButton
          :label="`Группа (${Object.keys(state.rowSelection).length})`"
          title="Редактировать выбранные товары"
          icon="i-heroicons-pencil-square"
          :disabled="!Object.keys(state.rowSelection).length"
          variant="outline"
          @click="editMassProds" />
        <UCheckboxGroup
          v-model="editTypes"
          :items="editCheckboxes"
          orientation="horizontal"
          variant="table"
          size="sm"
          :ui="{
            item: 'p-1.5',
          }" />
      </div>
    </div>

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
      class="my-4">
      <template #id-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          {{ row.original.id }}
        </div>
      </template>
      <template #name-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          {{ row.original.name }}
        </div>
      </template>
      <template #standarts-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <div
            v-for="stnd in row.original.standarts"
            class="">
            <span
              v-if="stnd.error"
              class="block text-red-600">
              Не найден (ID: {{ stnd.id }})
            </span>
            <span
              v-else
              :title="stnd.name"
              class="cursor-pointer text-blue-600 hover:underline"
              @click="goToDocument('standards', stnd)">
              {{ stnd.number }}
            </span>
          </div>
        </div>
      </template>
      <template #reestrs-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <div
            v-for="rstr in row.original.reestrs"
            class="">
            <span
              v-if="rstr.error"
              class="block text-red-600">
              Не найден (ID: {{ rstr.id }})
            </span>
            <span
              v-else
              :title="rstr.name"
              class="cursor-pointer text-blue-600 hover:underline"
              @click="goToDocument('rstr', rstr)">
              {{ rstr.number }}
            </span>
          </div>
        </div>
      </template>
      <template #pasports-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <div
            v-for="pasp in row.original.pasports"
            class="">
            <span
              v-if="pasp.error"
              class="block text-red-600">
              Не найден (ID: {{ pasp.id }})
            </span>
            <span
              v-else
              :title="pasp.name"
              class="cursor-pointer text-blue-600 hover:underline"
              @click="goToDocument('passports', pasp)">
              {{ pasp.name }}
            </span>
          </div>
        </div>
      </template>
      <template #actions-cell="{ row }">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-pencil"
          @click="editProd(row.original)" />
      </template>
    </UTable>

    <UModal
      v-model:open="formState.isOpen"
      :title="formState.prods.length > 1 ? `Редактирование (${formState.prods.length} товаров)` : 'Редактирование'"
      :dismissible="false"
      :ui="{
        content: 'max-w-xl',
      }">
      <template #body>
        <UForm
          :state="formState"
          @submit="saveProds">
          <div class="space-y-4">
            <div class="max-h-30 space-y-1 overflow-y-auto text-sm font-bold">
              <div
                v-for="prod in formState.prods"
                :key="prod.id">
                {{ prod.name }}
              </div>
            </div>

            <UFormField
              v-for="type in ['standarts', 'reestrs', 'pasports'].filter(t => editTypes.includes(t))"
              :key="type"
              :label="type === 'standarts' ? 'Стандарты' : type === 'reestrs' ? 'ГРСИ (Реестры)' : 'Паспорта'">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="(doc, index) in formState[type]"
                  :key="doc.id"
                  :color="doc.error ? 'error' : 'neutral'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  <UButton
                    v-if="index > 0"
                    icon="i-heroicons-arrow-long-left"
                    size="xs"
                    variant="link"
                    class="p-0"
                    @click="moveDoc(type, index, -1)" />
                  <UButton
                    v-if="index < formState[type].length - 1"
                    icon="i-heroicons-arrow-long-right"
                    size="xs"
                    variant="link"
                    class="p-0"
                    @click="moveDoc(type, index, 1)" />
                  {{ doc.error ? `Не найден (ID: ${doc.id})` : doc.number || doc.name }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="removeDoc(type, doc.id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState[type]"
                :items="type === 'standarts' ? docState.stnd.map(s => ({ label: `${s.number} - ${s.name}`, value: s })) : type === 'reestrs' ? docState.rstr.map(r => ({ label: `№${r.number} - ${r.name}`, value: r })) : docState.pasp.map(p => ({ label: p.name, value: p }))"
                value-key="value"
                multiple
                :search-input="{
                  placeholder: 'Filter...',
                  icon: 'i-lucide-filter',
                  type: 'search',
                }"
                placeholder="Добавить"
                class="w-full" />
            </UFormField>

            <div class="flex justify-end gap-x-4">
              <UButton
                label="Отмена"
                variant="outline"
                color="neutral"
                @click="closeForm" />
              <UButton
                label="Сохранить"
                type="submit"
                variant="subtle"
                color="neutral"
                class="px-8" />
            </div>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
