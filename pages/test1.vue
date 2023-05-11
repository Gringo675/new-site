<script setup lang="ts">
type Person = {
  age: number
}

const aaa = ref({} as Person)
aaa.value.age = 111
</script>

<template>
  <h1>Test1</h1>
  <div>{{ aaa.age }}</div>
</template>
