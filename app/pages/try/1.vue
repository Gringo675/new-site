<template>
  <div class="flex flex-col gap-8 p-10">
    <h1 class="text-2xl font-bold">UTable DnD Isolation Test</h1>

    <div class="flex gap-10">
      <!-- Source Table (Using UTable with Manual Drag to bypass interference) -->
      <div class="flex w-[40%] flex-col gap-1">
        <h2 class="mb-2 font-semibold">Vendor EANs (Source)</h2>
        <UTable
          :data="sourceData"
          :columns="sourceColumns"
          class="w-full">
          <template #tr-data="{ row }">
            <tr class="transition-colors hover:bg-gray-100">
              <td
                v-for="col in sourceColumns"
                :key="col.accessorKey"
                class="border-b p-2">
                <div
                  v-if="col.accessorKey === 'ean'"
                  class="inline-block cursor-grab select-none"
                  @mousedown="startManualDrag($event, row.original?.ean || row.ean)">
                  {{ row.original?.ean || row.ean }}
                </div>
                <div v-else>{{ row.original?.[col.accessorKey] || row[col.accessorKey] }}</div>
              </td>
            </tr>
          </template>
        </UTable>
      </div>

      <!-- Destination Table -->
      <div class="flex w-[40%] flex-col gap-1">
        <h2 class="mb-2 font-semibold">Product Rows (Destination)</h2>
        <UTable
          :data="destData"
          :columns="destColumns"
          class="w-full">
          <template #tr-data="{ row }">
            <tr
              @dragover="onDragOver($event, row.original.id)"
              @dragleave="onDragLeave($event, row.original.id)"
              @drop="onDrop($event, row.original.id)"
              :class="['transition-colors hover:bg-gray-100', dragOverProductId === row.original.id ? 'bg-blue-100 ring-2 ring-blue-400' : '']">
              <td
                v-for="col in destColumns"
                :key="col.accessorKey"
                class="border-b p-2">
                <CellRenderer
                  :col="col"
                  :row="row" />
              </td>
            </tr>
          </template>
        </UTable>
      </div>
    </div>

    <div
      v-if="isDragging"
      :style="{
        position: 'fixed',
        left: `${ghostPos.x}px`,
        top: `${ghostPos.y}px`,
        pointerEvents: 'none',
        zIndex: 9999,
      }"
      class="rounded bg-blue-500 px-2 py-1 text-sm font-medium whitespace-nowrap text-white shadow-lg">
      {{ draggedEan }}
    </div>

    <div class="mt-10 rounded bg-gray-100 p-4 font-mono text-sm">
      <h3 class="mb-2 font-bold">State Log:</h3>
      <p>Dragged EAN: {{ draggedEan || 'None' }}</p>
      <p>Hovering Product ID: {{ dragOverProductId || 'None' }}</p>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

// --- State ---
const sourceData = ref([
  { ean: '1234567890123', name: 'Vendor A' },
  { ean: '9876543210987', name: 'Vendor B' },
  { ean: '1122334455667', name: 'Vendor C' },
])

const destData = ref([
  { id: 1, name: 'Product A', eans: [] },
  { id: 2, name: 'Product B', eans: [] },
  { id: 3, name: 'Product C', eans: [] },
])

const draggedEan = ref(null)
const dragOverProductId = ref(null)

// --- Columns ---
const sourceColumns = [
  {
    accessorKey: 'ean',
    label: 'EAN',
    cell: ({ row }) => {
      const ean = row.original.ean
      return h(
        'div',
        {
          class: 'cursor-grab select-none inline-block',
        },
        ean,
      )
    },
  },
  { accessorKey: 'name', label: 'Vendor Name' },
]

const destColumns = [
  { accessorKey: 'name', label: 'Product Name' },
  {
    accessorKey: 'eans',
    label: 'EANs',
    cell: ({ row }) => row.original.eans.join(', '),
  },
]

onMounted(() => {
  window.addEventListener(
    'mousedown',
    e => {
      if (e.target instanceof HTMLElement && e.target.getAttribute('draggable') === 'true') {
        console.log('[Isolation] 🛡️ Capture-phase shield active for:', e.target)
        e.stopPropagation()
      }
    },
    true,
  )
})

// --- Cell Renderer (needed for #tr-data) ---
const CellRenderer = {
  props: ['col', 'row'],
  setup(props) {
    return () => {
      if (props.col.cell) {
        return props.col.cell({ row: props.row })
      }
      return props.row.original[props.col.accessorKey]
    }
  },
}

// --- DnD Handlers ---
function onDragStart(e, ean) {
  console.log('[Isolation] 🚀 DragStart fired', { ean })
  draggedEan.value = ean
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', ean)
}

function onDragOver(e, id) {
  console.log('[Isolation] 🔄 DragOver fired', { id })
  e.preventDefault()
  dragOverProductId.value = id
  e.dataTransfer.dropEffect = 'move'
}

function onDragLeave(e, id) {
  console.log('[Isolation] ↩️ DragLeave fired', { id })
  dragOverProductId.value = null
}

async function onDrop(e, id) {
  console.log('[Isolation] 🎯 Drop event fired', { id })
  e.preventDefault()
  dragOverProductId.value = null

  const ean = e.dataTransfer.getData('text/plain')
  console.log('[Isolation] 📦 Retrieved EAN:', ean)

  if (!ean) return

  const prod = destData.value.find(p => p.id === id)
  if (prod && !prod.eans.includes(ean)) {
    prod.eans.push(ean)
  }
}
</script>
