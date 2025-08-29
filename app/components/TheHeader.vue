<script setup>
//

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
    <div
      class="max-xs:grid-cols-[70px_1fr] mx-auto grid h-full max-w-(--breakpoint-xl) grid-cols-[120px_1fr_auto_1fr_120px] grid-rows-[auto_1fr] gap-1 max-md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] max-md:grid-rows-[100%]">
      <div class="col-span-1 row-span-2 flex items-center justify-center max-md:row-span-1">
        <ULink
          to="/"
          class="w-full"
          active-class="cursor-default">
          <img
            src="/img/logo.svg"
            alt="logo"
            class="w-full p-1 max-md:max-w-20"
            width="100%"
            height="auto" />
        </ULink>
      </div>
      <div class="col-span-3 flex max-md:hidden">
        <div class="font-accent bg-black-striped mx-auto rounded-b-md p-1 pt-0">
          <div class="flex rounded-b-md border-2 border-t-0 border-dashed border-orange-100">
            <UButton
              v-for="item in menuState"
              variant="link"
              :label="item.label"
              :to="item.to"
              :icon="item.icon"
              :ui="{
                leadingIcon: 'max-lg:size-4',
                label: 'leading-[19px]',
              }"
              class="p-1.5 text-orange-200 hover:text-orange-100 max-lg:text-xs"
              active-class="cursor-default underline underline-offset-4 decoration-orange-300" />
          </div>
        </div>
      </div>
      <div class="col-span-1 mr-2 flex items-center justify-end gap-2 max-md:hidden">
        <img
          src="/img/rst.svg"
          alt=""
          class="w-20" />
      </div>
      <div class="col-span-1 flex max-md:justify-center">
        <div
          class="font-accent max-xs:text-xl flex flex-col items-center justify-center text-center text-3xl text-gray-800 max-xl:text-2xl max-lg:text-base max-md:mx-2 max-md:text-2xl">
          <div>Торговый Дом</div>
          <div>Челябинский Инструмент</div>
        </div>
      </div>
      <div class="max-xs:hidden col-span-1 flex items-center justify-center">
        <img
          src="/img/vernie2.png"
          alt="vernie"
          class="max-w-24 min-w-0 opacity-90 max-lg:max-w-20" />
      </div>
      <div class="col-span-2 flex max-md:hidden">
        <div
          class="mr-2 flex w-full flex-col items-end justify-center text-slate-900 italic max-xl:items-center max-lg:text-sm">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-home-modern"
              class="size-5" />
            <NuxtLink
              to="/contacts"
              class="">
              {{ company.address.post }}
            </NuxtLink>
          </div>

          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-envelope"
              class="size-5" />
            <NuxtLink
              v-for="mail in company.mails"
              :to="'mailto:' + mail"
              class="">
              {{ mail }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-phone"
              class="size-5" />
            <NuxtLink
              v-for="phone in company.phones"
              :to="'tel:' + phone"
              class="">
              {{ phone }}
            </NuxtLink>
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
          icon="i-carbon-catalog"
          size="md"
          @click="showCatsMenu"
          label="Каталог"
          class="rounded-full font-bold" />
        <div class="flex grow justify-center">
          <UButton
            icon="i-heroicons-pencil-square"
            size="md"
            class="font-fancy rounded-full font-bold"
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
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="rounded-full md:hidden"
          @click="showCatsMenu" />
        <UButton
          icon="i-heroicons-pencil-square"
          size="md"
          class="rounded-full md:hidden"
          @click="showFeedback" />
        <div class="flex justify-center md:grow">
          <ClientOnly>
            <TheCart />
            <template #fallback>
              <UButton
                icon="i-heroicons-shopping-cart"
                size="md"
                class="rounded-full"
                label="0" />
            </template>
          </ClientOnly>
        </div>
        <ClientOnly>
          <TheUser />
          <template #fallback>
            <UButton
              icon="i-heroicons-user"
              size="md"
              truncate
              class="rounded-full"
              label="Войти" />
          </template>
        </ClientOnly>
        <UButton
          icon="i-heroicons-ellipsis-vertical-16-solid"
          size="md"
          class="rounded-full md:hidden"
          @click="showMobileMenu" />
      </div>
    </div>
  </div>
</template>
