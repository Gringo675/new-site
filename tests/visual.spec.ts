import { test, expect } from '@playwright/test'

test('visual regression test', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style')
      // Hide notifications and devtool elements
      style.innerHTML = `
        [role="region"][aria-label="Notifications (F8)"] {
          display: none !important;
        }
        #nuxt-devtools-container {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    })
  })

  test.slow()
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  const routes = [
    { name: 'contacts', path: 'contacts' },
    { name: 'catalog', path: 'catalog/prizmy-poverochnye' },
    { name: 'product', path: 'product/plita-400kh400-chugun-mekh-obr-kl-1-stiz' },
  ]

  const viewPorts = [
    { name: 'xl', width: 1280, height: 1024 },
    { name: 'lg', width: 1024, height: 768 },
    { name: 'md', width: 768, height: 1024 },
    { name: 'sm', width: 640, height: 480 },
    { name: 'xs', width: 375, height: 667 },
  ]

  const userButton = page.getByRole('button', { name: 'Войти' })

  for (const route of routes) {
    await page.goto(urlBase + route.path)

    await expect(userButton).toBeEnabled({ timeout: 10000 }) // hydration waiting...

    for (const vp of viewPorts) {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      await expect(page).toHaveScreenshot(`${urlBase}-${route.name}-${vp.name}.png`, {
        fullPage: false,
        mask: route.name === 'contacts' ? [page.locator('#map')] : [],
      })
    }
  }
})
