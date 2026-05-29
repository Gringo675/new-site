<script setup lang="ts">
const items = ref(['aaabbb', ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'], ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']])
const value = ref('Apple')
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    class="w-48" />
</template>
