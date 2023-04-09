<script setup>
const aaa = reactive({
  a: 111,
  b: 222
})

const bbb = ref({
  c: 111,
  d: 222
})

const ccc = 'some text'

cv({aaa}, {bbb}, {ccc})
// cv(aaa, bbb, ccc)
</script>

<template>
  <div>
    <h1>Test1</h1>
  </div>
</template>

