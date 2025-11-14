import { test, expect } from '@playwright/test'
test.use({
  viewport: { width: 400, height: 600 },
})

test('test', async ({ page }) => {
  await page.goto('https://test.chelinstrument.ru/')
  // await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Меню' }).click()
  await page.getByRole('button', { name: 'Весь каталог инструмента' }).click()
  await expect(page.getByRole('heading', { name: 'Каталог инструментов' })).toBeVisible()

  await page.getByRole('button', { name: 'Меню' }).click()
  await page.getByRole('button', { name: 'Контакты' }).click()
  await expect(page.getByRole('heading', { name: 'Контакты' })).toBeVisible()

  // не видит поп-ап поверх другого поп-апа, поэтому сначала закрываем баннер cookie
  // p.s. баннер Запустили новый сайт тоже тормозит тест, пока не исчезнет сам. Но т.к. он временный, пусть так
  await page.getByRole('button', { name: 'Принять' }).click()

  await page.getByRole('button', { name: 'Меню' }).click()
  await page.getByRole('button', { name: 'Быстрый заказ' }).click()
  await expect(page.getByRole('heading', { name: 'Быстрый заказ' })).toBeVisible()
  await page.getByRole('button', { name: 'Отмена' }).click()

  await page.getByRole('button', { name: 'Меню' }).click()
  await page.getByRole('button', { name: 'Войти / зарегистрироваться' }).click()
  await expect(page.getByRole('heading', { name: 'Вход/регистрация' })).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByRole('button', { name: 'Каталог' }).click()
  await page.getByRole('link', { name: 'Индикаторы' }).click()
  await expect(page.getByRole('heading', { name: 'Индикаторы' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Индикаторы ИЧ часового типа' })).toBeVisible()
  await expect(page.getByTestId('product-card')).toHaveCount(10) // 10 product cards on the  page
  await page.getByRole('button', { name: 'Подбор по параметрам' }).click()
  await expect(page.getByText('Тип', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Каталог' }).click()
  await page.getByRole('textbox', { name: 'Поиск по каталогу' }).fill('250')
  await expect(page.getByRole('button', { name: 'Все результаты' })).toBeVisible()
  const productBlock = page.getByTestId('product-links-block')
  const productLinks = productBlock.locator('a')
  await expect(productLinks).toHaveCount(10)
  const firstLinkText = await productLinks.first().textContent()
  await productLinks.first().click()
  await expect(page.getByRole('heading', { name: firstLinkText })).toBeVisible()
  await page.getByRole('button', { name: 'Добавить в корзину' }).click()
  await page.getByRole('button', { name: 'Добавить' }).click()
  await expect(page.getByRole('link', { name: '2', exact: true })).toBeVisible()
})
