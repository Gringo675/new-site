<script setup>
//
// const closeMenu = useSlideover().close
const user = useUser().value
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

const goTo = async link => {
  await navigateTo(link)
  hideMobileMenu()
}
const onLogin = () => {
  user.showLogin = true
  hideMobileMenu()
}
const onLogout = () => {
  logoutUser()
  goTo('/')
}
const onFeedback = () => {
  showFeedback()
  hideMobileMenu()
}
</script>

<template>
  <USlideover
    title="ТД ЧИ"
    description="Ваш лучший поставщик измерительного инструмента"
    :ui="{
      content: 'bg-gray-100 max-w-sm',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-1">
        <UButton
          size="lg"
          block
          label="Весь каталог инструмента"
          icon="i-heroicons-queue-list"
          @click="goTo('/catalog')"
        />
        <UButton
          size="lg"
          variant="outline"
          block
          label="Быстрый заказ"
          icon="i-heroicons-pencil-square"
          @click="onFeedback"
          class="mt-2"
        />
        <UButton
          v-for="item in menuState"
          variant="link"
          size="lg"
          :label="item.label"
          :icon="item.icon"
          @click="goTo(item.to)"
          class="w-max"
        />

        <div
          v-if="user.auth"
          class="rounded-lg border border-gray-300 bg-gray-200 p-2"
        >
          <div class="text-center italic">{{ user.name }}</div>
          <div class="flex justify-center gap-2 py-1">
            <UButton
              variant="outline"
              label="Профиль"
              @click="goTo('/user/profile')"
              class="w-max"
            />
            <UButton
              variant="outline"
              label="Заказы"
              @click="goTo('/user/orders')"
              class="w-max"
            />
            <UButton
              variant="outline"
              label="Выход"
              @click="onLogout"
              class="w-max"
            />
          </div>
        </div>
        <UButton
          v-else
          size="lg"
          variant="outline"
          block
          label="Войти / зарегистрироваться"
          icon="i-heroicons-queue-list"
          @click="onLogin"
        />
        <!-- contacts -->
        <div class="mt-4 ml-1 flex flex-col gap-2 text-sm">
          <div>{{ company.address.post }}</div>
          <div class="flex gap-2">
            <a
              v-for="mail in company.mails"
              @click="hideMobileMenu"
              :href="'mailto:' + mail"
            >
              {{ mail }}
            </a>
          </div>
          <div class="flex gap-2">
            <a
              v-for="phone in company.phones"
              @click="hideMobileMenu"
              :href="'tel:' + phone"
            >
              {{ phone }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
