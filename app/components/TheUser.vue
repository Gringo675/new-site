<script setup>
//
const user = useUser()

onMounted(async () => {
  window.addEventListener('storage', event => {
    if (event.storageArea !== localStorage || event.key !== 'user-event') return
    if (event.newValue === null) return // при удалении
    if (event.newValue === '0') {
      logoutUser()
    } else if (event.newValue === '1') {
      closeLogin()
      getUser()
    } else if (event.newValue === '2') getUser({ force: true })
  })

  processUser()
})

const processUser = () => {
  getUser({ hidden: true })

  // @ts-ignore
  if (!window.__appInitialized) {
    // to avoid multiple executions from error.vue
    const consent = localStorage.getItem('COOKIE_CONSENT')

    // if (consent === 'accepted') loadAnalytics()
    // else showCookieBanner()
    if (consent !== 'accepted') setTimeout(showCookieBanner, 5000)
    if (!import.meta.dev) showNewSiteBanner()

    loadAnalytics()

    // @ts-ignore
    window.__appInitialized = true
  }
}

const showCookieBanner = () => {
  useToast().add({
    title: 'Мы используем куки и веб-аналитику',
    description: () =>
      h('span', [
        'Оставаясь с нами, вы соглашаетесь с ',
        h(
          'a',
          {
            href: '/privacy',
            class: 'underline text-tertiary whitespace-nowrap',
            target: '_blank',
          },
          'Политикой конфиденциальности',
        ),
      ]),
    icon: 'material-symbols-cookie-outline',
    progress: false,
    duration: 60 * 1000,
    actions: [
      {
        icon: 'i-heroicons-check',
        label: 'Принять',
        color: 'primary',
        variant: 'subtle',
        size: 'lg',
        class: 'px-10 mx-auto',
        onClick: () => {
          localStorage.setItem('COOKIE_CONSENT', 'accepted')
          // loadAnalytics()
        },
      },
    ],
  })
}

const showNewSiteBanner = () => {
  useToast().add({
    title: 'Запустили новый сайт!',
    description: 'Мы полностью обновили дизайн и улучшили функциональность. Надеемся, вам понравится!',
    icon: 'i-heroicons-rocket-launch',
    duration: 15 * 1000,
    actions: [
      {
        icon: 'i-heroicons-bug-ant',
        label: 'Сообщить о проблеме',
        ui: { label: 'whitespace-normal' },
        variant: 'subtle',
        size: 'xs',
        onClick: () => {
          showFeedback({
            title: 'Сообщить о проблеме на сайте',
            description:
              'Опишите, пожалуйста, с какой проблемой вы столкнулись. Мы постараемся её оперативно исправить.',
          })
        },
      },
      {
        icon: 'i-heroicons-arrow-top-right-on-square',
        label: 'Перейти на старый сайт',
        ui: { label: 'whitespace-normal' },
        variant: 'subtle',
        size: 'xs',
        onClick: () => {
          window.open('https://old.chelinstrument.ru/', '_blank')
        },
      },
    ],
  })
}

const loadAnalytics = async () => {
  console.log(`Loading analytics...`)
  // @ts-ignore
}
</script>

<template>
  <ClientOnly>
    <div class="relative max-w-40">
      <UButton
        v-if="!user.auth"
        icon="i-heroicons-user"
        size="md"
        truncate
        class="rounded-full"
        @click="showLogin"
        label="Войти" />
      <HelperPopupMenu
        v-else
        contentClass="right-0">
        <template #trigger="{ show }">
          <UButton
            icon="i-heroicons-user"
            size="md"
            truncate
            class="rounded-full"
            @click="show"
            :label="user.name" />
        </template>
        <template #content>
          <div class="flex flex-col items-end gap-2">
            <UButton
              v-if="user.admin"
              icon="i-material-symbols-admin-panel-settings-rounded"
              to="/admin"
              label="Админка"
              variant="outline" />
            <UButton
              icon="i-material-symbols-settings-account-box-outline-rounded"
              to="/user/profile"
              label="Профиль"
              variant="ghost" />
            <UButton
              icon="i-material-symbols-work-history-outline-rounded"
              to="/user/orders"
              label="Заказы"
              variant="ghost" />
            <UButton
              icon="i-iconamoon-exit"
              to="/"
              label="Выход"
              variant="ghost"
              @click="logoutUser" />
          </div>
        </template>
      </HelperPopupMenu>
    </div>
    <template #fallback>
      <div class="relative max-w-40">
        <UButton
          icon="i-heroicons-user"
          size="md"
          class="rounded-full"
          disabled
          label="Войти" />
      </div>
    </template>
  </ClientOnly>
</template>
