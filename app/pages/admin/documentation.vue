<script setup>
import { reactive } from 'vue'
//
const grDocs = ref(null)

const filterState = reactive({
  number: '',
  title: '',
  notation: '',
  manufacturers: '',
})

const onFilterSubmit = async () => {
  const grsiUrl = 'https://fgis.gost.ru/fundmetrology/cm/xcdb/mit24/get'
  const queryParts = []

  for (const key in filterState) {
    if (filterState[key]) {
      queryParts.push(`${key}:*${filterState[key]}*`)
    }
  }

  let queryString = ''
  if (queryParts.length > 0) {
    const qValue = queryParts.join(' AND ') // Join with AND
    queryString = `q=${encodeURIComponent(qValue)}`
  }

  const targetUrl = `${grsiUrl}?${queryString}`
  console.log(`targetUrl: ${JSON.stringify(targetUrl, null, 2)}`)

  try {
    const data = await $fetch('/api/admin/proxy', {
      method: 'POST',
      body: {
        url: targetUrl,
      },
    })
    grDocs.value = data
  } catch (error) {
    console.error('Error fetching through proxy:', error)
    grDocs.value = { error: 'Failed to fetch data' }
  }
}
</script>

<template>
  <h1 class="mb-4 text-2xl font-bold">Документация</h1>
  <h2 class="">ГРСИ</h2>
  <UForm
    :state="filterState"
    @submit="onFilterSubmit">
    <div class="flex items-end gap-4">
      <UFormField
        label="Номер"
        name="number"
        class="w-full">
        <UInput v-model="filterState.number" />
      </UFormField>
      <UFormField
        label="Наименование"
        name="title"
        class="w-full">
        <UInput v-model="filterState.title" />
      </UFormField>
      <UFormField
        label="Обозначение"
        name="notation"
        class="w-full">
        <UInput v-model="filterState.notation" />
      </UFormField>
      <UFormField
        label="Производитель"
        name="manufacturers"
        class="w-full">
        <UInput v-model="filterState.manufacturers" />
      </UFormField>
      <UButton type="submit"> Применить </UButton>
    </div>
  </UForm>
  <div class="">grDocs {{ grDocs }}</div>
</template>
