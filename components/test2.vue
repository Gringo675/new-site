<script setup>

const counter = useCounter()

counter.value = 88

</script>

<template>
  <div class="test2">
    TEST2
    <div>
      Counter: {{ counter }}
      <button @click="counter++">
        +
      </button>
      <button @click="counter--">
        -
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.test2 {
}
</style>