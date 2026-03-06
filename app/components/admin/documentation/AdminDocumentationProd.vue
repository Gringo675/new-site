<script setup>
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')

const state = reactive({
  cats: [],
  prods: [],
  activeCatId: null,
  rowSelection: {},
})

const { docState } = defineProps({
  docState: {
    type: Object,
  },
})

onMounted(async () => {
  //
  state.cats = await myFetch('/api/admin/cms/documentation/getMainCats')
})

const updateProds = async () => {
  if (!state.activeCatId) return
  state.prods = await myFetch('/api/admin/cms/documentation/getProds?cat_id=' + state.activeCatId)
}
watch(
  () => state.activeCatId,
  async newVal => {
    if (newVal) {
      await updateProds()
    }
  },
)

const columns = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        'aria-label': 'Select row',
      }),
  },
  {
    accessorKey: 'id',
    header: '№',
  },
  {
    accessorKey: 'name',
    header: 'Наименование',
  },
  {
    accessorKey: 'standarts',
    header: 'Стандарты',
  },
  {
    accessorKey: 'grsi',
    header: 'ГРСИ',
  },
  {
    accessorKey: 'pasp',
    header: 'Паспорта',
  },
  {
    accessorKey: 'actions',
    header: '',
  },
]

const formState = reactive({
  isOpen: false,
  id: undefined,
  name: '',
  standart_ids: [],
  reestr_ids: [],
  pasport_ids: [],
  isMassEdit: false,
  selectedIds: [],
})

const validate = state => {
  const errors = []
  return errors
}

const openForm = row => {
  formState.isOpen = true
  formState.id = row.id
  formState.name = row.name || ''
  formState.standart_ids = row.standart_ids ? row.standart_ids.split(',').filter(Boolean).map(Number) : []
  formState.reestr_ids = row.reestr_ids ? row.reestr_ids.split(',').filter(Boolean).map(Number) : []
  formState.pasport_ids = row.pasport_ids ? row.pasport_ids.split(',').filter(Boolean).map(Number) : []
}

const closeForm = () => {
  formState.isOpen = false
  formState.id = undefined
  formState.name = ''
  formState.standart_ids = []
  formState.reestr_ids = []
  formState.pasport_ids = []
  formState.isMassEdit = false
  formState.selectedIds = []
  state.rowSelection = {}
}

const findCommonDocuments = () => {
  const selectedProds = state.prods.filter(p => formState.selectedIds.includes(p.id))
  if (!selectedProds.length) return { standart_ids: [], reestr_ids: [], pasport_ids: [], allIdentical: true }

  const firstProd = selectedProds[0]
  const firstStandartIds = firstProd.standart_ids ? firstProd.standart_ids.split(',').filter(Boolean).map(Number) : []
  const firstReestrIds = firstProd.reestr_ids ? firstProd.reestr_ids.split(',').filter(Boolean).map(Number) : []
  const firstPasportIds = firstProd.pasport_ids ? firstProd.pasport_ids.split(',').filter(Boolean).map(Number) : []

  // Check if all products have identical docs
  const allIdentical = selectedProds.every(p => {
    const standartIds = p.standart_ids ? p.standart_ids.split(',').filter(Boolean).map(Number) : []
    const reestrIds = p.reestr_ids ? p.reestr_ids.split(',').filter(Boolean).map(Number) : []
    const pasportIds = p.pasport_ids ? p.pasport_ids.split(',').filter(Boolean).map(Number) : []
    return JSON.stringify(standartIds) === JSON.stringify(firstStandartIds) &&
      JSON.stringify(reestrIds) === JSON.stringify(firstReestrIds) &&
      JSON.stringify(pasportIds) === JSON.stringify(firstPasportIds)
  })

  // Find intersection of all document IDs
  const commonStandartIds = firstStandartIds.filter(id =>
    selectedProds.every(p => {
      const ids = p.standart_ids ? p.standart_ids.split(',').filter(Boolean).map(Number) : []
      return ids.includes(id)
    })
  )

  const commonReestrIds = firstReestrIds.filter(id =>
    selectedProds.every(p => {
      const ids = p.reestr_ids ? p.reestr_ids.split(',').filter(Boolean).map(Number) : []
      return ids.includes(id)
    })
  )

  const commonPasportIds = firstPasportIds.filter(id =>
    selectedProds.every(p => {
      const ids = p.pasport_ids ? p.pasport_ids.split(',').filter(Boolean).map(Number) : []
      return ids.includes(id)
    })
  )

  return { standart_ids: commonStandartIds, reestr_ids: commonReestrIds, pasport_ids: commonPasportIds, allIdentical }
}

