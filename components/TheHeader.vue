<script setup>
//
const company = useCompany()
const menuState = [
  {
    label: 'О компании',
    to: '/about',
    icon: 'i-heroicons-light-bulb',
  },
  {
    label: 'Как купить',
    to: '/help',
    icon: 'i-heroicons-light-bulb',
  },
  {
    label: 'Доставка',
    to: '#',
    icon: 'i-heroicons-light-bulb',
  },
  {
    label: 'Контакты',
    to: '/contacts',
    icon: 'i-heroicons-light-bulb',
  },
]
</script>

<template>
  <div class="">
    <div class="hidden_part flex bg-secondary-50">
      <div class="first_col h-[120px] flex items-center font-accent text-center">
        <img
          src="/img/logo.png"
          alt="logo"
          class="w-32 h-32"
        />
        <h1 class="">Торговый Дом <br />Челябинский Инструмент</h1>
      </div>
      <div class="second_col flex flex-col flex-grow">
        <UHorizontalNavigation
          :links="menuState"
          class="w-auto self-end"
        />
        <div class="contacts">
          <div class="">{{ company.address.post }}</div>
          <div class="">{{ company.phones.join(' ') }}</div>
          <div class="">{{ company.mails.join(' ') }}</div>
        </div>
      </div>
    </div>

    <div class="visible_part flex justify-between items-center p-2 bg-secondary-100">
      <ClientOnly>
        <CatsMenu />
        <UButton
          label="Быстрый заказ"
          color="accent"
          variant="outline"
        />
        <TheSearch />

        <TheCart />
        <TheUser class="" />
      </ClientOnly>
    </div>
  </div>
</template>
