<script setup>
//

const changed = ref(false)

onMounted(() => {
  const beforeUnloadHandler = event => {
    if (!changed.value) return

    // Recommended
    event.preventDefault()

    // Included for legacy support, e.g. Chrome/Edge < 119
    event.returnValue = true
  }

  window.addEventListener('beforeunload', beforeUnloadHandler)
})
</script>

<template>
  <UButton @click="changed = !changed">change</UButton>
  <div>changed: {{ changed }}</div>
  <div>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus, officia repellendus non, doloremque numquam
    cupiditate ab dicta quo ut, debitis recusandae in distinctio quidem quae! Velit quo hic aperiam debitis?Lorem ipsum
    dolor sit amet consectetur, adipisicing elit. Nulla quibusdam rerum, corrupti voluptatum illo aliquam nam dolore
    quaerat voluptatem vero repellat adipisci error est, consequuntur quam recusandae doloribus perferendis qui?lorem
  </div>
</template>
