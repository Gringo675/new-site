<script setup>
//
import { h } from 'vue'
const table = useTemplateRef('table')

const products = ref([])
const getProducts = async () => {
  const rawProducts = await myFetch('/api/admin/cms/prices/getProducts')
  products.value = rawProducts.map(p => {
    if (!p.name) return p
    const nameParts = p.name.split(' ')
    const brand = nameParts.pop()
    const name = nameParts.join(' ')
    return { ...p, name, brand }
  })
}
await getProducts()
console.log(`products.value: ${JSON.stringify(products.value, null, 2)}`)

const columns = [
  {
    accessorKey: 'id',
    header: 'артикул',
    meta: {
      class: {
        th: 'w-10',
        td: '',
      },
    },
  },
  {
    accessorKey: 'name',
    header: 'наименование',
    meta: {
      class: {
        th: 'w-20',
        td: 'max-w-10',
      },
    },
  },
  {
    accessorKey: 'brand',
    header: 'брэнд',
    meta: {
      class: {
        th: 'w-32',
        td: '',
      },
    },
  },
  {
    accessorKey: 'price',
    header: 'цена',
    meta: {
      class: {
        th: 'w-24',
        td: '',
      },
    },
  },
  {
    accessorKey: 'stock',
    header: 'наличие',
    meta: {
      class: {
        th: 'w-24',
        td: '',
      },
    },
  },
  {
    accessorKey: 'vendor_stock',
    header: 'нал пост',
    meta: {
      class: {
        th: 'w-24',
        td: '',
      },
    },
  },
  {
    accessorKey: 'vendor_price',
    header: 'цена пост',
    meta: {
      class: {
        th: 'w-24',
        td: '',
      },
    },
  },
]
</script>

<template>
  <div>aaa</div>
  <UTable
    ref="table"
    :data="products"
    :columns="columns" />
</template>
