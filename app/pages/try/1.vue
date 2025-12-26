<script setup>
//
onMounted(async () => {
  const logs = await $fetch('http://localhost:3000/api/admin/log/getLog')
  console.log(`logs[1]: ${JSON.stringify(logs[1], null, 2)}`)

  const urls = []
  const errors = logs.filter(log => log.error === 1)
  for (const err of errors) {
    const obj = JSON.parse(err.text)
    if (obj.statusCode === 404) {
      urls.push(obj.url)
    }
  }
  console.log(`404 urls: ${JSON.stringify(urls, null, 2)}`)
})
</script>

<template>
  <div>Try page 1</div>
</template>
