<script setup>
//
// await new Promise(r => setTimeout(r, 3000))

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

  setTimeout(processUser, 1000)
})

const processUser = () => {
  const consent = localStorage.getItem('COOKIE_CONSENT')

  if (consent === 'accepted') loadAnalytics()
  else showCookieBanner()

  getUser({ hidden: true })
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
          loadAnalytics()
        },
      },
    ],
  })
}
const loadAnalytics = async () => {
  // @ts-ignore
  if (window.__analyticsLoaded) return
  // @ts-ignore
  window.__analyticsLoaded = true
  console.log(`Loading analytics...`)
}
</script>

<template>
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
</template>
