<script setup>
//
// const uploadedFile = ref()
// const fileChange = async event => {
//   console.log(`file name: ${JSON.stringify(event.target.files[0]?.name, null, 2)}`)
//   uploadedFile.value = event.target.files[0]

// await $fetch('/api/testFileUpload', {
//   method: 'post',
//   body: { file: event.target.files[0] },
//   headers: { 'Content-Type': 'multipart/form-data' },
// })

// const formData = new FormData()
// formData.append('file', event.target.files[0], 'somename.txt')
// await $fetch('/api/testFileUpload', {
//   method: 'post',
//   body: formData,
// })
// }
const checkFileSize = event => {
  const fileSize = event.target.files[0]?.size
  cv({ fileSize })

  if (fileSize > 5242880) {
    showNotice('Слишком большой файл!', 'error')
    event.target.value = ''
  }
}
const send = async () => {
  const form = document.forms[0]
  const formData = new FormData(form)

  await $fetch('/api/testFileUpload', {
    method: 'post',
    body: formData,
  })
}

// onMounted(() => {
//   document.getElementById('formElem').onsubmit = async e => {
//     console.log(`here`)
//     e.preventDefault()

//     const formElem = document.getElementById('formElem')
//     let response = await $fetch('/api/testFileUpload', {
//       method: 'POST',
//       body: new FormData(formElem),
//     })

//     // let result = await response.json()

//     // alert(result.message)
//   }
// })
</script>

<template>
  <h1>file uploader</h1>
  <!-- <div class="m-2 p-2">
    <input
      type="file"
      @change="fileChange"
    />
  </div> -->
  <button
    @click="send"
    class="button"
  >
    Send
  </button>
  <form>
    <input
      class="m-2 p-2"
      type="text"
      name="username"
      value="John"
    />
    <input
      type="file"
      name="userfile"
      @change="checkFileSize"
    />
  </form>
</template>
