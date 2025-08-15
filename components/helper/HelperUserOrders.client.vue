<script setup>
//
const orders = await myFetch('/api/user/getOrders')
</script>

<template>
  <div
    class="my-6"
    v-if="!orders.length">
    Вы еще не сделали ни одного заказа.
  </div>
  <div
    class="my-6 space-y-6"
    v-else>
    <div
      class="rounded-lg border border-gray-300 bg-gray-200 p-4"
      v-for="order in orders">
      <h2 class="text-2xl font-bold">Заказ № {{ order.id }} от {{ order.created }}</h2>
      <div class="@container flex flex-col gap-2">
        <CatalogProductCard
          v-for="prod in order.cart"
          :key="prod.id"
          :prod="prod" />
      </div>
      <pre>{{ order }}</pre>
    </div>
  </div>
</template>
