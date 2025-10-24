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
  <ClientOnly>
    <div class="">
      <UButton
        v-if="productCartIndex === -1"
        label="Добавить в корзину"
        icon="i-heroicons-shopping-cart"
        @click="addProductToCart(prod)"
        class=""
        block
        size="xl" />
      <div
        v-else
        class="flex items-center justify-center gap-1">
        <UButton
          color="secondary"
          :icon="cart[productCartIndex].quantity === 1 ? 'i-heroicons-trash' : 'i-heroicons-minus-small-solid'"
          size="xl"
          @click="--cart[productCartIndex].quantity"
          variant="outline"
          aria-label="Убавить" />
        <UInput
          color="secondary"
          highlight
          v-model.lazy="cart[productCartIndex].quantity"
          size="xl"
          type="number"
          min="1"
          placeholder="Количество"
          :ui="{
            base: 'text-center w-15 bg-gray-50',
          }" />
        <UButton
          color="secondary"
          icon="i-heroicons-plus-small-solid"
          size="xl"
          @click="++cart[productCartIndex].quantity"
          variant="outline"
          aria-label="Добавить" />
        <UButton
          class="grow flex-col items-center gap-0 py-0.5"
          to="/user/cart">
          <div class="font-semibold">В корзине</div>
          <div class="text-xs">Перейти</div>
        </UButton>
      </div>
    </div>
    <template #fallback>
      <UButton
        label="Добавить в корзину"
        icon="i-heroicons-shopping-cart"
        block
        size="xl"
        disabled />
    </template>
  </ClientOnly>
</template>
