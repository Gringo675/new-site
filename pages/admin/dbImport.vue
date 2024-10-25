<script setup>
// импорт данных из старой БД в новую

const importHandler = async dataType => {
  const res = await myFetch(`/api/admin/oldDbImport/${dataType}`)
  console.log(`res: ${JSON.stringify(res, null, 2)}`)
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
        @click="importHandler('brands')"
      />
      <UButton
        label="Properties"
        @click="importHandler('properties')"
      />
      <UButton
        label="Categories"
        @click="importHandler('categories')"
      />
      <UButton
        label="Products"
        @click="importHandler('products')"
      />
      <UButton
        label="Documentations"
        @click="importHandler('docs')"
      />
    </div>
  </HelperAdminOnly>
</template>
