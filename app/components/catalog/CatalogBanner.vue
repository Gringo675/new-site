<script setup>
//
const advantages = [
  {
    icon: 'i-heroicons-hand-raised',
    title: 'Надежный партнер',
    description:
      'Мы не просто продаем оборудование. Мы строим долгосрочные отношения, основанные на доверии и взаимной выгоде.',
  },

  {
    icon: 'i-heroicons-receipt-percent',
    title: 'Лучшее ценовое предложение',
    description:
      'Экономия без компромиссов в качестве. Благодаря прямым контрактам с производителями мы предлагаем конкурентные цены и гибкую систему скидок.',
  },
  {
    icon: 'i-heroicons-wrench-screwdriver',
    title: 'Сервис и поддержка',
    description:
      'Работайте с уверенностью. Мы обеспечиваем полный цикл поддержки оборудования — от гарантии до пожизненного сервиса и консультаций.',
  },
  {
    icon: 'i-heroicons-inbox-stack',
    title: 'Всегда в наличии',
    description:
      'Не тратьте время на ожидание. Ключевые позиции всегда на нашем складе, готовы к немедленной отправке в день заказа.',
  },
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Экспертная консультация',
    description:
      'Сложные задачи требуют компетентных решений. Доверьте подбор оборудования нашим специалистам и будьте уверены в результате.',
  },
]
const loopedAdvantages = [...advantages, advantages[0]]
const currentPage = ref(0)
const isTransitioning = ref(true)
const handleTransitionEnd = async () => {
  if (currentPage.value === loopedAdvantages.length - 1) {
    currentPage.value = 0
    isTransitioning.value = false
    setTimeout(() => {
      isTransitioning.value = true
    }, 100)
  }
}
let timer = null
onMounted(() => {
  timer = setInterval(() => {
    currentPage.value++
  }, 10000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="my-2 w-full overflow-hidden">
    <div
      class="flex"
      :class="{ 'transition-transform duration-500 ease-in-out': isTransitioning }"
      :style="{ transform: `translateX(-${currentPage * 100}%)` }"
      @transitionend="handleTransitionEnd">
      <div
        v-for="adv in loopedAdvantages"
        class="flex-none basis-full px-1">
        <div
          class="relative flex h-full flex-col items-center justify-evenly gap-4 overflow-hidden rounded-2xl border border-orange-900 bg-slate-100 p-4">
          <!-- Decorative Shapes -->
          <div
            class="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-linear-to-r from-violet-500 to-purple-300 opacity-10"></div>
          <div
            class="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-linear-to-l from-sky-500 to-cyan-300 opacity-10"></div>
          <Icon
            :name="adv.icon"
            class="size-12 flex-none text-violet-500" />
          <div class="font-accent mb-2 border-b border-violet-500 pb-2 text-center text-2xl text-violet-500">
            {{ adv.title }}
          </div>
          <div>
            <div class="text-center font-semibold text-orange-900">{{ adv.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
