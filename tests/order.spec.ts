import { test, expect } from '@playwright/test'

test('test cart and order', async ({ page, browserName }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  await page.goto(urlBase + 'catalog/mikrometry')

  const productCards = page.getByTestId('product-card')
  const cartButton = page.locator('a[href="/user/cart"]')
  const firstProduct = await productCards.first()
  const secondProduct = await productCards.nth(1)
  const thirdProduct = await productCards.nth(2)

  await firstProduct.getByRole('button', { name: 'В корзину' }).click()
  await expect(cartButton).toHaveText('1')
  await firstProduct.getByRole('button', { name: 'Убавить' }).click()
  await expect(cartButton).toHaveText('0')
  await firstProduct.getByRole('button', { name: 'В корзину' }).click()
  await secondProduct.getByRole('button', { name: 'В корзину' }).click()
  await secondProduct.getByRole('button', { name: 'Добавить' }).click()
  await thirdProduct.getByRole('button', { name: 'В корзину' }).click()
  await thirdProduct.getByRole('button', { name: 'Добавить' }).click()
  await thirdProduct.getByRole('button', { name: 'Добавить' }).click()
  await thirdProduct.getByRole('button', { name: 'Добавить' }).click()
  await thirdProduct.getByRole('button', { name: 'Убавить' }).click()
  await expect(cartButton).toHaveText('6')

  // go to second product page
  await secondProduct.getByRole('link').click()
  await expect(page.getByPlaceholder('Количество').first()).toHaveValue('2')
  // reload to another page to check cart state persistence
  await page.goto(urlBase)

  await cartButton.click()
  const currentDate = new Date().toLocaleDateString('ru-RU')
  await expect(productCards).toHaveCount(3)
  await expect(page.getByRole('complementary')).toContainText('Товаров:6')
  await expect(page.getByRole('button', { name: 'Очистить корзину' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Комментарий к заказу' }).click()
  await page.getByRole('textbox', { name: 'Комментарий к заказу' }).fill(`Тестовый заказ от ${currentDate}`)
  await page.getByRole('button', { name: 'Оформить заказ' }).click()
  await expect(page.getByRole('button', { name: 'Войти/зарегистрироваться' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Назад в корзину' })).toBeVisible()
  await page.getByRole('button', { name: 'Продолжить без авторизации' }).click()
  await page.getByRole('textbox', { name: 'Имя*' }).fill('Тест')
  await page.getByRole('textbox', { name: 'Почта*' }).fill(process.env.TEST_USER_EMAIL ?? '')
  await page.getByRole('textbox', { name: 'Организация' }).fill('АО "Тест"')
  await page.getByRole('textbox', { name: 'ИНН' }).fill('1234567890')
  await page.getByRole('textbox', { name: 'Адрес' }).fill('г. Тест, ул. Тест')
  await page.getByRole('textbox', { name: 'Телефон' }).fill('123 456-78-90')

  // send email only in chromium to avoid spamming
  if (browserName === 'chromium') {
    await page.getByRole('button', { name: 'Оформить заказ' }).click()
    await expect(page.getByRole('heading', { name: /Заказ № \d+ успешно создан!/ })).toBeVisible()
  }
})
