import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://test.chelinstrument.ru')
  // await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Каталог' }).click()
  await page.getByRole('link', { name: 'Штангенциркули', exact: true }).click()
  await expect(page.getByText('Подкатегории')).toBeVisible()
  await page.getByRole('tab', { name: 'Документация' }).click()
  await expect(page.getByText('ГОСТ 166-89 Штангенциркули. Технические условия')).toBeVisible()
  await page.getByRole('button', { name: 'Свернуть' }).click()

  const productCards = page.getByTestId('product-card')
  const priceLocator = '.text-primary.relative span'

  // test sorting by name and price
  await page.getByRole('combobox', { name: 'Сортировка' }).click()
  await page.getByText('по наименованию А->Я').click()
  const firstLinkText = await productCards.first().getByRole('link').textContent()
  const secondLinkText = await productCards.nth(1).getByRole('link').textContent()
  expect(firstLinkText! < secondLinkText!)
  await page.getByRole('combobox', { name: 'Сортировка' }).click()
  await page.getByText('сначала дороже').click()
  const firstPriceText = await productCards.first().locator(priceLocator).textContent()
  const secondPriceText = await productCards.nth(1).locator(priceLocator).textContent()
  expect(getPriceFromText(firstPriceText!) >= getPriceFromText(secondPriceText!))

  // test pagination and products quantity per page
  await expect(productCards).toHaveCount(10)
  await page.getByRole('button', { name: 'Показать еще' }).click()
  await expect(productCards).toHaveCount(20)
  await page.getByRole('button', { name: '3', exact: true }).click() // go to page 3
  await expect(productCards).toHaveCount(10)
  await page.getByRole('combobox', { name: 'Количество на странице' }).click()
  await page.getByRole('option', { name: '40' }).click()
  await expect(productCards).toHaveCount(40)
  await expect(page.getByRole('button', { name: 'Предыдущая' })).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Следующая' })).toBeVisible()

  // filter test
  await page.getByText('с глубиномером', { exact: true }).click()
  await page.getByRole('checkbox', { name: 'нониусный', exact: true }).check()
  await page.getByText('0-150 мм', { exact: true }).click()
  await page.getByRole('button', { name: 'Развернуть' }).nth(5).click()
  await page.getByText('0,05 мм', { exact: true }).click()

  await expect(async () => {
    const filteredProducts = await productCards.count()
    console.log(`filteredProducts: ${JSON.stringify(filteredProducts, null, 2)}`)

    expect(filteredProducts).toBeGreaterThan(2)
    expect(filteredProducts).toBeLessThan(10)
  }).toPass()

  await page.getByRole('button', { name: 'Сбросить' }).click()
  await expect(productCards).toHaveCount(40)
})

const getPriceFromText = (text: string) => {
  return parseInt(text.replace(/\D/g, ''), 10)
}
