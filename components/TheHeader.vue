<script setup>
//
import { CatsMenuSlider, MobileMenuSlider } from '#components'

const slideover = useSlideover()
const openCatsMenuSlider = () => {
  slideover.open(CatsMenuSlider)
}
const openMobileMenuSlider = () => {
  slideover.open(MobileMenuSlider)
}

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
  {
    label: 'Материалы',
    to: '/contacts',
    icon: 'i-heroicons-book-open',
  },
]
</script>

<template>
  <div class="header-hidden">
    <div
      class="max-w-screen-xl h-full mx-auto grid grid-cols-[120px_1fr_auto_1fr_120px] grid-rows-[auto_1fr] gap-1 -md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] -md:grid-rows-[100%] -xs:grid-cols-[auto_auto]"
    >
      <div class="col-span-1 row-span-2 flex justify-center items-center -md:row-span-1">
        <ULink
          to="/"
          active-class="cursor-default"
        >
          <img
            src="/img/svg-test/v23.svg"
            alt="logo"
            class="p-1 w-full -md:max-w-20"
            width="100%"
            height="auto"
          />
        </ULink>
        <!-- <img
          src="/img/logo3.png"
          alt="logo"
          class="w-full -md:max-w-20"
        /> -->
      </div>
      <div class="col-span-3 flex -md:hidden">
        <UHorizontalNavigation
          :links="menuState"
          :ui="{
            base: 'py-2 -lg:text-xs -lg:px-2 -lg:gap-0.5',
            before: 'before:rounded-sm hover:before:bg-violet-300 before:inset-x-0 before:inset-y-1 ',
          }"
          class="w-auto mx-auto font-accent bg-violet-200 rounded-b-lg"
        />
      </div>
      <div class="col-span-1 flex justify-end gap-2 items-center mr-2 -md:hidden">
        <img
          src="/img/rst.svg"
          alt=""
          class="w-20"
        />
      </div>
      <div class="col-span-1 flex -md:justify-center">
        <div
          class="flex flex-col justify-center items-center text-3xl text-gray-800 font-accent text-center -xl:text-2xl -lg:text-base -md:text-2xl -md:mx-2 -xs:text-xl"
        >
          <div>Торговый Дом</div>
          <div>Челябинский Инструмент</div>
        </div>
      </div>
      <div class="col-span-1 flex justify-center items-center -xs:hidden">
        <img
          src="/img/vernie2.png"
          alt="vernie"
          class="max-w-24 min-w-0 opacity-90 -lg:max-w-20"
        />
      </div>
      <div class="col-span-2 flex -md:hidden">
        <div class="w-full flex flex-col justify-center items-end mr-2 -xl:items-center -lg:text-sm">
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

  <div class="bg-stone-900">
    <div class="max-w-screen-xl mx-auto grid grid-cols-[1fr_auto_1fr] gap-1 px-2 py-3">
      <div class="col-span-1 flex items-center gap-3 -md:hidden">
        <UButton
          icon="i-heroicons-queue-list"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          @click="openCatsMenuSlider"
          label="Каталог"
        />
        <div class="flex-grow flex justify-center">
          <UButton
            icon="i-heroicons-pencil-square"
            size="md"
            :ui="{ rounded: 'rounded-full' }"
            class=""
            @click="showFeedback"
          >
            <span class="-lg:hidden">Быстрый заказ</span>
          </UButton>
        </div>
      </div>
      <div class="col-span-1 -md:hidden">
        <TheSearch class="-lg:max-w-[350px]" />
      </div>
      <div class="col-span-1 flex justify-end items-center gap-3 -md:col-span-3 -md:justify-between">
        <UButton
          icon="i-heroicons-magnifying-glass"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          class="md:hidden"
          @click="openCatsMenuSlider"
        />
        <UButton
          icon="i-heroicons-pencil-square"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          class="md:hidden"
          @click="showFeedback"
        />
        <div class="md:flex-grow flex justify-center">
          <ClientOnly>
            <TheCart />
            <template #fallback>
              <UButton
                icon="i-heroicons-shopping-cart"
                size="md"
                :ui="{ rounded: 'rounded-full' }"
                label="0"
              />
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
              :ui="{
                rounded: 'rounded-full',
              }"
              label="Войти"
            />
          </template>
        </ClientOnly>
        <UButton
          icon="i-heroicons-ellipsis-vertical-16-solid"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          class="md:hidden"
          @click="openMobileMenuSlider"
        />
      </div>
    </div>
  </div>
</template>
