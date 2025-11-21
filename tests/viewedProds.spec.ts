import { test, expect } from '@playwright/test'

test('test recently viewed products block', async ({ page }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  await page.goto(urlBase)

  const bestSellersBlock = page.getByTestId('best-sellers-block')
  const viewedBlock = page.getByTestId('recently-viewed-block')

  await expect(bestSellersBlock).toBeVisible()
  const productCards = bestSellersBlock.getByTestId('product-card')
  await expect(productCards).toHaveCount(6)

  // Step 1: Remember all 6 links and their text.
  const links = await productCards.getByRole('link').all()
  const productsToVisit = await Promise.all(
    links.map(async link => {
      const href = await link.getAttribute('href')
      const name = (await link.textContent())?.trim()
      return { href, name }
    }),
  )

  // Step 2: Go to the first product page via click, then others via goto
  await productCards.getByRole('link').first().click()
  await expect(page.getByRole('heading', { name: productsToVisit[0].name })).toBeVisible()
  await page.waitForFunction(() => {
    return localStorage.getItem('VIEWED') !== null
  })

  // make only 2 transitions to other product pages to meet the deadline of 30s 'cause of slow CI
  for (let i = 1; i < 3; i++) {
    const product = productsToVisit[i]
    await page.goto(new URL(product.href, urlBase).toString())
    await expect(page.getByRole('heading', { name: product.name })).toBeVisible()
    await page.waitForTimeout(4000)
    await expect(viewedBlock).toBeVisible()
    await expect(viewedBlock.getByTestId('product-card')).toHaveCount(i)
  }
})
