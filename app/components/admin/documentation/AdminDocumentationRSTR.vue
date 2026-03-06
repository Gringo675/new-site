<script setup>
const emit = defineEmits(['updateRstr'])

const { rstr } = defineProps({
  rstr: {
    type: Array,
    default: () => [],
  },
})

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
    accessorKey: 'type_si',
    header: 'Тип СИ',
  },
  {
    accessorKey: 'brand',
    header: 'Производитель',
  },
  {
    accessorKey: 'date',
    header: 'Срок до',
  },
  {
    accessorKey: 'file_ot',
    header: 'Описание типа',
  },
  {
    accessorKey: 'file_mp',
    header: 'Методика поверки',
  },
  {
    accessorKey: 'file_svid',
    header: 'Свидетельство',
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
  type_si: '',
  brand: '',
  date: '',
  file_ot: undefined,
  file_mp: undefined,
  file_svid: undefined,
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
  formState.type_si = row.type_si || ''
  formState.brand = row.brand || ''
  formState.date = row.date ? new Date(row.date).toISOString().split('T')[0] : ''
  formState.file_ot = undefined
  formState.file_mp = undefined
  formState.file_svid = undefined
}

const closeForm = () => {
  formState.isOpen = false
  formState.id = undefined
  formState.number = ''
  formState.name = ''
  formState.type_si = ''
  formState.brand = ''
  formState.date = ''
  formState.file_ot = undefined
  formState.file_mp = undefined
  formState.file_svid = undefined
}

const submitForm = async () => {
  const formData = new FormData()
  formData.append('id', formState.id)
  formData.append('number', formState.number)
  formData.append('name', formState.name)
  formData.append('type_si', formState.type_si)
  formData.append('brand', formState.brand)
  formData.append('date', formState.date)
  if (process.env.NODE_ENV === 'development' && (formState.file_ot || formState.file_mp || formState.file_svid)) {
    const proceed = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файлы документа будут сохранены в локальную папку '.static'. В дальнейшем потребуется вручную скопировать их в папку 'static' на сервере. Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return

    if (formState.file_ot) {
      formData.append('files', formState.file_ot, 'otFile.pdf')
    }
    if (formState.file_mp) {
      formData.append('files', formState.file_mp, 'mpFile.pdf')
    }
    if (formState.file_svid) {
      formData.append('files', formState.file_svid, 'svFile.pdf')
    }
  }

  const success = await myFetch('/api/admin/cms/documentation/setRstr', {
    method: 'post',
    payload: formData,
  })

  if (success) {
    showNotice({
      title: 'Данные сохранены',
      type: 'success',
    })
    closeForm()
    emit('updateRstr')
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
    description: `Запись №${item.number} "${item.name}" будет удалена. Продолжить?`,
    isDialog: true,
  })
  if (!proceed) return
  if (process.env.NODE_ENV === 'development' && (item.file_ot || item.file_mp || item.file_svid)) {
    const proceed = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файлы документа не будут удалены на продакшене. Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return
  }

  const formData = new FormData()
  formData.append('id', item.id)
  if (item.file_ot) formData.append('fileName_ot', item.file_ot)
  if (item.file_mp) formData.append('fileName_mp', item.file_mp)
  if (item.file_svid) formData.append('fileName_svid', item.file_svid)
  formData.append('delete', true)
  const success = await myFetch('/api/admin/cms/documentation/setRstr', {
    method: 'post',
    payload: formData,
  })
  if (success) {
    showNotice({ title: 'Запись удалена', type: 'success' })
    emit('updateRstr')
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
        label="Добавить запись"
        @click="openForm({ id: null, number: '', name: '', type_si: '', brand: '', date: '' })" />
      <div
        v-if="rstr"
        class="text-sm text-gray-600">
        Всего: {{ rstr.length }} документов
      </div>
      <div class="flex grow justify-end">
        <UButton
          label="Обновить данные"
          @click="" />
      </div>
    </div>

    <UTable
      :data="rstr"
      :columns="columns"
      :ui="{
        th: 'text-center bg-gray-100',
        td: 'p-2',
        tr: 'hover:bg-gray-200',
      }">
      <template #name-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          {{ row.original.name }}
        </div>
      </template>
      <template #type_si-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          {{ row.original.type_si }}
        </div>
      </template>
      <template #brand-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          {{ row.original.brand }}
        </div>
      </template>
      <template #date-cell="{ row }">
        <div v-if="row.original.date">
          {{ new Date(row.original.date).toLocaleDateString('ru-RU') }}
        </div>
      </template>
      <template #file_ot-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          <a
            v-if="row.original.file_ot"
            :href="`/static/doc/rstr/${encodeURIComponent(row.original.file_ot)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline">
            {{ row.original.file_ot }}
          </a>
        </div>
      </template>
      <template #file_mp-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          <a
            v-if="row.original.file_mp"
            :href="`/static/doc/rstr/${encodeURIComponent(row.original.file_mp)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline">
            {{ row.original.file_mp }}
          </a>
        </div>
      </template>
      <template #file_svid-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          <a
            v-if="row.original.file_svid"
            :href="`/static/doc/rstr/${encodeURIComponent(row.original.file_svid)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline">
            {{ row.original.file_svid }}
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

            <UFormField label="Тип СИ">
              <UInput
                v-model="formState.type_si"
                placeholder="Введите тип СИ"
                class="w-full" />
            </UFormField>

            <UFormField label="Производитель">
              <UInput
                v-model="formState.brand"
                placeholder="Введите производителя"
                class="w-full" />
            </UFormField>

            <UFormField label="Срок до">
              <UInput
                v-model="formState.date"
                type="date"
                class="w-full" />
            </UFormField>

            <UFormField label="Описание типа (только для замены)">
              <UFileUpload
                position="inside"
                layout="list"
                label="Click or drop the file here"
                description="Only PDF allowed"
                accept=".pdf"
                v-model="formState.file_ot"
                color="neutral"
                highlight
                class="w-full"
                :ui="{
                  base: 'min-h-24',
                }" />
            </UFormField>

            <UFormField label="Методика поверки (только для замены)">
              <UFileUpload
                position="inside"
                layout="list"
                label="Click or drop the file here"
                description="Only PDF allowed"
                accept=".pdf"
                v-model="formState.file_mp"
                color="neutral"
                highlight
                class="w-full"
                :ui="{
                  base: 'min-h-24',
                }" />
            </UFormField>

            <UFormField label="Свидетельство (только для замены)">
              <UFileUpload
                position="inside"
                layout="list"
                label="Click or drop the file here"
                description="Only PDF allowed"
                accept=".pdf"
                v-model="formState.file_svid"
                color="neutral"
                highlight
                class="w-full"
                :ui="{
                  base: 'min-h-24',
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
