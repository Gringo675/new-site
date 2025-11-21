import { test, expect } from '@playwright/test'

test('visual regression test', async ({ page }) => {
  test.slow()
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  const routes = [
    { name: 'contacts', path: 'contacts' },
    { name: 'catalog', path: 'catalog/prizmy-poverochnye' },
    { name: 'product', path: 'product/skoba-rychazhnaya-sr-50-75-0-002-izmeron' },
  ]

  // const viewPorts = [
  //   { name: 'desktop', width: 1280, height: 720 },
  //   { name: 'tablet', width: 768, height: 1024 },
  //   { name: 'mobile', width: 375, height: 667 },
  // ]

  const viewPorts = [
    { name: 'xl', width: 1280, height: 1024 },
    { name: 'lg', width: 1024, height: 768 },
    { name: 'md', width: 768, height: 1024 },
    { name: 'sm', width: 640, height: 480 },
    { name: 'xs', width: 375, height: 667 },
  ]

  const devTools = page.locator('#nuxt-devtools-container .nuxt-devtools-panel')
  const userButton = page.getByRole('button', { name: 'Войти' })

  let cookiesAccepted = false
  for (const route of routes) {
    await page.goto(urlBase + route.path)
    await expect(userButton).toBeVisible()

    if (!cookiesAccepted) {
      await page.getByRole('button', { name: 'Принять' }).click() // close cookie banner
      cookiesAccepted = true
    }
    for (const vp of viewPorts) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await expect(page).toHaveScreenshot(`${urlBase}-${route.name}-${vp.name}.png`, { mask: [devTools], fullPage: true })
    }
  }
  // await page.goto(urlBase + 'about')
  // // await page.waitForTimeout(5000)
  // await page.getByRole('button', { name: 'Принять' }).click() // close cookie banner

  // await expect(page).toHaveScreenshot(`${urlBase}-about.png`, { mask: [devTools] })

  // const footer = page.getByRole('contentinfo')
  // await expect(footer).toHaveScreenshot(`${urlBase}-footer.png`, { mask: [devTools] })

  // await page.setViewportSize({ width: 768, height: 1024 })
  // await expect(page).toHaveScreenshot(`${urlBase}-about-tablet.png`, { mask: [devTools] })

  // await page.setViewportSize({ width: 375, height: 667 })
  // await expect(page).toHaveScreenshot(`${urlBase}-about-mobile.png`, { mask: [devTools] })
})
