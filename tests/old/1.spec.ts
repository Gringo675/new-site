import { test, expect } from '@playwright/test'

test.describe('Product Page', () => {
  // test('buttons check', async ({ page }) => {
  //   await page.goto('http://localhost:3000/product/shtangentsirkul-shts-i-125-0-1-kl-2-stiz')

  //   // Verify Add to Cart button
  //   await page.getByRole('button', { name: 'Добавить в корзину' }).click()

  //   // Verify product image
  //   await page.getByRole('tab', { name: 'Документация' }).click()

  //   // The test will pause here, leaving the browser open
  //   await page.pause()
  // })

  test('Order from Catalog', async ({ page }) => {
    await page.goto('https://test.chelinstrument.ru/catalog')

    await page.getByRole('link', { name: 'Штангенциркули', exact: true }).click()

    await expect(page.getByRole('tabpanel', { name: 'Описание' })).toBeVisible()

    await page.getByRole('link', { name: 'Штангенциркули ШЦ-II разметочные' }).click()
    await expect(page.getByRole('link', { name: 'Штангенциркули' })).toBeVisible()

    await page.getByRole('button', { name: 'В корзину' }).nth(3).click()
    await expect(page.getByRole('link', { name: '1', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Добавить' }).click()
    await expect(page.getByRole('link', { name: '2', exact: true })).toBeVisible()

    await page.locator('div:nth-child(10) > .col-span-2 > .rounded-md').click()
    await expect(page.getByRole('link', { name: '3', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Убавить' }).nth(1).click()
    await expect(page.getByRole('link', { name: '2', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Показать еще' }).click()
    await expect(page.getByRole('link', { name: 'Штангенциркуль с твердым спл. ШЦТ-II-250-0,05 ЧИЗ' })).toBeVisible()

    await page.locator('div:nth-child(20) > .col-span-2 > .rounded-md').click()
    await expect(page.getByRole('link', { name: '3', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Добавить' }).nth(1).click()
    await expect(page.getByRole('link', { name: '4', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Добавить' }).nth(1).click()
    await expect(page.getByRole('link', { name: '5', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Убавить' }).nth(1).click()
    await expect(page.getByRole('banner')).toContainText('4')
    await page.getByRole('link', { name: '4', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Корзина' })).toBeVisible()

    await page.getByRole('button', { name: 'Добавить' }).first().click()
    await expect(page.getByRole('link', { name: '5', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Убавить' }).nth(1).click()
    await expect(page.getByRole('banner')).toContainText('4')
    await page.getByRole('textbox', { name: 'Комментарий к заказу' }).click()
    await page.getByRole('textbox', { name: 'Комментарий к заказу' }).fill('Комментарий для тестового заказа.')
    await page.getByRole('button', { name: 'Оформить заказ' }).click()
    await expect(page.getByRole('heading', { name: 'Оформление заказа' })).toBeVisible()

    await page.getByRole('button', { name: 'Продолжить без авторизации' }).click()
    await page.getByRole('textbox', { name: 'Имя*' }).click()
    await page.getByRole('textbox', { name: 'Имя*' }).fill('Test Name')
    await page.getByRole('textbox', { name: 'Почта*' }).click()
    await page.getByRole('textbox', { name: 'Почта*' }).fill('test@mail.ru')
    await page.getByRole('textbox', { name: 'Организация' }).click()
    await page.getByRole('textbox', { name: 'Организация' }).fill('ООО "Тест"')
    await page.getByRole('textbox', { name: 'ИНН' }).click()
    await page.getByRole('textbox', { name: 'ИНН' }).fill('1234567890')
    await page.getByRole('textbox', { name: 'Адрес' }).click()
    await page.getByRole('textbox', { name: 'Адрес' }).fill('тестовый адрес')
    await page.getByRole('textbox', { name: 'Телефон' }).click()
    await page.getByRole('textbox', { name: 'Телефон' }).fill('495 123-45-67')

    // await page.getByRole('button', { name: 'Оформить заказ' }).click()
  })
})
