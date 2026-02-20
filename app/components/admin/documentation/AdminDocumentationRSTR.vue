<script setup>
//
const { state } = defineProps({
  state: Object,
})

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
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
]

onMounted(async () => {
  if (!state.dbGR.length) await state.getDbGR()
})
</script>

<template>
  <div>
    <div
      v-if="state.dbGR"
      class="mb-4 text-sm text-gray-600">
      Всего: {{ state.dbGR.length }} документов
    </div>

    <UTable
      :data="state.dbGR"
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
          {{ row.original.file_ot }}
        </div>
      </template>
      <template #file_mp-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          {{ row.original.file_mp }}
        </div>
      </template>
      <template #file_svid-cell="{ row }">
        <div class="max-w-xs wrap-break-word whitespace-normal">
          {{ row.original.file_svid }}
        </div>
      </template>
    </UTable>
  </div>
</template>
