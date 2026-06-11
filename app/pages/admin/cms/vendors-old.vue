<script setup>
//
const route = useRoute()
const router = useRouter()

const tabs = [
  {
    label: 'Товары',
    value: 'products',
  },
  {
    label: 'ЧИЗ',
    value: 'chiz',
  },
  {
    label: 'Кибер',
    value: 'kiber',
  },
]
const activeTab = computed({
  get: () => route.hash.replace('#', '') || 'products',
  set: value => {
    router.push({ path: route.path, hash: `#${value}` })
  },
})

const vendors = shallowRef({
  chiz: [],
  kiber: [],
})
const updateVendors = async () => {
  vendors.value = await myFetch('/api/admin/cms/vendors/getVendors')
}
onMounted(async () => {
  await updateVendors()
})
</script>

<template>
  <div class="h-full pb-7">
    <!-- content -->
    <AdminVendorsProds v-show="activeTab === 'products'" />
    <AdminVendorsBrand
      v-show="activeTab === 'chiz'"
      :items="vendors.chiz" />
    <AdminVendorsBrand
      v-show="activeTab === 'kiber'"
      :items="vendors.kiber" />
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
