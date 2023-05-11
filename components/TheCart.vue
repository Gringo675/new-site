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
  <button
    @click="navigateTo('/user/cart')"
    class="m-2 p-2 bg-orange-400 rounded-3xl"
  >
    Товаров: {{ cartItems }}
  </button>
</template>
