<script setup>
//
const isHydrated = ref(false)
onMounted(() => {
  isHydrated.value = true
})

const company = useCompany()
const menuState = [
  {
    label: 'О компании',
    to: '/about',
    icon: 'i-mynaui-info-waves',
  },
  {
    label: 'Как купить',
    to: '/help',
    icon: 'i-mynaui-question-waves',
  },
  {
    label: 'Доставка',
    to: '/shipping',
    icon: 'i-heroicons-gift',
  },
  {
    label: 'Контакты',
    to: '/contacts',
    icon: 'i-heroicons-globe-alt',
  },
  {
    label: 'Материалы',
    to: '/materials',
    icon: 'i-heroicons-book-open',
  },
]
</script>

<template>
  <div class="header-hidden">
    <div class="max-xs:grid-cols-[70px_1fr] mx-auto grid h-full max-w-(--breakpoint-xl) grid-cols-[120px_1fr_auto_1fr_120px] grid-rows-[auto_1fr] gap-1 max-md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] max-md:grid-rows-[100%]">
      <div class="col-span-1 row-span-2 flex items-center justify-center max-md:row-span-1">
        <ULink
          to="/"
          class="w-full"
          active-class="cursor-default">
          <img
            src="/img/logo.svg"
            alt="logo"
            class="w-full p-1 max-md:max-w-20"
            width="112"
            height="112" />
        </ULink>
      </div>
      <div class="col-span-3 flex max-md:hidden">
        <div class="font-accent bg-black-striped mx-auto rounded-b-md p-1 pt-0">
          <div class="flex rounded-b-md border-2 border-t-0 border-dashed border-orange-100">
            <UButton
              v-for="item in menuState"
              no-prefetch
              variant="link"
              color="secondary"
              :label="item.label"
              :to="item.to"
              :icon="item.icon"
              :ui="{
                leadingIcon: 'max-lg:size-4',
                label: 'leading-4.75',
              }"
              class="p-1.5 text-orange-200 hover:text-orange-100 active:text-orange-50 max-lg:text-xs"
              active-class="cursor-default underline underline-offset-4 decoration-orange-300 text-orange-300!" />
          </div>
        </div>
      </div>
      <div class="col-span-1 mt-2 mr-2 flex items-center justify-end max-md:hidden">
        <NuxtLink
          to="/materials/fgis"
          title="Поиск по Государственному реестру СИ (ФГИС РСТ)"
          class="group flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/95 px-2 py-1 shadow-2xs transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/80 hover:shadow-xs">
          <div class="flex h-auto w-[23px] shrink-0 items-center justify-center text-indigo-700 transition-colors group-hover:text-indigo-900">
            <IconRstLogo class="h-auto w-full" />
          </div>
          <div class="flex flex-col text-left leading-none whitespace-nowrap">
            <span class="text-[11px] font-bold tracking-tight text-indigo-950 transition-colors group-hover:text-indigo-900">ФГИС РСТ</span>
            <span class="mt-0.5 text-[9px] text-indigo-600/90 transition-colors group-hover:text-indigo-800">Госреестр СИ</span>
          </div>
          <UIcon
            name="i-heroicons-chevron-right"
            class="ml-0.5 size-2.5 shrink-0 text-indigo-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600" />
        </NuxtLink>
      </div>
      <div class="col-span-1 flex max-md:justify-center">
        <div class="font-accent max-xs:text-xl flex flex-col items-center justify-center text-center text-3xl text-gray-800 max-xl:text-2xl max-lg:text-base max-md:mx-2 max-md:text-2xl">
          <div>Торговый Дом</div>
          <div>Челябинский Инструмент</div>
        </div>
      </div>
      <div class="max-xs:hidden col-span-1 flex items-center justify-center">
        <picture>
          <source
            type="image/avif"
            :srcset="'/static/assets/w96_vernie.avif 960w, /static/assets/w192_vernie.avif 192w'"
            sizes="96px" />
          <source
            type="image/webp"
            :srcset="'/static/assets/w96_vernie.webp 960w, /static/assets/w192_vernie.webp 192w'"
            sizes="96px" />
          <img
            :src="'/static/assets/w96_vernie.png'"
            :srcset="'/static/assets/w96_vernie.png 96w, /static/assets/w192_vernie.png 192w'"
            sizes="96px"
            alt="ШЦ_лого"
            loading="lazy"
            decoding="async"
            width="96"
            height="73"
            class="max-w-24 min-w-0 opacity-90 max-lg:max-w-20" />
        </picture>
      </div>
      <div class="col-span-2 flex max-md:hidden">
        <div class="mr-2 flex w-full flex-col items-end justify-center text-lg text-slate-900 italic max-lg:items-center">
          <div class="flex items-center gap-2 hover:text-orange-800 max-lg:hidden">
            <UIcon
              name="i-heroicons-home-modern"
              class="size-5" />
            <NuxtLink
              no-prefetch
              to="/contacts"
              class="">
              {{ company.address.post }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-0.5 max-lg:flex-col lg:gap-4">
            <div class="flex items-center gap-2 hover:text-orange-800">
              <UIcon
                name="i-heroicons-phone"
                class="size-5" />
              <NuxtLink
                :to="'tel:' + company.phones[0]"
                class="">
                {{ company.phones[0] }}
              </NuxtLink>
            </div>
            <div class="flex items-center gap-2 hover:text-orange-800">
              <UIcon
                name="i-heroicons-envelope"
                class="size-5" />
              <NuxtLink
                :to="'mailto:' + company.mails[0]"
                class="">
                {{ company.mails[0] }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="bg-stone-900"> -->
  <div class="bg-black-striped">
    <div class="mx-auto grid max-w-(--breakpoint-xl) grid-cols-[1fr_auto_1fr] gap-1 px-2 py-3">
      <div class="col-span-1 flex items-center gap-3 max-md:hidden">
        <UButton
          :disabled="!isHydrated"
          icon="i-carbon-catalog"
          size="md"
          @click="showCatsMenu"
          label="Каталог"
          class="rounded-full font-bold" />
        <div class="flex grow justify-center">
          <UButton
            :disabled="!isHydrated"
            icon="i-heroicons-pencil-square"
            size="md"
            class="font-fancy rounded-full font-bold"
            aria-label="Быстрый заказ"
            @click="
              showFeedback({
                title: 'Быстрый заказ',
                description: 'Напишите, какие позиции Вас интересуют, или прикрепите файл с заявкой.',
              })
            ">
            <span class="max-lg:hidden">Быстрый заказ</span>
          </UButton>
        </div>
      </div>
      <div class="col-span-1 max-md:hidden">
        <TheSearch class="max-lg:max-w-88" />
      </div>
      <div class="col-span-1 flex items-center justify-end gap-3 max-md:col-span-3 max-md:justify-between">
        <UButton
          :disabled="!isHydrated"
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="rounded-full md:hidden"
          @click="showCatsMenu"
          aria-label="Каталог" />
        <UButton
          :disabled="!isHydrated"
          icon="i-heroicons-pencil-square"
          size="md"
          class="rounded-full md:hidden"
          @click="showFeedback"
          aria-label="Обратная связь" />
        <div class="flex justify-center md:grow">
          <LazyTheCart hydrate-on-idle />
        </div>
        <LazyTheUser :hydrate-after="2000" />
        <UButton
          :disabled="!isHydrated"
          icon="i-heroicons-ellipsis-vertical-16-solid"
          size="md"
          class="rounded-full md:hidden"
          @click="showMobileMenu"
          aria-label="Меню" />
      </div>
    </div>
  </div>
</template>
