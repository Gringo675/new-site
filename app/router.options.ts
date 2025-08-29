import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig> {
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (to.hash) {
          return resolve({
            el: to.hash,
            behavior: 'smooth'
          })
        }
        
        resolve({
          top: savedPosition?.top || 0,
          behavior: 'smooth'
        })
      }, 400)
    })
  }
}
