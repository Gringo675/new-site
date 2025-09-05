<script setup>
// импорт данных из старой БД в новую

const importHandler = async dataType => {
  const proceed = await showMessage({
    title: `Import ${dataType}?`,
    description: 'Are you sure you want to proceed? This operation rewrite current data in database.',
    type: 'info',
    isDialog: true,
  })
  if (!proceed) return

  const res = await myFetch(`/api/admin/dbImport/${dataType}`)
  if (res.status === 'ok') showNotice({ title: `${dataType} imported!`, type: 'success' })
  else if (res.status === 'error') {
    console.error(`${dataType} import error: ${JSON.stringify(res.message, null, 2)}`)
    showNotice({ title: `${dataType} import error!`, description: 'More info in console.', type: 'error' })
  }
}
</script>

<template>
  <HelperAdminOnly>
    <div class="flex space-x-4">
      <UButton
        label="Brands"
        @click="importHandler('brands')" />
      <UButton
        label="Properties"
        @click="importHandler('properties')" />
      <UButton
        label="Categories"
        @click="importHandler('categories')" />
      <UButton
        label="Products"
        @click="importHandler('products')" />
      <UButton
        label="Documentations"
        @click="importHandler('docs')" />
      <UButton
        label="Users"
        @click="importHandler('users')" />
      <UButton
        label="Set Product Labels"
        @click="importHandler('setProductLabels')" />
    </div>
  </HelperAdminOnly>
</template>
