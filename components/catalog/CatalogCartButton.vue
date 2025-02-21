<script setup lang="ts">
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
    <UButton
      label="В корзину"
      variant="outline"
      icon="i-heroicons-shopping-cart"
      @click="addProductToCart(prod)"
    />
  </div>
  <div v-else>
    <UButton
      :icon="cart[productCartIndex].quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
      @click="--cart[productCartIndex].quantity"
      variant="outline"
      color="secondary"
    />
    <UInput
      v-model.lazy="cart[productCartIndex].quantity"
      type="number"
      min="1"
      inputClass="w-12 text-center"
    />
    <UButton
      icon="i-heroicons-plus-small-solid"
      @click="++cart[productCartIndex].quantity"
      variant="outline"
      color="secondary"
    />
    <!-- <button
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
    </button> -->
  </div>
</template>
