<script setup>
//
const closeMenu = useSlideover().close
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
  closeMenu()
  await navigateTo(link)
}
const onLogin = () => {
  user.showLogin = true
  closeMenu()
}
const onLogout = () => {
  logoutUser()
  goTo('/')
}
const onFeedback = () => {
  showFeedback()
  closeMenu()
}
</script>

<template>
  <USlideover
    :ui="{
      wrapper: 'z-30',
      background: 'bg-gray-100',
      width: 'max-w-80',
    }"
  >
    <div class="p-2 overflow-auto">
      <!-- header -->
      <div class="flex justify-between items-center bg-gray-100">
        <div class="font-accent text-2xl whitespace-nowrap">ТД ЧИ</div>
        <button
          class="opacity-80 hover:opacity-100 focus:outline-none focus-visible:outline-0"
          @click="closeMenu"
        >
          <UIcon
            name="i-heroicons-x-mark"
            class="h-8 w-8 block"
          />
        </button>
      </div>
      <UDivider
        :ui="{
          border: {
            base: 'border-gray-300',
          },
        }"
        class="my-3"
      />
      <!-- menu -->
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
          class="mt-1"
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
          class="border border-gray-300 bg-gray-200 rounded-lg p-2"
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
        <div class="flex flex-col gap-2 ml-1 mt-4 text-sm">
          <div>{{ company.address.post }}</div>
          <div class="flex gap-2">
            <a
              v-for="mail in company.mails"
              @click="closeMenu"
              :href="'mailto:' + mail"
            >
              {{ mail }}
            </a>
          </div>
          <div class="flex gap-2">
            <a
              v-for="phone in company.phones"
              @click="closeMenu"
              :href="'tel:' + phone"
            >
              {{ phone }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </USlideover>
</template>
