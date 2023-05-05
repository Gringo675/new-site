export default defineNuxtPlugin(nuxtApp => {
  // It will receive all Vue errors, even if they are handled.
  // не понял, как работает. Ловит только если отключить NuxtErrorBoundary и onErrorCaptured.
  // и похоже работает только на клиенте
  // nuxtApp.vueApp.config.errorHandler = (error, context) => {
  //   console.log(`from errorHandler***********************`)
  //   cv({ error, context })
  // }
})
