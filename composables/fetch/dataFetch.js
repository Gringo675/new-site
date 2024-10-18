/*
получение данных через useAsyncData с поддержкой авторизации и обработкой ошибок
url - адрес api ресурса
options {
    lazy, server
    transform - используется как watcher для изменения состояния _pending. Если понадобится нативный transform
    (т.е. для изменения data), дополню код
}
UPD: не используется. Используем компонент HelperDataFetch.
 */
import { callWithNuxt } from '#app'

export default async (url, options = {}) => {
  // defaults
  options.lazy = options.lazy ?? true
  options.server = options.server ?? true

  const nuxtApp = useNuxtApp()

  const _pending = ref(true)

  const transform = data => {
    if (data) _pending.value = false
    return data
  }

  const { data } = await useAsyncData(
    url,
    async () => {
      try {
        return await $fetch(url)
      } catch (e) {
        handleError(e, url, nuxtApp)
        return null
      }
    },
    {
      lazy: options.lazy,
      server: options.server,
      transform,
    }
  )

  if (data.value) _pending.value = false

  return { data, pending: _pending }
}

const handleError = (error, url, nuxtApp) => {
  callWithNuxt(nuxtApp, showError, [error])
  setTimeout(() => callWithNuxt(nuxtApp, clearNuxtData, [url]), 0) // чтобы выполнился после transform
}
