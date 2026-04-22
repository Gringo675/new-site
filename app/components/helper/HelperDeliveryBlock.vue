<script setup>
//
const { visible } = defineProps({
  visible: Boolean,
})
</script>
<template>
  <div class="">
    <h2 class="pt-2 text-2xl font-bold">Доставка заказа</h2>
    <HelperAlarm
      type="info"
      icon="i-mdi-package-variant-closed">
      Забрать товар самостоятельно можно
      <NuxtLink
        no-prefetch
        to="/contacts"
        class="text-indigo-500 underline-offset-4 hover:underline">
        со склада в Челябинске
      </NuxtLink>
      , а для
      <NuxtLink
        no-prefetch
        to="/contacts"
        class="text-indigo-500 underline-offset-4 hover:underline">
        доставки по России
      </NuxtLink>
      мы отправим его транспортной компанией. Отгрузка осуществляется бесплатно, вы оплачиваете только междугороднюю перевозку по тарифам ТК.
    </HelperAlarm>
    <ClientOnly>
      <LazyHelperDeliveryBlockClient v-if="visible" />
    </ClientOnly>
  </div>
</template>
