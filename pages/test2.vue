<script setup>
//
const aaa = ref('vvv')

const onInput = async event => {
  await nextTick()
  // console.log(`aaa.value: ${JSON.stringify(aaa.value, null, 2)}`)
  // aaa.value += '!'
  // console.log(`aaa.value: ${JSON.stringify(aaa.value, null, 2)}`)
  aaa.value = event.target.value + '!'
}
</script>

<template>
  <UInput
    v-maska
    data-maska="### ###-##-##"
    class="m-10 w-36"
  />
  >
  <!-- <input
    v-focus
    class="m-10 px-2"
  /> -->
  <!-- <UInput
    :value="aaa"
    @input="onInput"
    class="w-36"
  />
  <div>{{ aaa }}</div> -->
</template>
