<script setup>
//
const uploadedFile = ref()
const fileChange = async event => {
  console.log(`file name: ${JSON.stringify(event.target.files[0]?.name, null, 2)}`)
  uploadedFile.value = event.target.files[0]

  // await $fetch('/api/testFileUpload', {
  //   method: 'post',
  //   body: { file: event.target.files[0] },
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // })

  const formData = new FormData()
  formData.append('file', event.target.files[0])
  await $fetch('/api/testFileUpload', {
    method: 'post',
    body: formData,
  })
}
</script>

<template>
  <h1>file uploader</h1>
  <div class="m-2 p-2">
    <input
      type="file"
      @change="fileChange"
    />
  </div>
</template>
