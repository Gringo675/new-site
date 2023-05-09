<script setup>
//
const cart = useCart()

await updateCartFromLocalStore()

window.addEventListener('storage', event => {
  if (event.storageArea !== localStorage || event.key !== 'CART') return
  updateCartFromLocalStore()
})

const cartItems = computed(() => cart.reduce((acc, item) => acc + item.quantity, 0))
</script>

<template>
  <div>{{ cartItems }}</div>
</template>
