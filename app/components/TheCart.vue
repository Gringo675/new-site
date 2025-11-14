<script setup>
//
const cart = useCart()

onMounted(() => {
  updateCartFromLocalStore()
  window.addEventListener('storage', event => {
    if (event.storageArea !== localStorage || event.key !== 'CART') return
    updateCartFromLocalStore()
  })
})

watch(cart, () => {
  const zeroIndex = cart.findIndex(item => Number(item.quantity) === 0)
  if (zeroIndex === -1) setCartToLocalStore()
  else cart.splice(zeroIndex, 1) // запустит watcher еще раз
})

const cartQuantity = computed(() => cart.reduce((acc, item) => acc + item.quantity, 0))
</script>

<template>
  <ClientOnly>
    <UButton
      icon="i-heroicons-shopping-cart"
      size="md"
      class="rounded-full"
      to="/user/cart">
      {{ cartQuantity }}
    </UButton>
    <template #fallback>
      <UButton
        icon="i-heroicons-shopping-cart"
        size="md"
        class="rounded-full"
        to="/user/cart"
        disabled>
        0
      </UButton>
    </template>
  </ClientOnly>
</template>
