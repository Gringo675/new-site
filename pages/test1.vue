<script setup>
//
const showTheTest = ref(false)

const TheTestData = reactive({
  sum1: null,
  sum2: null,
  f1: null,
})

const someAction = async () => {
  await TheTestData.f1()
  console.log(`after someAction`)
}
</script>

<template>
  <button
    class="button"
    @click="showTheTest = !showTheTest"
  >
    show
  </button>
  <LazyTheTest
    v-if="showTheTest"
    @set-sum1="value => (TheTestData.sum1 = value)"
    @set-sum2="value => (TheTestData.sum2 = value)"
    @set-f1="value => (TheTestData.f1 = value)"
  />
  <p>from parent sum1: {{ TheTestData.sum1 }}</p>
  <p>from parent sum2: {{ TheTestData.sum2 }}</p>
  <button
    class="button"
    @click="someAction"
  >
    OK
  </button>
</template>
