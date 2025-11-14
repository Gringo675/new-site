import { test, expect } from '@playwright/test'
import formatPrice from '../app/composables/formatPrice'

test('test', async ({ page }) => {
  await page.goto('https://test.chelinstrument.ru')
  // await page.goto('http://localhost:3000/')

  const bestSellersBlock = page.getByTestId('best-sellers-block')
  await expect(bestSellersBlock).toBeVisible()
  const productCards = bestSellersBlock.getByTestId('product-card')
  await expect(productCards).not.toHaveCount(0)

  const firstProductCard = productCards.first()
  const firstProductName = await firstProductCard.getByRole('link').textContent()
  await firstProductCard.getByRole('link').click()

  await expect(page.getByRole('heading', { name: firstProductName! })).toBeVisible()

  const productDataFromApi = await getProductDataFromAPI(page.url())
  console.log(`productDataFromApi: ${JSON.stringify(productDataFromApi, null, 2)}`)
  // check product data
  expect(firstProductName).toEqual(productDataFromApi.name)
  await expect(page.getByText(productDataFromApi.id, { exact: true })).toBeVisible()
  // check price
  await expect(page.getByText(formatPrice(productDataFromApi.price), { exact: true })).toBeVisible()
  // check images carousel
  await expect(page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[0]}.jpg"]`)).toBeVisible()
  if (productDataFromApi.images.length > 1) {
    await expect(page.locator(`img[src="/static/img/products/w_64/${productDataFromApi.images[1]}.jpg"]`)).toBeVisible()
    await expect(
      page.locator(`button:has(img[src="/static/img/products/w_64/${productDataFromApi.images[0]}.jpg"])`),
    ).toBeVisible()
    for (const ind in productDataFromApi.images) {
      await expect(
        page.locator(`img[src="/static/img/products/w_64/${productDataFromApi.images[ind]}.jpg"]`),
      ).toBeVisible()
    }
    await page.getByRole('button', { name: 'Следующее' }).click()
    await expect(
      page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[1]}.jpg"]`),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Предыдущее' }).click()
    await expect(
      page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[0]}.jpg"]`),
    ).toBeVisible()
  }
  // check images viewer (after hydration)
  await page.locator('#img_0').click()
  await expect(page.locator(`img[src="/static/img/products/w_max/${productDataFromApi.images[0]}.jpg"]`)).toBeVisible()
})

const getProductDataFromAPI = async (url: string) => {
  const productAlias = url.split('/').pop()
  const apiUrl = `https://test.chelinstrument.ru/api/getData/product/${productAlias}`
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  const data = await response.json()
  return data
}
