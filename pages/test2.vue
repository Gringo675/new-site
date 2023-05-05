<script setup>
// throw new Error('some///')
// const v = null
// console.log(v.toString())

const f1 = async () => {
  f2()
}
const f2 = async () => {
  throw createError({ statusCode: 418, statusMessage: `Some error` })
}
</script>

<template>
  <div>test 2</div>
  <div>
    <button
      @click="f1"
      class="button"
    >
      test11
    </button>
  </div>
</template>
