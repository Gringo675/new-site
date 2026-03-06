<script setup>
//
const docState = reactive({
  stnd: [],
  pasp: [],
  rstr: [],
})

// const updateProds = async () => {
//   state.prods = await myFetch('/api/admin/cms/documentation/getProds')
// }
const updatePasp = async () => {
  docState.pasp = await myFetch('/api/admin/cms/documentation/getPasp')
}
const updateStnd = async () => {
  docState.stnd = await myFetch('/api/admin/cms/documentation/getStnd')
}
const updateRstr = async () => {
  docState.rstr = await myFetch('/api/admin/cms/documentation/getRstr')
}

onMounted(async () => {
  // await updateProds()
  await updatePasp()
  await updateStnd()
  await updateRstr()
})

const tabs = [
  {
    label: 'Товары',
    value: 'products',
  },
  {
    label: 'Стандарты',
    value: 'standards',
  },
  {
    label: 'Паспорта',
    value: 'passports',
  },
  {
    label: 'Реестры',
    value: 'rstr',
  },
  {
    label: 'ФГИС',
    value: 'fgis',
  },
]
const activeTab = ref('products')
</script>

<template>
  <!-- content -->
  <div class="mb-8">
    <AdminDocumentationProd
      v-show="activeTab === 'products'"
      :doc-state="docState" />
    <AdminDocumentationStnd
      v-show="activeTab === 'standards'"
      :stnd="docState.stnd"
      @updateStnd="updateStnd" />
    <AdminDocumentationPasp
      v-show="activeTab === 'passports'"
      :pasp="docState.pasp"
      @updatePasp="updatePasp" />
    <AdminDocumentationRSTR
      v-show="activeTab === 'rstr'"
      :rstr="docState.rstr"
      @updateRstr="updateRstr" />
    <AdminDocumentationFGIS
      v-show="activeTab === 'fgis'"
      :dbRstr="docState.rstr"
      @updateRstr="updateRstr" />
  </div>
  <!-- tabs -->
  <div class="fixed right-0 bottom-0 left-0 z-20 border-t border-gray-300 bg-gray-200">
    <UTabs
      v-model="activeTab"
      :content="false"
      :items="tabs"
      color="neutral"
      variant="link"
      size="xs"
      class="" />
  </div>
</template>
