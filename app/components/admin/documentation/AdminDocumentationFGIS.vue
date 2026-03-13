<script setup>
//
const emit = defineEmits(['updateRstr'])

const { dbRstr } = defineProps({
  dbRstr: Array,
})

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

const fgis = reactive([])
const activeDocs = computed(() => {
  if (!fgis.length) return []
  const startIdx = (currentPage.value - 1) * itemsPerPage.value
  const endIdx = startIdx + itemsPerPage.value
  return fgis.slice(startIdx, endIdx).map(doc => ({
    ...doc,
    inDB: dbRstr.some(dbDoc => dbDoc.number === doc.number),
  }))
})

const currentPage = ref(1)
const itemsPerPage = ref(20)
const docsContainer = ref(null)
watch(currentPage, () => {
  // Scroll to top of docs list
  docsContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  // console.log(`targetUrl: ${JSON.stringify(targetUrl, null, 2)}`)

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

  fgis.length = 0 // Clear previous results
  currentPage.value = 1
  for (const doc of responseData.response.docs) {
    try {
      const newDoc = parseFgisDoc(doc)
      fgis.push(newDoc)
    } catch (e) {
      showNotice({
        title: 'Ошибка обработки данных документа',
        description: `Документ с номером ${doc.number} имеет некорректные данные. Проверьте консоль для деталей.`,
        type: 'error',
      })
    }
  }
  if (fgis.length === 1000) {
    showNotice({
      title: 'Найдено более 1000 документов!',
      description: 'Пожалуйста, уточните параметры поиска.',
    })
  }
}

/**
 * Parses a raw FGIS document response into a structured document object
 * @param {Object} doc - Raw document from FGIS API response
 * @returns {Object} Parsed document with number, name, type_si, brand, date, file_ot, file_mp
 */
const parseFgisDoc = (doc, options = {}) => {
  //
  options.removeKRIN = options.removeKRIN || false

  const newDoc = {}
  const emptyValues = [null, undefined, '', 'Нет данных', 'Обозначение отсутствует']
  try {
    newDoc.number = doc.number
    newDoc.name = doc.title || ''

    newDoc.type_si = doc.j_notation ? JSON.parse(doc.j_notation).join(', ') : ''
    emptyValues.includes(newDoc.type_si) && (newDoc.type_si = '')

    newDoc.brand = doc.j_manufacturers
      ? JSON.parse(doc.j_manufacturers)
          .map(m => {
            m.title =
              options.removeKRIN && m.title.includes('КРИН')
                ? m.title
                    .split(';')
                    .filter(part => !part.includes('КРИН'))
                    .join('; ')
                : m.title
            return m.title + (m.country ? ` (${m.country})` : '') + (m.address ? ` ${m.address}` : '')
          })
          .join(', ')
      : ''
    emptyValues.includes(newDoc.brand) && (newDoc.brand = '')

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
    newDoc.file_ot =
      specifications.length > 0 && !emptyValues.includes(specifications[0].uuid) ? specifications[0] : undefined

    const methods = doc.j_methods
      ? JSON.parse(doc.j_methods).map(m => ({
          title: m.filename,
          uuid: m.doc_uuid,
        }))
      : []
    newDoc.file_mp = methods.length > 0 && !emptyValues.includes(methods[0].uuid) ? methods[0] : undefined
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
    throw e
  }
  return newDoc
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
  let proceed = await showMessage({
    title: 'Добавить документ в базу данных?',
    description: `Добавляем документ "${doc.number + ' ' + doc.name}". Продолжаем?`,
    isDialog: true,
  })
  if (!proceed) return

  if (process.env.NODE_ENV === 'development' && (doc.file_ot?.uuid || doc.file_mp?.uuid || doc.file_svid?.uuid)) {
    proceed = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файлы документа будут сохранены в локальную папку '.static'. В дальнейшем потребуется вручную скопировать их в папку 'static' на сервере. Продолжаем?`,
      isDialog: true,
    })
    if (!proceed) return
  }

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

    // Append all files with temp filenames
    if (fileOtBlob) {
      formData.append('files', fileOtBlob.blob, 'otFile.pdf')
    }
    if (fileMpBlob) {
      formData.append('files', fileMpBlob.blob, 'mpFile.pdf')
    }

    const response = await myFetch('/api/admin/cms/documentation/setRstr', {
      method: 'POST',
      payload: formData,
    })

    if (response) {
      showNotice({
        title: 'Документ добавлен в БД',
        description: `Документ ${doc.number} успешно добавлен в базу данных.`,
        type: 'success',
      })
      emit('updateRstr')
    } else {
      throw new Error('Failed to add document to database')
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

const refreshDBDocs = async () => {
  //
  let proceed = await showMessage({
    title: 'Подтвердите обновление',
    description: `Все существующие записи будут обновлены данными из ФГИС. Продолжить?`,
    isDialog: true,
  })
  if (!proceed) return

  if (process.env.NODE_ENV === 'development') {
    const devWarning = await showMessage({
      title: 'Вы работаете на локальном сервере!',
      description: `Файлы документов будут сохранены в локальную папку '.static'. В дальнейшем потребуется вручную скопировать их в папку 'static' на сервере. Продолжаем?`,
      isDialog: true,
    })
    if (!devWarning) return
  }

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const rst of dbRstr) {
    const url = `https://fgis.gost.ru/fundmetrology/cm/xcdb/mit24/get?q=number%3A${rst.number}%20AND%20is_actual%3Atrue&rows=2`
    const response = await myFetch('/api/admin/proxy', {
      method: 'POST',
      payload: {
        url: url,
      },
    })
    if (!response || !response.response || !response.response.docs || response.response.docs.length !== 1) {
      proceed = await showMessage({
        title: 'Что-то пошло не так при получении данных из ФГИС для документа №' + rst.number,
        description: `Пропустить этот документ и продолжить обновление других?`,
        type: 'error',
        isDialog: true,
      })
      if (!proceed) return
      else {
        skippedCount++
        continue
      }
    }

    const doc = response.response.docs[0]
    let newDoc
    try {
      newDoc = parseFgisDoc(doc, { removeKRIN: true })
    } catch (e) {
      console.error(`Error parsing document ${rst.number}:`, e)
      proceed = await showMessage({
        title: 'Ошибка обработки данных для документа №' + rst.number,
        description: `Пропустить этот документ и продолжить обновление других?`,
        type: 'error',
        isDialog: true,
      })
      if (!proceed) return
      else {
        errorCount++
        continue
      }
    }

    // Detect field changes
    const changedFields = []
    for (const key of ['number', 'name', 'type_si', 'brand', 'date']) {
      // Normalize dates for comparison to DD.MM.YYYY format (local timezone)
      let dbValue = rst[key]
      let newValue = newDoc[key]

      if (key === 'date' && dbValue) {
        // Convert ISO date to DD.MM.YYYY using local timezone
        dbValue = new Date(dbValue).toLocaleDateString('ru-RU')
      }

      // Treat null, undefined, and empty string as equal
      if (
        (dbValue === null || dbValue === undefined || dbValue === '') &&
        (newValue === null || newValue === undefined || newValue === '')
      ) {
        continue
      }

      if (dbValue !== newValue) {
        changedFields.push(key)
        console.log(`Document ${rst.number} field "${key}" will be updated from "${dbValue}" to "${newValue}"`)
      }
    }
    const hasFieldChanges = changedFields.length > 0

    // Detect file changes (add new files only, can't compare PDF content)
    const filesToAdd = []
    if (newDoc.file_ot && !rst.file_ot) {
      filesToAdd.push({ key: 'file_ot', ...newDoc.file_ot })
      console.log(
        `Document ${rst.number} file "file_ot" will be added: "${newDoc.file_ot.title}" (uuid: ${newDoc.file_ot.uuid})`,
      )
    }
    if (newDoc.file_mp && !rst.file_mp) {
      filesToAdd.push({ key: 'file_mp', ...newDoc.file_mp })
      console.log(
        `Document ${rst.number} file "file_mp" will be added: "${newDoc.file_mp.title}" (uuid: ${newDoc.file_mp.uuid})`,
      )
    }

    // Skip if no changes
    if (!hasFieldChanges && filesToAdd.length === 0) {
      continue
    }

    try {
      // Download new files
      let fileOtBlob = null
      let fileMpBlob = null

      if (filesToAdd.find(f => f.key === 'file_ot')) {
        const fileData = filesToAdd.find(f => f.key === 'file_ot')
        fileOtBlob = await downloadFileAsBlob(fileData.uuid)
      }
      if (filesToAdd.find(f => f.key === 'file_mp')) {
        const fileData = filesToAdd.find(f => f.key === 'file_mp')
        fileMpBlob = await downloadFileAsBlob(fileData.uuid)
      }

      // Prepare FormData
      const formData = new FormData()
      formData.append('id', rst.id)
      formData.append('number', newDoc.number)
      formData.append('name', newDoc.name)
      formData.append('type_si', newDoc.type_si)
      formData.append('brand', newDoc.brand)
      // Convert date from DD.MM.YYYY to YYYY-MM-DD for MySQL
      const dateForDb = newDoc.date ? newDoc.date.split('.').reverse().join('-') : ''
      formData.append('date', dateForDb)

      // Append files with temp filenames
      if (fileOtBlob) {
        formData.append('files', fileOtBlob.blob, 'otFile.pdf')
      }
      if (fileMpBlob) {
        formData.append('files', fileMpBlob.blob, 'mpFile.pdf')
      }

      // Call API to update
      const result = await myFetch('/api/admin/cms/documentation/setRstr', {
        method: 'POST',
        payload: formData,
      })

      if (result) {
        updatedCount++
        console.log(`Document ${rst.number} updated successfully`)
      } else {
        throw new Error('Failed to update document')
      }
    } catch (error) {
      console.error(`Error updating document ${rst.number}:`, error)
      errorCount++
      proceed = await showMessage({
        title: 'Ошибка обновления документа №' + rst.number,
        description: `${error.message}. Продолжить обновление остальных документов?`,
        type: 'error',
        isDialog: true,
      })
      if (!proceed) return
    }

    // Rate limiting: pause 500ms between documents
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Show summary
  let summaryMessage = `Обновлено: ${updatedCount}`
  if (skippedCount > 0) summaryMessage += `, пропущено: ${skippedCount}`
  if (errorCount > 0) summaryMessage += `, ошибок: ${errorCount}`
  summaryMessage += '. Подробности в консоли.'

  showNotice({
    title: 'Обновление завершено',
    description: summaryMessage,
    type: updatedCount > 0 ? 'success' : 'info',
  })

  if (updatedCount > 0) {
    emit('updateRstr')
  }
}

defineExpose({
  refreshDBDocs,
})
</script>

<template>
  <div>
    <div class="flex justify-between">
      <UForm
        :state="filterState"
        @submit="onFilterSubmit"
        class="flex items-end gap-4">
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
        <UButton
          icon="i-lucide-search"
          label="Поиск"
          type="submit" />
      </UForm>
      <div class="flex items-end justify-end gap-4">
        <div
          v-if="fgis.length"
          class="text-sm text-gray-600">
          Найдено записей: {{ fgis.length }}
        </div>
        <USelect
          v-model="itemsPerPage"
          :items="[20, 50, 100, 500]"
          variant="outline"
          class="w-20" />
      </div>
    </div>

    <div ref="docsContainer">
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
        class="py-4">
        <template #number-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              v-if="!row.original.inDB"
              icon="i-heroicons-plus"
              title="Добавить в базу данных"
              variant="outline"
              size="xs"
              class="rounded-full p-0"
              @click="addDocToDB(row.original)" />
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
    </div>

    <div
      v-if="fgis.length > itemsPerPage"
      class="mt-6 flex justify-center">
      <UPagination
        v-model:page="currentPage"
        :items-per-page="itemsPerPage"
        :total="fgis.length"
        show-edges />
    </div>
  </div>
</template>
