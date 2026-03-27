<script setup>
//
const route = useRoute()
const router = useRouter()

const activeTab = computed({
  get: () => route.hash.replace('#', '') || 'prods',
  set: value => {
    router.push({ path: route.path, hash: `#${value}` })
  },
})

const tabs = [
  {
    label: 'Товары',
    value: 'prods',
  },
  {
    label: 'Поставщики',
    value: 'vendors',
  },
  {
    label: 'Параметры',
    value: 'props',
  },
  {
    label: 'Бренды',
    value: 'brands',
  },
  {
    label: 'Лейблы',
    value: 'labels',
  },
]

const sharedState = shallowReactive({
  props: [],
  brands: [],
  labels: [],
  vendors: [],
})

const updateProps = async () => {
  sharedState.props = await myFetch('/api/admin/cms/getProps')
}
const updateBrands = async () => {
  sharedState.brands = await myFetch('/api/admin/cms/getBrands')
}
const updateLabels = async () => {
  sharedState.labels = await myFetch('/api/admin/cms/getLabels')
}
onMounted(async () => {
  // await updateProps()
  // await updateBrands()
  // await updateLabels()
})
</script>

<template>
  <div class="h-full pb-7">
    <!-- content -->
    <AdminProdsProd
      id="prods"
      v-show="activeTab === 'prods'"
      :shared-state="sharedState" />
    <AdminProdsVendors
      id="vendors"
      v-show="activeTab === 'vendors'"
      :vendors="sharedState.vendors" />
    <AdminProdsProps
      id="props"
      v-show="activeTab === 'props'"
      :props="sharedState.props" />
    <AdminProdsBrands
      id="brands"
      v-show="activeTab === 'brands'"
      :brands="sharedState.brands" />
    <AdminProdsLabels
      id="labels"
      v-show="activeTab === 'labels'"
      :labels="sharedState.labels" />
    <!-- tabs -->
    <div class="fixed right-0 bottom-0 left-0 border-t border-gray-300 bg-gray-200">
      <UTabs
        v-model="activeTab"
        :content="false"
        :items="tabs"
        color="neutral"
        variant="link"
        size="xs"
        class="" />
    </div>
  </div>
</template>
