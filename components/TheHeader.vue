<script setup>
//

const company = useCompany()
const menuState = [
  {
    label: 'О компании',
    to: '/about',
    icon: 'i-heroicons-information-circle',
  },
  {
    label: 'Как купить',
    to: '/help',
    icon: 'i-heroicons-question-mark-circle',
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
]
</script>

<template>
  <div class="header-hidden bg-yellow-200">
    <div class="max-w-screen-xl mx-auto grid grid-cols-[120px_1fr_auto_1fr_120px] gap-1">
      <div class="col-span-1 row-span-2 flex justify-center items-center">
        <img
          src="/img/logo3.png"
          alt="logo"
          class="w-full"
        />
      </div>
      <div class="col-span-3 flex">
        <UHorizontalNavigation
          :links="menuState"
          :ui="{
            before: 'before:rounded-none hover:before:bg-violet-300 before:inset-x-0 before:inset-y-2',
          }"
          class="w-auto mx-auto font-accent bg-violet-200 rounded-b-lg"
        />
      </div>
      <div class="col-span-1 flex justify-end gap-2 items-center mr-2">
        <img
          src="/img/rst.svg"
          alt=""
          class="w-10 -sm:w-7"
        />
        <img
          src="/img/arshin.svg"
          alt=""
          class="w-10 -sm:w-5"
        />
      </div>
      <div class="col-span-1 flex -sm:col-span-4">
        <div
          class="flex flex-col justify-center items-center text-3xl font-semibold font-accent -md:text-xl -sm:flex-row -sm:gap-x-2 -sm:ml-4"
        >
          <div>Торговый Дом</div>
          <div>Челябинский Инструмент</div>
        </div>
      </div>
      <div class="col-span-1 flex justify-center items-center -sm:hidden">
        <img
          src="/img/vernie2.png"
          alt="vernie"
          class="w-24 opacity-70 -md:w-16"
        />
      </div>
      <div class="col-span-2 -sm:hidden">
        <div
          class="font-accent font-light text-lg tracking-wider flex flex-col items-end mr-2 -md:text-base -md:tracking-wide"
        >
          <div class="flex items-center">
            <UIcon
              name="i-heroicons-home-modern"
              class="w-5 h-5 mx-2"
            />
            <span>{{ company.address.post }}</span>
          </div>

          <div class="flex items-center">
            <UIcon
              name="i-heroicons-envelope"
              class="w-5 h-5 mx-2"
            />
            <span>{{ company.mails.join(' ') }}</span>
          </div>
          <div class="flex items-center">
            <UIcon
              name="i-heroicons-phone"
              class="w-5 h-5 mx-2"
            />
            <span> {{ company.phones.join(' ') }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-stone-900 border-b-2 border-yellow-200">
    <div class="max-w-7xl mx-auto flex justify-between items-center p-2">
      <ClientOnly>
        <CatsMenu />
        <UButton
          icon="i-heroicons-shopping-bag"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          @click=""
          label="Быстрый заказ"
        />
        <TheSearch />

        <TheCart />
        <TheUser class="" />
      </ClientOnly>
    </div>
  </div>
</template>
