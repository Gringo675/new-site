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
  <UButton
    v-if="productCartIndex === -1"
    label="В корзину"
    color="tertiary"
    variant="subtle"
    icon="i-heroicons-shopping-cart"
    @click="addProductToCart(prod)"
    block
    class=""
  />
  <div
    v-else
    class="flex items-center justify-center gap-1"
  >
    <UButton
      color="secondary"
      :icon="cart[productCartIndex].quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
      @click="--cart[productCartIndex].quantity"
      variant="outline"
    />
    <UInput
      color="secondary"
      highlight
      v-model.lazy="cart[productCartIndex].quantity"
      type="number"
      min="1"
      :ui="{
        base: 'text-center bg-indigo-50 focus:bg-gray-50',
      }"
    />
    <UButton
      color="secondary"
      icon="i-heroicons-plus-small-solid"
      @click="++cart[productCartIndex].quantity"
      variant="outline"
    />
  </div>
</template>
