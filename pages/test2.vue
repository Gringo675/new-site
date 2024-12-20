<script setup>
//
const state = {
  x: 111,
  getX() {
    console.log(`x: ${this.x}`)
  },
}
</script>

<template>
  <h1>Test 2</h1>
  <div>
    <UButton
      label="Test"
      @click="state.getX()"
    />
    <UInput
      @click="state.getX()"
      @input="state.getX"
    />
  </div>
</template>
