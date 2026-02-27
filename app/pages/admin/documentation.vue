<script setup>
//
const state = reactive({
  // prods: [],
  stnd: [],
  pasp: [],
  rstr: [],
  // dbGR: [],
  // fgisGR: [],
  // getDbGR: async () => {
  //   state.dbGR = await $fetch('/api/admin/cms/documentation/getGrsi')
  // },
})

const updatePasp = async () => {
  state.pasp = await myFetch('/api/admin/cms/documentation/getPasp')
}
const updateRstr = async () => {
  state.rstr = await myFetch('/api/admin/cms/documentation/getRstr')
}

onMounted(async () => {
  await updatePasp()
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
const activeTab = ref('passports')
</script>

<template>
  <!-- content -->
  <div class="mb-8">
    <AdminDocumentationPasp
      v-show="activeTab === 'passports'"
      :pasp="state.pasp"
      @updatePasp="updatePasp" />
    <AdminDocumentationRSTR
      v-show="activeTab === 'rstr'"
      :rstr="state.rstr"
      @updateRstr="updateRstr" />
    <AdminDocumentationFGIS
      v-show="activeTab === 'fgis'"
      :dbRstr="state.rstr"
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

  <!-- <div>
    <UTabs
      :items="tabs"
      :default-value="'2'"
      class="w-full"
      :unmount-on-hide="false"
      :ui="{
        list: 'bg-indigo-100',
      }">
      <template #fgis>
        <AdminDocumentationFGIS :state="state" />
      </template>
      <template #grsi>
        <AdminDocumentationRSTR :state="state" />
      </template>
    </UTabs>
  </div> -->
</template>
