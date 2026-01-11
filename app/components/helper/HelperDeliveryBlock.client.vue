// ...existing code...
<script setup lang="ts">
//
const refHelperInputMenu = useTemplateRef('helperInputMenu')
const city = ref(getCityFromLocalStore())

const { data: dlCalc, status } = await useAsyncData<DlCalc>(
  'dellinCalc',
  () => {
    return $fetch<DlCalc>('/api/dellin/getCalc?kladr=' + city.value.code)
  },
  {
    lazy: true,
    default: () => {
      return {
        term_price: null,
        term_days: null,
        door_price: null,
        door_days: null,
      }
    },
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'watch') return undefined
      return nuxtApp.payload.data[key]
    },
    watch: [city],
  },
)

function getCityFromLocalStore() {
  const fallback = { name: 'г. Москва', code: '7700000000000000000000000' }
  try {
    return JSON.parse(localStorage.getItem('DL_CITY')) || fallback
  } catch {
    return fallback
  }
}

const changeCity = async newCity => {
  city.value = newCity
  refHelperInputMenu.value.clearAll()
  try {
    localStorage.setItem('DL_CITY', JSON.stringify(city.value))
  } catch (e) {
    console.error('Failed to set DL_CITY in localStorage:', e)
  }
}

const deliveryOptions = computed(() => [
  {
    icon: 'i-mdi-store',
    title: 'Самовывоз с ПВЗ',
    price: dlCalc.value.term_price,
    days: dlCalc.value.term_days,
  },
  {
    icon: 'i-mdi-door',
    title: 'Доставка до дверей',
    price: dlCalc.value.door_price,
    days: dlCalc.value.door_days,
  },
])

function getDescription(option) {
  if (status.value === 'pending') return 'Идет расчет...'
  if (option.price) return `От ${formatPrice(option.price)}, срок от ${option.days} дн.`
  return 'Недоступно'
}

const SideEffectWatcher = defineComponent({
  // solution for absolute block within overflow-hidden wrapper cuts trouble
  // this component is mounted only when result block is visible
  setup() {
    onMounted(() => {
      document.getElementById('info_block_container').style.overflow = 'visible'
    })
    onUnmounted(() => {
      document.getElementById('info_block_container').style.overflow = 'hidden'
    })
    return () => null
  },
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
        class="text-indigo-500 underline-offset-4 hover:underline"
        >со склада в Челябинске</NuxtLink
      >, а для
      <NuxtLink
        no-prefetch
        to="/contacts"
        class="text-indigo-500 underline-offset-4 hover:underline"
        >доставки по России</NuxtLink
      >
      мы отправим его транспортной компанией. Отгрузка осуществляется бесплатно, вы оплачиваете только междугороднюю
      перевозку по тарифам ТК.
    </HelperAlarm>
    <HelperInputMenu
      ref="helperInputMenu"
      @onEnter="changeCity"
      class="ml-4 max-w-80">
      <template #result="{ searchState }">
        <SideEffectWatcher />
        <div
          v-if="searchState.result.length"
          class="space-y-1">
          <button
            role="link"
            class="block text-left leading-tight underline-offset-4 hover:underline"
            v-for="city in searchState.result"
            @click="changeCity(city)">
            {{ city.name }}
          </button>
        </div>
        <div
          v-else
          class="">
          Нет результатов! Попробуйте изменить запрос.
        </div>
      </template>
    </HelperInputMenu>
    <h2 class="my-4 text-xl">
      Расчет стоимости доставки до <span class="font-bold">{{ city.name }}</span
      ><sup>*</sup>
    </h2>
    <div
      class="flex flex-wrap gap-4"
      :class="status === 'pending' && 'animate-pulse opacity-70'">
      <HelperPresentationCard
        v-for="option in deliveryOptions"
        :key="option.title"
        :item="{
          icon: option.icon,
          title: option.title,
          description: getDescription(option),
        }" />
    </div>
    <div class="pt-4">
      <sup>*</sup> Расчет выполняется по данным ТК "Деловые Линии" и носит предварительный характер. Для получения
      полной информации пройдите по
      <NuxtLink
        to="https://www.dellin.ru/requests/"
        class="text-indigo-500 underline-offset-4 hover:underline"
        >ссылке</NuxtLink
      >.
    </div>
  </div>
</template>
