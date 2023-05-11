vue
<script setup>
//
const cart = useCart()
const user = useUser().value

const showUserProfile = ref(false)

const createOrder = () => {
  if (!user.auth) {
    user.showLogin = true
    const unwatch = watch(
      () => user.showLogin,
      () => {
        nextTick(() => unwatch()) // watch only once
        if (user.auth) showUserProfile.value = true
      }
    )
  } else showUserProfile.value = true
}
</script>

<template>
  <h1>Cart</h1>
  <div v-if="!cart.length">Корзина пуста!</div>
  <!-- products wrapper -->
  <div
    v-else
    class="flex flex-col border-2 border-emerald-400 rounded m-2 p-2"
  >
    <!-- product -->
    <div
      v-for="(cartProduct, cartIndex) in cart"
      class="flex border border-teal-300"
    >
      <div class="px-2">{{ cartProduct.id }}</div>
      <div class="px-2">{{ cartProduct.name }}</div>
      <div class="px-2">{{ cartProduct.quantity }} шт.</div>
      <div class="px-2">{{ cartProduct.price }} р.</div>
      <button
        class="m-2 px-2 rounded-md bg-teal-400"
        @click="changeCartQuantity(cartIndex, 0)"
      >
        Delete
      </button>
    </div>
  </div>
  <TheUserProfile
    v-if="showUserProfile"
    :from-cart="true"
  />
  <div v-else>
    <button
      class="button"
      @click="createOrder"
    >
      Оформить заказ
    </button>
  </div>
</template>
