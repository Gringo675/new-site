<script setup>

// const counter2 = useState('counter', () => Math.round(Math.random() * 1000))

const counter = useState('counter')
</script>

<template>
  <div class="AdminCatsParamsBlock">
    AdminCatsParamsBlock
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
.AdminCatsParamsBlock {
}
</style>