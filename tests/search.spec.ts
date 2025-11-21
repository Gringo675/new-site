import { test, expect } from '@playwright/test'

test('test search functionality', async ({ page }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  await page.goto(urlBase)

  const searchBox = page.getByRole('textbox', { name: 'Поиск по каталогу' })
  await searchBox.fill('250')

  const allResultsButton = page.getByRole('button', { name: 'Все результаты' })
  await expect(allResultsButton).toBeVisible()

  const productBlock = page.getByTestId('product-links-block')
  const productLinks = productBlock.locator('a')
  await expect(productLinks).toHaveCount(10) // assuming there are 10 product links

  await allResultsButton.click()
  await expect(page.getByRole('heading', { name: 'Результаты поиска по запросу "250"' })).toBeVisible()
  const productCards = page.getByTestId('product-card')
  await expect(productCards).toHaveCount(10) // assuming there are 10 product cards on the results page
  await expect(page.getByRole('button', { name: 'Показать еще' })).toBeVisible()
  await expect(page.getByText('В категориях:')).toBeVisible()
})
