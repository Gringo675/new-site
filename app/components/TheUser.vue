<script setup>
//
const user = useUser()
const config = useRuntimeConfig()

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
    let consent = null
    try {
      consent = localStorage.getItem('COOKIE_CONSENT')
    } catch (e) {
      console.error('Failed to get COOKIE_CONSENT from localStorage:', e)
    }

    // if (consent === 'accepted') loadAnalytics()
    // else showCookieBanner()
    if (consent !== 'accepted') setTimeout(showCookieBanner, 5000)
    if (!import.meta.dev) showNewSiteBanner()

    if (config.public.PROD_MODE) {
      loadAnalytics()
    } else {
      console.log(`Dev mode`)
    }

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
          try {
            localStorage.setItem('COOKIE_CONSENT', 'accepted')
          } catch (e) {
            console.error('Failed to set COOKIE_CONSENT in localStorage:', e)
          }
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
          $fetch('/api/log/setText', {
            method: 'POST',
            body: {
              text: 'toOldSite button clicked',
            },
          })
          window.open('https://old.chelinstrument.ru/', '_blank', 'noopener,noreferrer')
        },
      },
    ],
  })
}

const loadAnalytics = async () => {
  const ymId = config.public.YANDEX_METRIKA_ID
  const gtagId = config.public.GOOGLE_ANALYTICS_ID

  // Yandex.Metrika
  try {
    ;(function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          ;(m[i].a = m[i].a || []).push(arguments)
        }
      m[i].l = 1 * new Date()
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return
        }
      }
      ;((k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a))
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    window.ym(ymId, 'init', {
      defer: true,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    })
  } catch (e) {
    console.error('Yandex.Metrika init error:', e)
  }

  // Google Analytics
  try {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', gtagId)
  } catch (e) {
    console.error('Google Analytics init error:', e)
  }
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
