<script setup>
//

const { prps, editPrps } = useProperties()

const showEditor = () => {
  editPrps('p0_brand', 'custom Name', [2], { multiple: true })
}
</script>

<template>
  <div>
    <UButton
      label="Edit"
      @click="showEditor" />
  </div>
  <!-- <pre>{{ prps }}</pre> -->
</template>
