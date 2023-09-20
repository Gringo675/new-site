<script setup>
//
const aaa = 2
const bbb = reactive([4, 6])
const ccc = computed(() => bbb.map(val => val * aaa))
const ddd = reactive([6, 7])
const eee = reactive([
  { a: 2, b: 3 },
  { a: 4, b: 5, c: [4, 5, 6] },
])
cv(eee)

// const fff = unref(eee)
// cv(fff[1])

const test = () => {
  bbb.push(8)
  ddd.push(8)
}
</script>

<template>
  <h1>test</h1>
  <div>
    <button
      class="button"
      @click="test"
    >
      test
    </button>
  </div>
  <TheTest
    :ccc="ccc"
    :ddd="ddd"
  />
</template>
