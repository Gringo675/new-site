<script setup>
const emit = defineEmits(['updateStnd'])

const props = defineProps({
  stnd: {
    type: Array,
    default: () => [],
  },
  search: {
    type: String,
    default: '',
  },
})

const globalFilter = ref('')

watch(
  () => props.search,
  newSearch => {
    globalFilter.value = newSearch
  },
)

const columns = [
  {
    accessorKey: 'number',
    header: 'Номер',
  },
  {
    accessorKey: 'name',
    header: 'Наименование',
  },
  {
    accessorKey: 'file',
    header: 'Файл',
  },
  {
    accessorKey: 'actions',
    header: '',
  },
]

const formState = reactive({
  isOpen: false,
  id: undefined,
  number: '',
  name: '',
  file: undefined,
})

const validate = state => {
  const errors = []
  if (!state.number?.trim()) {
    errors.push({ name: 'number', message: 'Введите номер' })
  }
  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Введите наименование' })
  }
  return errors
}

const openForm = row => {
  formState.isOpen = true
  formState.id = row.id
  formState.number = row.number || ''
  formState.name = row.name || ''
  formState.file = undefined
}

const closeForm = () => {
  formState.isOpen = false
  formState.id = undefined
  formState.number = ''
  formState.name = ''
  formState.file = undefined
}

const submitForm = async () => {
  const formData = new FormData()
  formData.append('id', formState.id)
  formData.append('number', formState.number)
  formData.append('name', formState.name)
  if (process.env.NODE_ENV === 'development' && formState.file) {
    const proceed = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файлы документа будут сохранены в локальную папку '.static'. В дальнейшем потребуется вручную скопировать их в папку 'static' на сервере. Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return
  }

  if (formState.file) {
    formData.append('files', formState.file)
  }

  const success = await myFetch('/api/admin/cms/documentation/setStnd', {
    method: 'post',
    payload: formData,
  })

  if (success) {
    showNotice({
      title: 'Данные сохранены',
      type: 'success',
    })
    closeForm()
    emit('updateStnd')
  } else {
    showNotice({
      title: 'Ошибка при сохранении!',
      type: 'error',
    })
  }
}

const deleteItem = async item => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: `Стандарт №${item.number} "${item.name}" будет удален. Продолжить?`,
    isDialog: true,
  })
  if (!proceed) return
  if (process.env.NODE_ENV === 'development' && item.file) {
    const proceed = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файл документа не будет удален на продакшене. Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return
  }

  const formData = new FormData()
  formData.append('id', item.id)
  formData.append('fileName', item.file)
  formData.append('delete', true)
  const success = await myFetch('/api/admin/cms/documentation/setStnd', {
    method: 'post',
    payload: formData,
  })
  if (success) {
    showNotice({ title: 'Стандарт удален', type: 'success' })
    emit('updateStnd')
  } else {
    showNotice({ title: 'Ошибка при удалении!', type: 'error' })
  }
}

const getActionsItems = row => [
  [
    {
      label: 'Редактировать',
      icon: 'i-heroicons-pencil',
      onClick: () => openForm(row),
    },
  ],
  [
    {
      label: 'Удалить',
      color: 'error',
      icon: 'i-heroicons-trash',
      onClick: () => deleteItem(row),
    },
  ],
]
</script>

<template>
  <div>
    <div class="flex items-center gap-4">
      <UButton
        label="Добавить стандарт"
        @click="openForm({ id: null, number: '', name: '' })" />
      <div
        v-if="stnd"
        class="text-sm text-gray-600">
        Всего документов: {{ stnd.length }}
      </div>
      <UInput
        v-model="globalFilter"
        :placeholder="'Filter...'"
        :icon="'i-lucide-filter'"
        type="search"
        class="w-64" />
    </div>

    <UTable
      :data="stnd"
      :columns="columns"
      v-model:global-filter="globalFilter"
      class="my-4"
      :ui="{
        th: 'text-center bg-gray-100',
        td: 'p-2',
        tr: 'hover:bg-gray-200',
      }">
      <template #number-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          {{ row.original.number }}
        </div>
      </template>
      <template #name-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          {{ row.original.name }}
        </div>
      </template>
      <template #file-cell="{ row }">
        <div class="wrap-break-word whitespace-normal">
          <a
            v-if="row.original.file"
            :href="`/static/doc/stnd/${encodeURIComponent(row.original.file)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline">
            {{ row.original.file }}
          </a>
        </div>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu
          :items="getActionsItems(row.original)"
          :ui="{ content: 'w-48' }">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-heroicons-ellipsis-vertical" />
        </UDropdownMenu>
      </template>
    </UTable>

    <UModal
      v-model:open="formState.isOpen"
      title="Редактирование"
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
            <UFormField
              label="Номер"
              name="number">
              <UInput
                v-model="formState.number"
                placeholder="Введите номер"
                class="w-full" />
            </UFormField>

            <UFormField
              label="Наименование"
              name="name">
              <UInput
                v-model="formState.name"
                placeholder="Введите наименование"
                class="w-full" />
            </UFormField>

            <UFormField label="Файл (только для замены существующего)">
              <UFileUpload
                position="inside"
                layout="list"
                label="Click or drop the file here"
                description="Only PDF allowed"
                accept=".pdf"
                v-model="formState.file"
                color="neutral"
                highlight
                class="w-full"
                :ui="{
                  base: 'min-h-32',
                }" />
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
