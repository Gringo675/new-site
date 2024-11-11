<script setup>
//
const onClick = async () => {
  const result = await showMessage({
    title: 'Test2',
    description: 'Test2',
    type: 'info',
    // isDialog: true,
    preventClose: true,
  })

  console.log(`result: ${JSON.stringify(result, null, 2)}`)
}
</script>

<template>
  <h2>Test2</h2>
  <div>
    <UButton
      label="Test"
      @click="onClick"
    />
  </div>
</template>
