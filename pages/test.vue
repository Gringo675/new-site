<script setup>

// console.log(`start: ${new Date().getTime()}`);
// const [cats, props] = await Promise.all([$fetch('/api/getCategories'), $fetch('/api/getProperties')])
// console.log(`end: ${new Date().getTime()}`);

// const counter3 = useCounter3()
// console.log(`${new Date().getTime()} counter3: ${JSON.stringify(counter3.value)}`);


const counter = useCounter()
// initCounter()
const showTest2 = ref(false)
</script>

<template>
  <div class="test">
    TEST
    <div>
      Counter: {{ counter }}
      <button @click="counter++">
        +
      </button>
      <button @click="counter--">
        -
      </button>
    </div>
    <div>
      <button @click="showTest2 = !showTest2">showTest2?</button>
    </div>
    <div>
      <test2 v-if="showTest2"/>
    </div>
  </div>
</template>

<style lang="scss">
.test {
}
</style>