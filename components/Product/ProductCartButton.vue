<script setup>
//
const props = defineProps({
  prod: Object,
})
const prod = props.prod

const cart = useCart()
const productCartIndex = computed(() => cart.findIndex(cartItem => cartItem.id === prod.id))
</script>

<template>
  <div v-if="productCartIndex === -1">
    <button
      class="m-2 px-2 py-1 bg-indigo-300 rounded-md"
      @click="addProductToCart(prod)"
    >
      To cart
    </button>
  </div>
  <div
    v-else
    class="flex flex-col items-center border-2 border-lime-400 rounded-md w-36"
  >
    <div>
      <button
        class="m-2 px-2 bg-indigo-300 rounded-full"
        @click="--cart[productCartIndex].quantity"
      >
        -
      </button>
      <input
        v-model.lazy="cart[productCartIndex].quantity"
        type="number"
        class="w-12"
      />
      <button
        class="m-2 px-2 bg-indigo-300 rounded-full"
        @click="++cart[productCartIndex].quantity"
      >
        +
      </button>
    </div>
    <div>
      <NuxtLink
        :to="'/user/cart'"
        title="Перейти в корзину"
        >В корзине</NuxtLink
      >
    </div>
  </div>
</template>
