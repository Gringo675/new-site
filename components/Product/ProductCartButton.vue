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
  <div class="">
    <UButton
      v-if="productCartIndex === -1"
      label="Добавить в корзину"
      icon="i-heroicons-shopping-cart"
      @click="addProductToCart(prod)"
      class=""
      block
      size="xl"
    />
    <div
      v-else
      class="flex gap-1"
    >
      <UButton
        :icon="cart[productCartIndex].quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
        size="xl"
        @click="--cart[productCartIndex].quantity"
        variant="outline"
      />
      <UInput
        v-model.lazy="cart[productCartIndex].quantity"
        size="xl"
        type="number"
        min="1"
        inputClass="w-12 px-1 text-center"
      />
      <UButton
        icon="i-heroicons-plus-small-solid"
        size="xl"
        @click="++cart[productCartIndex].quantity"
        variant="outline"
      />
      <UButton
        class="flex-grow flex-col items-center py-0.5"
        to="/user/cart"
      >
        <div class="font-semibold">В корзине</div>
        <div class="text-xs">Перейти</div>
      </UButton>
    </div>
  </div>
</template>