const openMassEdit = async () => {
  const selectedIndices = Object.keys(state.rowSelection).map(Number)
  formState.selectedIds = selectedIndices.map(index => state.prods[index].id)
  formState.isMassEdit = true

  const { standart_ids, reestr_ids, pasport_ids, allIdentical } = findCommonDocuments()
  formState.standart_ids = standart_ids
  formState.reestr_ids = reestr_ids
  formState.pasport_ids = pasport_ids

  if (!allIdentical) {
    const proceed = await showMessage({
      title: 'Документы у выбранных товаров отличаются!',
      description: 'Будут оставлены только общие для всех документы. Продолжаем?',
      isDialog: true,
    })
    if (!proceed) {
      closeForm()
      return
    }
  }

  formState.isOpen = true
}

const submitForm = async () => {
  const currentStandartIds = formState.standart_ids.join(',')
  const currentReestrIds = formState.reestr_ids.join(',')
  const currentPasportIds = formState.pasport_ids.join(',')

  const productIds = formState.isMassEdit ? formState.selectedIds : [formState.id]

  for (const prodId of productIds) {
    const originalProduct = state.prods.find(p => p.id === prodId)
    if (!originalProduct) continue

    // Check if data has changed for this product
    const hasChanges =
      currentStandartIds !== (originalProduct.standart_ids || '') ||
      currentReestrIds !== (originalProduct.reestr_ids || '') ||
      currentPasportIds !== (originalProduct.pasport_ids || '')

    if (!hasChanges) continue

    const formData = new FormData()
    formData.append('id', prodId)
    formData.append('standart_ids', currentStandartIds)
    formData.append('reestr_ids', currentReestrIds)
    formData.append('pasport_ids', currentPasportIds)

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

const getDocNames = (ids, docs) => {
  if (!ids) return []
  const idArray = ids.split(',').filter(Boolean).map(Number)
  return idArray.map(id => ({ id, doc: docs.find(d => d.id === id) }))
}

const getDocById = (id, docs) => {
  return docs.find(d => d.id === id)
}

const getStandartOptions = computed(() => {
  return docState.stnd.map(s => ({ label: `${s.number} - ${s.name}`, value: s.id }))
})

const getRstrOptions = computed(() => {
  return docState.rstr.map(r => ({ label: `№${r.number} - ${r.name}`, value: r.id }))
})

const getPaspOptions = computed(() => {
  return docState.pasp.map(p => ({ label: p.name, value: p.id }))
})
</script>

<template>
  <div>
    <div class="flex items-center gap-4">
      <USelectMenu
        v-model="state.activeCatId"
        :items="state.cats"
        value-key="value"
        searchable
        placeholder="Выберите категорию"
        class="w-96" />
      <div
        v-if="state.prods.length"
        class="text-sm text-gray-600">
        Всего: {{ state.prods.length }} товаров
      </div>
      <UButton
        v-if="Object.keys(state.rowSelection).length"
        label="Изменить выбранные"
        color="neutral"
        @click="openMassEdit" />
    </div>
    <!-- <pre
      >{{ state.prods }}
    </pre> -->

    <UTable
      v-model:row-selection="state.rowSelection"
      :data="state.prods"
      :columns="columns"
      :ui="{
        th: 'text-center bg-gray-100',
        td: 'p-2',
        tr: 'hover:bg-gray-200',
      }">
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
          <template v-if="row.original.standart_ids">
            <template
              v-for="item in getDocNames(row.original.standart_ids, docState.stnd)"
              :key="item.id">
              <a
                v-if="item.doc"
                :href="`/static/doc/stnd/${encodeURIComponent(item.doc.file)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="block text-blue-600 hover:underline">
                {{ item.doc.number }}
              </a>
              <span
                v-else
                class="block text-red-600">
                Не найден (ID: {{ item.id }})
              </span>
            </template>
          </template>
          <span
            v-else
            class="text-gray-400"
            >—</span
          >
        </div>
      </template>
      <template #grsi-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <template v-if="row.original.reestr_ids">
            <template
              v-for="item in getDocNames(row.original.reestr_ids, docState.rstr)"
              :key="item.id">
              <a
                v-if="item.doc"
                :href="`/static/doc/rstr/${encodeURIComponent(item.doc.file_ot || item.doc.file_mp || item.doc.file_svid)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="block text-blue-600 hover:underline">
                №{{ item.doc.number }}
              </a>
              <span
                v-else
                class="block text-red-600">
                Не найден (ID: {{ item.id }})
              </span>
            </template>
          </template>
          <span
            v-else
            class="text-gray-400"
            >—</span
          >
        </div>
      </template>
      <template #pasp-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <template v-if="row.original.pasport_ids">
            <template
              v-for="item in getDocNames(row.original.pasport_ids, docState.pasp)"
              :key="item.id">
              <a
                v-if="item.doc"
                :href="`/static/doc/pasp/${encodeURIComponent(item.doc.file)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="block text-blue-600 hover:underline">
                {{ item.doc.name }}
              </a>
              <span
                v-else
                class="block text-red-600">
                Не найден (ID: {{ item.id }})
              </span>
            </template>
          </template>
          <span
            v-else
            class="text-gray-400"
            >—</span
          >
        </div>
      </template>
      <template #actions-cell="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-heroicons-pencil"
          @click="openForm(row.original)" />
      </template>
    </UTable>

    <UModal
      v-model:open="formState.isOpen"
      :title="formState.isMassEdit ? `Редактирование (${formState.selectedIds.length} товаров)` : 'Редактирование'"
      :dismissible="false"
      :ui="{
        content: 'max-w-xl',
      }">
      <template #body>
        <UForm
          :validate="validate"
          :state="formState"
          @submit="submitForm">
          <div class="space-y-4">
            <div v-if="!formState.isMassEdit">
              <div class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Наименование</div>
              <div class="text-gray-900 dark:text-gray-100">
                {{ formState.name }}
              </div>
            </div>

            <UFormField label="Стандарты">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="id in formState.standart_ids"
                  :key="id"
                  :color="docState.stnd.find(s => s.id === id) ? 'neutral' : 'error'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ docState.stnd.find(s => s.id === id)?.number || 'Не найден' }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.standart_ids = formState.standart_ids.filter(i => i !== id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.standart_ids"
                :items="getStandartOptions"
                value-key="value"
                multiple
                searchable
                placeholder="Добавить стандарты"
                class="w-full" />
            </UFormField>

            <UFormField label="ГРСИ (Реестры)">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="id in formState.reestr_ids"
                  :key="id"
                  :color="docState.rstr.find(r => r.id === id) ? 'neutral' : 'error'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ docState.rstr.find(r => r.id === id)?.number || 'Не найден' }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.reestr_ids = formState.reestr_ids.filter(i => i !== id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.reestr_ids"
                :items="getRstrOptions"
                value-key="value"
                multiple
                searchable
                placeholder="Добавить ГРСИ"
                class="w-full" />
            </UFormField>

            <UFormField label="Паспорта">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="id in formState.pasport_ids"
                  :key="id"
                  :color="docState.pasp.find(p => p.id === id) ? 'neutral' : 'error'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ docState.pasp.find(p => p.id === id)?.name || 'Не найден' }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.pasport_ids = formState.pasport_ids.filter(i => i !== id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.pasport_ids"
                :items="getPaspOptions"
                value-key="value"
                multiple
                searchable
                placeholder="Добавить паспорта"
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
