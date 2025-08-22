<script setup lang="ts">
//

const { order } = defineProps<{
  order: { id: number; created: string; cart?: Product[] }
}>()

const cartTotal = computed(() => {
  const summ = order.cart.reduce((total, item) => total + item.quantity * item.price, 0)
  const Formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  })
  return {
    items: order.cart.reduce((acc, item) => acc + item.quantity, 0),
    total: Formatter.format(summ),
    totalWithVat: Formatter.format(summ * 1.2),
  }
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold">Заказ № {{ order.id }} от {{ order.created }}</h2>
    <div class="mx-auto my-4 max-w-3xl overflow-hidden overflow-x-auto rounded-lg">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-200 text-center text-xs font-semibold">
          <tr>
            <th class="p-2">Код</th>
            <th class="p-2">Наименование</th>
            <th class="p-2">Цена</th>
            <th class="p-2">Кол-во</th>
            <th class="p-2">Сумма</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-gray-100">
          <tr
            v-for="prod in order.cart"
            :key="prod.id">
            <td class="p-2 text-right">{{ prod.id }}</td>
            <td class="p-2 whitespace-nowrap">
              <NuxtLink
                :to="`/product/${prod.alias}`"
                class="text-indigo-500 underline-offset-4 hover:underline"
                >{{ prod.name }}</NuxtLink
              >
            </td>
            <td class="p-2 text-right whitespace-nowrap">{{ prod.price.toLocaleString() }} ₽</td>
            <td class="p-2 text-right">{{ prod.quantity }}</td>
            <td class="p-2 text-right font-semibold">{{ (prod.price * prod.quantity).toLocaleString() }} ₽</td>
          </tr>
        </tbody>
      </table>
      <div class="float-end mt-4 flex w-fit flex-col items-end gap-2 rounded-b-lg bg-gray-200 p-3 font-bold">
        <div class="">Товаров: {{ cartTotal.items }}</div>
        <div class="">Сумма заказа: {{ cartTotal.total }}</div>
        <div class="">
          Сумма заказа с НДС:
          {{ cartTotal.totalWithVat }}
        </div>
      </div>
    </div>
  </div>
</template>
