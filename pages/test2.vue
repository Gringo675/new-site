<script setup>

const error = ref(true)
const data = ref ({})
// try {
//
//   const someF = () => {
//     try {
//       throw new Error('Some Error.')
//     } catch (e) {
//       console.log(`from inner catch`)
//       console.log(`e: ${JSON.stringify(e.message, null, 2)}`)
//       pushError(e)
//     }
//   }
//   const pushError = (e) => {
//     console.log(`from pushError`)
//     throw new Error(e.message)
//   }
//   someF()
// } catch (e) {
//   console.log(`from outer catch`)
//   console.log(`e: ${JSON.stringify(e.message, null, 2)}`)
//
// }
</script>

<template>
  <div>
    <h1>Test2</h1>
    <div v-if="!error">
      No error
      <CatalogWrapper :data="data"/>
    </div>
  </div>

</template>