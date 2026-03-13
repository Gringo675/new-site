<script setup>
//
const fgisRef = useTemplateRef('fgis')

const docState = shallowReactive({
  stnd: [],
  pasp: [],
  rstr: [],
})

const standardsSearch = ref('')
const passportsSearch = ref('')
const rstrSearch = ref('')

const navigateToDoc = ({ type, searchText }) => {
  // Reset all searches
  standardsSearch.value = ''
  passportsSearch.value = ''
  rstrSearch.value = ''

  // Switch to target tab
  activeTab.value = type

  // Set search to find the document by its display text
  if (type === 'standards') {
    standardsSearch.value = searchText
  } else if (type === 'rstr') {
    rstrSearch.value = searchText
  } else if (type === 'passports') {
    passportsSearch.value = searchText
  }
}

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
      :doc-state="docState"
      @navigateToDoc="navigateToDoc" />
    <AdminDocumentationStnd
      v-show="activeTab === 'standards'"
      :stnd="docState.stnd"
      :search="standardsSearch"
      @updateStnd="updateStnd" />
    <AdminDocumentationPasp
      v-show="activeTab === 'passports'"
      :pasp="docState.pasp"
      :search="passportsSearch"
      @updatePasp="updatePasp" />
    <AdminDocumentationRSTR
      v-show="activeTab === 'rstr'"
      :rstr="docState.rstr"
      :search="rstrSearch"
      @updateRstr="updateRstr"
      @refreshDB="fgisRef?.refreshDBDocs()" />
    <AdminDocumentationFGIS
      ref="fgis"
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
