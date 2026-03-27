<script setup>
//
const route = useRoute()
const router = useRouter()

const fgisRef = useTemplateRef('fgis')

const docState = shallowReactive({
  stnd: [],
  pasp: [],
  rstr: [],
})

const standardsSearch = ref('')
const passportsSearch = ref('')
const rstrSearch = ref('')

const activeTab = computed({
  get: () => route.hash.replace('#', '') || 'products',
  set: value => {
    router.push({ path: route.path, hash: `#${value}` })
  },
})

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
</script>

<template>
  <!-- content -->
  <div class="pb-7">
    <AdminDocumentationProd
      id="products"
      v-show="activeTab === 'products'"
      :doc-state="docState"
      @navigateToDoc="navigateToDoc" />
    <AdminDocumentationStnd
      id="standards"
      v-show="activeTab === 'standards'"
      :stnd="docState.stnd"
      :search="standardsSearch"
      @updateStnd="updateStnd" />
    <AdminDocumentationPasp
      id="passports"
      v-show="activeTab === 'passports'"
      :pasp="docState.pasp"
      :search="passportsSearch"
      @updatePasp="updatePasp" />
    <AdminDocumentationRSTR
      id="rstr"
      v-show="activeTab === 'rstr'"
      :rstr="docState.rstr"
      :search="rstrSearch"
      @updateRstr="updateRstr"
      @refreshDB="fgisRef?.refreshDBDocs()" />
    <AdminDocumentationFGIS
      id="fgis"
      ref="fgis"
      v-show="activeTab === 'fgis'"
      :dbRstr="docState.rstr"
      @updateRstr="updateRstr" />
  </div>
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
</template>
