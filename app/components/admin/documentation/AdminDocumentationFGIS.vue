<script setup>
//
const { state } = defineProps({
  state: Object,
})
const currentPage = ref(1)
const itemsPerPage = ref(20)

const filterState = reactive({
  number: '',
  title: '',
  notation: '',
  manufacturers: '',
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
    header: 'Обозначение',
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
]

const activeDocs = computed(() => {
  if (!state.fgisGR.length) return []
  const startIdx = (currentPage.value - 1) * itemsPerPage.value
  const endIdx = startIdx + itemsPerPage.value
  return state.fgisGR.slice(startIdx, endIdx)
})

const docsContainer = ref(null)

onMounted(async () => {
  if (!state.dbGR.length) await state.getDbGR()
})

watch(currentPage, () => {
  // Scroll to top of docs list
  if (docsContainer.value) {
    docsContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

watch(itemsPerPage, () => {
  // Reset to page 1 when items per page changes
  currentPage.value = 1
})

const onFilterSubmit = async () => {
  const grsiUrl = 'https://fgis.gost.ru/fundmetrology/cm/xcdb/mit24/get'

  // Escape special characters for FGIS API query
  const escapeQuery = str => str.replace(/(["\\])/g, '\\$1')

  const qValue = Object.entries(filterState)
    .filter(([, value]) => value)
    .flatMap(([key, value]) =>
      value
        .trim()
        .split(/\s+/)
        .map(word => `${key}:*${escapeQuery(word)}*`),
    )
    .concat('is_actual:true')
    .join(' AND ')

  if (!qValue) {
    showNotice({
      title: 'Фильтр не заполнен!',
      description: 'Пожалуйста, заполните хотя бы одно поле для поиска.',
      type: 'error',
    })
    return
  }
  const queryString = `q=${encodeURIComponent(qValue)}`
  const targetUrl = `${grsiUrl}?${queryString}&rows=1000`
  console.log(`targetUrl: ${JSON.stringify(targetUrl, null, 2)}`)

  let responseData
  try {
    responseData = await myFetch('/api/admin/proxy', {
      method: 'POST',
      payload: {
        url: targetUrl,
      },
    })

    if (!responseData || typeof responseData !== 'object' || responseData.responseHeader.status !== 0) {
      throw new Error('Something went wrong...')
    }
  } catch (error) {
    console.error('Error fetching GRSI:', error)
    showNotice({
      title: 'Ошибка при загрузке данных',
      description: error.message,
      type: 'error',
    })
    return
  }

  state.fgisGR.length = 0 // Clear previous results
  currentPage.value = 1
  for (const doc of responseData.response.docs) {
    const newDoc = {}
    try {
      newDoc.number = doc.number || ''
      newDoc.name = doc.title || ''
      newDoc.type_si = doc.j_notation ? JSON.parse(doc.j_notation).join(', ') : ''

      newDoc.brand = doc.j_manufacturers
        ? JSON.parse(doc.j_manufacturers)
            .map(m => m.title + (m.country ? ` (${m.country})` : '') + (m.address ? ` ${m.address}` : ''))
            .join(', ')
        : ''

      newDoc.date = doc.valid_to ? new Date(doc.valid_to).toLocaleDateString('ru-RU') : ''

      /**
       * В ГРСИ у документа может быть несколько спецификаций и методов испытаний.
       * В наших документах пока таково не встречал, поэтому просто берем первый из списка.
       * В будущем возможно придется реализовать поддержку нескольких документов.
       */
      const specifications = doc.j_specifications
        ? JSON.parse(doc.j_specifications).map(s => ({
            title: s.filename,
            uuid: s.doc_uuid,
          }))
        : []
      newDoc.file_ot = specifications.length > 0 ? specifications[0] : undefined

      const methods = doc.j_methods
        ? JSON.parse(doc.j_methods).map(m => ({
            title: m.filename,
            uuid: m.doc_uuid,
          }))
        : []
      newDoc.file_mp = methods.length > 0 ? methods[0] : undefined

      // Check if document already exists in our DB by number
      newDoc.inDB = state.dbGR.some(dbDoc => dbDoc.number === newDoc.number)
    } catch (e) {
      console.error('Error processing document fields:', e)
      // Log all raw JSON fields for debugging
      console.info('Raw doc fields:', {
        j_notation: doc.j_notation,
        j_manufacturers: doc.j_manufacturers,
        valid_to: doc.valid_to,
        j_specifications: doc.j_specifications,
        j_methods: doc.j_methods,
      })
      showNotice({
        title: 'Ошибка обработки данных документа',
        description: `Документ с номером ${doc.number} имеет некорректные данные. Проверьте консоль для деталей.`,
        type: 'error',
      })
    }

    state.fgisGR.push(newDoc)
  }
  if (state.fgisGR.length === 1000) {
    showNotice({
      title: 'Найдено более 1000 документов!',
      description: 'Пожалуйста, уточните параметры поиска.',
    })
  }
}

const downloadFileAsBlob = async uuid => {
  if (!uuid) return null

  const targetUrl = `https://fgis.gost.ru/fundmetrology/cm/iaux/docs/${uuid}`

  const data = await myFetch('/api/admin/proxy', {
    method: 'POST',
    payload: {
      url: targetUrl,
    },
  })

  if (!data || !data.doc || !data.filename || !data.mimetype) {
    throw new Error('Invalid file data received from proxy')
  }

  // Decode Base64 to Blob
  const byteCharacters = atob(data.doc)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: data.mimetype })

  return { blob, filename: data.filename, mimetype: data.mimetype }
}

const downloadFile = async uuid => {
  if (!uuid) return

  try {
    const fileData = await downloadFileAsBlob(uuid)

    // Create a link and trigger the download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(fileData.blob)
    link.download = fileData.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error downloading file:', error)
    showNotice({
      title: 'Ошибка загрузки файла',
      description: error.message,
      type: 'error',
    })
  }
}

const addDocToDB = async doc => {
  try {
    // Download files if present
    let fileOtBlob = null
    let fileMpBlob = null

    if (doc.file_ot?.uuid) {
      fileOtBlob = await downloadFileAsBlob(doc.file_ot.uuid)
    }
    if (doc.file_mp?.uuid) {
      fileMpBlob = await downloadFileAsBlob(doc.file_mp.uuid)
    }

    // Create FormData and append all fields
    const formData = new FormData()
    formData.append('number', doc.number)
    formData.append('name', doc.name)
    formData.append('type_si', doc.type_si)
    formData.append('brand', doc.brand)
    formData.append('date', doc.date)

    // Append all files under 'files' field name
    if (fileOtBlob) {
      formData.append('files', fileOtBlob.blob, fileOtBlob.filename)
    }
    if (fileMpBlob) {
      formData.append('files', fileMpBlob.blob, fileMpBlob.filename)
    }

    const response = await myFetch('/api/admin/cms/documentation/setGrsi', {
      method: 'POST',
      payload: formData,
    })

    if (response && response.success) {
      showNotice({
        title: 'Документ добавлен в БД',
        description: `Документ ${doc.number} успешно добавлен в базу данных.`,
        type: 'success',
      })
      // Update the inDB flag for this document
      const index = state.fgisGR.findIndex(d => d.number === doc.number)
      if (index !== -1) {
        state.fgisGR[index].inDB = true
      }
      // Add the new document to dbGR list
      state.dbGR.push({
        number: doc.number,
        name: doc.name,
        type_si: doc.type_si,
        brand: doc.brand,
        date: doc.date,
        file_ot: doc.file_ot,
        file_mp: doc.file_mp,
      })
    } else {
      showNotice({
        title: 'Ошибка добавления документа',
        description: response?.message || 'Не удалось добавить документ в базу данных.',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error adding document to DB:', error)
    showNotice({
      title: 'Ошибка добавления документа',
      description: error.message,
      type: 'error',
    })
  }
}
</script>

<template>
  <div>
    <UForm
      :state="filterState"
      @submit="onFilterSubmit"
      class="mb-4 flex items-end gap-4">
      <UFormField
        label="Номер"
        name="number"
        class="w-full">
        <UInput
          v-model="filterState.number"
          type="search" />
      </UFormField>
      <UFormField
        label="Наименование"
        name="title"
        class="w-full">
        <UInput
          v-model="filterState.title"
          type="search" />
      </UFormField>
      <UFormField
        label="Обозначение"
        name="notation"
        class="w-full">
        <UInput
          v-model="filterState.notation"
          type="search" />
      </UFormField>
      <UFormField
        label="Производитель"
        name="manufacturers"
        class="w-full">
        <UInput
          v-model="filterState.manufacturers"
          type="search" />
      </UFormField>
      <UButton type="submit"> Применить </UButton>
    </UForm>
    <div
      ref="docsContainer"
      class="mb-4 flex items-center justify-end gap-4">
      <div
        v-if="state.fgisGR.length"
        class="text-sm text-gray-600">
        Всего: {{ state.fgisGR.length }} документов
      </div>
      <USelect
        v-model="itemsPerPage"
        :items="[20, 50, 100, 500]"
        color="primary"
        variant="outline"
        class="w-20" />
    </div>
    <UTable
      :data="activeDocs"
      :columns="columns"
      :meta="{
        class: {
          tr: row => (row.original.inDB ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-200'),
        },
      }"
      :ui="{
        th: 'text-center bg-gray-100',
        td: 'p-2',
      }"
      class="">
      <template #number-cell="{ row }">
        <div class="flex items-center gap-2">
          <button
            v-if="!row.original.inDB"
            class="rounded-full border-green-200 bg-green-50 p-0.5 text-lg text-green-600 hover:text-green-800"
            @click="addDocToDB(row.original)">
            +
          </button>
          <span>{{ row.original.number }}</span>
        </div>
      </template>
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
      <template #file_ot-cell="{ row }">
        <a
          v-if="row.original.file_ot"
          href="#"
          @click.prevent="downloadFile(row.original.file_ot.uuid)"
          class="text-blue-600 underline hover:text-blue-800">
          {{ row.original.file_ot.title }}
        </a>
      </template>
      <template #file_mp-cell="{ row }">
        <a
          v-if="row.original.file_mp"
          href="#"
          @click.prevent="downloadFile(row.original.file_mp.uuid)"
          class="text-blue-600 underline hover:text-blue-800">
          {{ row.original.file_mp.title }}
        </a>
      </template>
    </UTable>
    <div
      v-if="state.fgisGR.length > itemsPerPage"
      class="mt-6 flex justify-center">
      <UPagination
        v-model:page="currentPage"
        :items-per-page="itemsPerPage"
        :total="state.fgisGR.length"
        show-edges />
    </div>
  </div>
</template>
