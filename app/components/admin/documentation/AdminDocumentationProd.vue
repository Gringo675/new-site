<script setup>
import { form } from '#build/ui'
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')

const emit = defineEmits(['navigateToDoc'])

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

onMounted(async () => {
  //
  state.cats = await myFetch('/api/admin/cms/documentation/getMainCats')
})

const updateProds = async () => {
  //
  if (!state.activeCatId) return
  const prods = await myFetch('/api/admin/cms/documentation/getProds?cat_id=' + state.activeCatId)
  state.prods = prods.map(p => {
    const standarts = p.standart_ids
      ? p.standart_ids.split(',').map(id => docState.stnd.find(s => s.id === Number(id)) || { id, error: true })
      : []
    const reestrs = p.reestr_ids
      ? p.reestr_ids.split(',').map(id => docState.rstr.find(r => r.id === Number(id)) || { id, error: true })
      : []
    const pasports = p.pasport_ids
      ? p.pasport_ids.split(',').map(id => docState.pasp.find(pa => pa.id === Number(id)) || { id, error: true })
      : []
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

const editProd = prod => {
  formState.isOpen = true
  formState.prods = [prod]
  formState.standarts = prod.standarts
  formState.reestrs = prod.reestrs
  formState.pasports = prod.pasports
}

const editMassProds = async () => {
  //
  const selectedIndices = Object.keys(state.rowSelection).map(Number)
  if (!selectedIndices.length) return

  formState.prods = selectedIndices.map(index => state.prods[index])

  const firstProd = formState.prods[0]

  // Check if all products have identical docs (compare arrays using cached IDs)
  const allIdentical = formState.prods.every(
    p =>
      p.standarts.length === firstProd.standarts.length &&
      p.standarts.every(s => firstProd.standarts.includes(s)) &&
      p.reestrs.length === firstProd.reestrs.length &&
      p.reestrs.every(r => firstProd.reestrs.includes(r)) &&
      p.pasports.length === firstProd.pasports.length &&
      p.pasports.every(pa => firstProd.pasports.includes(pa)),
  )

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
    formState.standarts = firstProd.standarts
    formState.reestrs = firstProd.reestrs
    formState.pasports = firstProd.pasports
  } else {
    // error documents will be excluded
    const commonStandarts = formState.prods.reduce((common, prod) => {
      return common.filter(s => prod.standarts.some(ps => ps === s))
    }, formState.prods[0].standarts)

    const commonReestrs = formState.prods.reduce((common, prod) => {
      return common.filter(r => prod.reestrs.some(pr => pr === r))
    }, formState.prods[0].reestrs)

    const commonPasports = formState.prods.reduce((common, prod) => {
      return common.filter(pa => prod.pasports.some(pp => pp === pa))
    }, formState.prods[0].pasports)

    formState.standarts = commonStandarts
    formState.reestrs = commonReestrs
    formState.pasports = commonPasports
  }

  formState.isOpen = true
}

const saveProds = async () => {
  // check for errors first
  if (
    formState.standarts.some(s => s.error) ||
    formState.reestrs.some(r => r.error) ||
    formState.pasports.some(p => p.error)
  ) {
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
    formData.append('standart_ids', formState.standarts.map(s => s.id).join(','))
    formData.append('reestr_ids', formState.reestrs.map(r => r.id).join(','))
    formData.append('pasport_ids', formState.pasports.map(p => p.id).join(','))

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
      <UButton
        label="Группа"
        title="Редактировать выбранные товары"
        icon="i-heroicons-pencil-square"
        :disabled="!Object.keys(state.rowSelection).length"
        variant="outline"
        @click="editMassProds" />
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
      <div
        v-if="state.prods.length"
        class="text-sm text-gray-600">
        Всего: {{ state.prods.length }} товаров
      </div>

      <UInput
        v-model="state.globalFilter"
        placeholder="Filter..."
        icon="i-lucide-filter"
        class="w-64"
        type="search" />
    </div>

    <UTable
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

            <UFormField label="Стандарты">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="stnd in formState.standarts"
                  :key="stnd.id"
                  :color="stnd.error ? 'error' : 'neutral'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ stnd.error ? `Не найден (ID: ${stnd.id})` : stnd.number }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.standarts = formState.standarts.filter(i => i.id !== stnd.id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.standarts"
                :items="docState.stnd.map(s => ({ label: `${s.number} - ${s.name}`, value: s }))"
                value-key="value"
                multiple
                :search-input="{
                  placeholder: 'Filter...',
                  icon: 'i-lucide-filter',
                  type: 'search',
                }"
                placeholder="Добавить стандарты"
                class="w-full" />
            </UFormField>
            <UFormField label="ГРСИ (Реестры)">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="rstr in formState.reestrs"
                  :key="rstr.id"
                  :color="rstr.error ? 'error' : 'neutral'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ rstr.error ? `Не найден (ID: ${rstr.id})` : `№${rstr.number}` }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.reestrs = formState.reestrs.filter(i => i.id !== rstr.id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.reestrs"
                :items="docState.rstr.map(r => ({ label: `№${r.number} - ${r.name}`, value: r }))"
                value-key="value"
                multiple
                :search-input="{
                  placeholder: 'Filter...',
                  icon: 'i-lucide-filter',
                  type: 'search',
                }"
                placeholder="Добавить ГРСИ"
                class="w-full" />
            </UFormField>
            <UFormField label="Паспорта">
              <div class="mb-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="pasp in formState.pasports"
                  :key="pasp.id"
                  :color="pasp.error ? 'error' : 'neutral'"
                  variant="subtle"
                  class="flex items-center gap-1">
                  {{ pasp.error ? `Не найден (ID: ${pasp.id})` : pasp.name }}
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    class="p-0"
                    @click="formState.pasports = formState.pasports.filter(i => i.id !== pasp.id)" />
                </UBadge>
              </div>
              <USelectMenu
                v-model="formState.pasports"
                :items="docState.pasp.map(p => ({ label: p.name, value: p }))"
                value-key="value"
                multiple
                :search-input="{
                  placeholder: 'Filter...',
                  icon: 'i-lucide-filter',
                  type: 'search',
                }"
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
