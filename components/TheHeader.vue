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
      class="max-xs:grid-cols-[auto_auto] mx-auto grid h-full max-w-(--breakpoint-xl) grid-cols-[120px_1fr_auto_1fr_120px] grid-rows-[auto_1fr] gap-1 max-md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] max-md:grid-rows-[100%]"
    >
      <div class="col-span-1 row-span-2 flex items-center justify-center max-md:row-span-1">
        <ULink
          to="/"
          active-class="cursor-default"
        >
          <img
            src="/img/svg-test/v23.svg"
            alt="logo"
            class="w-full p-1 max-md:max-w-20"
            width="100%"
            height="auto"
          />
        </ULink>
      </div>
      <div
        class="col-span-3 flex max-md:hidden"
        style="--ui-text-muted: var(--color-teal-100); --ui-text-dimmed: var(--color-teal-200)"
      >
        <UNavigationMenu
          :items="menuState"
          color="warning"
          highlight
          highlight-color="error"
          :ui="{
            item: 'py-1',
            // label: 'text-green-400',
            link: 'max-lg:text-xs max-lg:px-2 after:h-0.5 after:bottom-0 after:left-1 after:right-1 hover:text-teal-200',
            linkLeadingIcon: '',
          }"
          class="font-accent mx-auto w-auto rounded-b-md bg-stone-900"
        />
      </div>
      <div class="col-span-1 mr-2 flex items-center justify-end gap-2 max-md:hidden">
        <img
          src="/img/rst.svg"
          alt=""
          class="w-20"
        />
      </div>
      <div class="col-span-1 flex max-md:justify-center">
        <div
          class="font-accent max-xs:text-xl flex flex-col items-center justify-center text-center text-3xl text-gray-800 max-xl:text-2xl max-lg:text-base max-md:mx-2 max-md:text-2xl"
        >
          <div>Торговый Дом</div>
          <div>Челябинский Инструмент</div>
        </div>
      </div>
      <div class="max-xs:hidden col-span-1 flex items-center justify-center">
        <img
          src="/img/vernie2.png"
          alt="vernie"
          class="max-w-24 min-w-0 opacity-90 max-lg:max-w-20"
        />
      </div>
      <div class="col-span-2 flex max-md:hidden">
        <div class="mr-2 flex w-full flex-col items-end justify-center max-xl:items-center max-lg:text-sm">
          <div class="flex items-center">
            <UIcon
              name="i-heroicons-home-modern"
              class="mx-2 h-5 w-5"
            />
            <span>{{ company.address.post }}</span>
          </div>

          <div class="flex items-center">
            <UIcon
              name="i-heroicons-envelope"
              class="mx-2 h-5 w-5"
            />
            <span>{{ company.mails.join(' ') }}</span>
          </div>
          <div class="flex items-center">
            <UIcon
              name="i-heroicons-phone"
              class="mx-2 h-5 w-5"
            />
            <span> {{ company.phones.join(' ') }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-stone-900">
    <div class="mx-auto grid max-w-(--breakpoint-xl) grid-cols-[1fr_auto_1fr] gap-1 px-2 py-3">
      <div class="col-span-1 flex items-center gap-3 max-md:hidden">
        <UButton
          icon="i-heroicons-queue-list"
          size="md"
          @click="showCatsMenu"
          label="Каталог"
          class="rounded-full"
        />
        <div class="flex grow justify-center">
          <UButton
            icon="i-heroicons-pencil-square"
            size="md"
            class="rounded-full"
            @click="showFeedback"
          >
            <span class="max-lg:hidden">Быстрый заказ</span>
          </UButton>
        </div>
      </div>
      <div class="col-span-1 max-md:hidden">
        <TheSearch class="max-lg:max-w-[350px]" />
      </div>
      <div class="col-span-1 flex items-center justify-end gap-3 max-md:col-span-3 max-md:justify-between">
        <UButton
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="rounded-full md:hidden"
          @click="showCatsMenu"
        />
        <UButton
          icon="i-heroicons-pencil-square"
          size="md"
          class="rounded-full md:hidden"
          @click="showFeedback"
        />
        <div class="flex justify-center md:grow">
          <ClientOnly>
            <TheCart />
            <template #fallback>
              <UButton
                icon="i-heroicons-shopping-cart"
                size="md"
                class="rounded-full"
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
              class="rounded-full"
              label="Войти"
            />
          </template>
        </ClientOnly>
        <UButton
          icon="i-heroicons-ellipsis-vertical-16-solid"
          size="md"
          class="rounded-full md:hidden"
          @click="showMobileMenu"
        />
      </div>
    </div>
  </div>
</template>
