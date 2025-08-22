<script setup>
//
const orders = await myFetch('/api/user/getOrders')

function getOrderTotal(order) {
  if (!order?.cart) return 0
  return order.cart.reduce((sum, prod) => sum + prod.price * prod.quantity, 0)
}
</script>

<template>
  <div
    class="my-6"
    v-if="!orders.length">
    Вы еще не сделали ни одного заказа.
  </div>
  <div
    class="my-4"
    v-else>
    <HelperUserOrdersItem
      v-for="order in orders"
      :order />
  </div>
</template>
