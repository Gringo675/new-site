import { test, expect } from '@playwright/test'

test('test login, user pages and feedback', async ({ page }) => {
  // test.slow()

  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'

  await page.goto(urlBase)

  await page.getByRole('button', { name: 'Войти' }).click()
  await expect(page.getByRole('heading', { name: 'Вход/регистрация' })).toBeVisible()

  await page.getByRole('button', { name: 'Войти через google' }).click()
  const googlePage = await page.waitForEvent('popup')
  await expect(googlePage.getByText('Sign in with Google')).toBeVisible({ timeout: 15000 })
  await expect(googlePage.getByText('to continue to chelinstrument.ru')).toBeVisible()
  await googlePage.close()

  await page.getByRole('button', { name: 'Войти через vk' }).click()
  const vkPage = await page.waitForEvent('popup')
  await expect(vkPage.getByText('Sign in to «chelinstrument.ru»')).toBeVisible({ timeout: 15000 })
  await vkPage.close()

  await page.getByRole('button', { name: 'Войти через mail.ru' }).click()
  const mailruPage = await page.waitForEvent('popup')
  await expect(mailruPage.getByText('Sign in to the account')).toBeVisible({ timeout: 15000 })
  await mailruPage.close()

  await page.getByRole('textbox', { name: 'Ваша почта' }).fill(process.env.TEST_USER_EMAIL ?? '')

  await page.getByRole('button', { name: 'Получить код авторизации' }).click()
  const userCode = process.env.TEST_USER_CODE ?? ''
  await page.getByRole('textbox', { name: 'pin input 1 of' }).fill(userCode[0] ?? '')
  await page.getByRole('textbox', { name: 'pin input 2 of' }).fill(userCode[1] ?? '')
  await page.getByRole('textbox', { name: 'pin input 3 of' }).fill(userCode[2] ?? '')
  await page.getByRole('textbox', { name: 'pin input 4 of' }).fill(userCode[3] ?? '')
  await page.getByRole('textbox', { name: 'pin input 5 of' }).fill(userCode[4] ?? '')
  await expect(page.getByText('Авторизация пройдена!', { exact: true })).toBeVisible()

  const userButton = page.locator('button:has(.i-heroicons\\:user)')
  await userButton.click()
  await page.getByRole('link', { name: 'Профиль' }).click()
  await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Сохранить изменения' })).toBeVisible()
  await userButton.click()
  await page.getByRole('link', { name: 'Заказы' }).click()
  await expect(page.getByRole('heading', { name: 'История заказов' })).toBeVisible()

  await page.getByRole('button', { name: 'Принять' }).click() // cookie banner overlaps feedback's submit button

  // await page.getByRole('button', { name: 'Быстрый заказ' }).click()
  // await expect(page.getByRole('textbox', { name: 'Почта*' })).toHaveValue(process.env.TEST_USER_EMAIL ?? '')
  // await page.getByRole('textbox', { name: 'Сообщение' }).fill('Тестовое сообщение')
  // await page.getByRole('button', { name: 'Ok' }).click()
  // await expect(page.getByText('Сообщение отправлено!', { exact: true })).toBeVisible()

  await userButton.click()
  await page.getByRole('link', { name: 'Выход' }).click()
  await expect(page.getByRole('button', { name: 'Войти', exact: true })).toBeVisible()
})
