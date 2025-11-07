import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://test.chelinstrument.ru/')
  await page.waitForTimeout(4000)
  await page.getByRole('button', { name: 'Войти' }).click()
  await expect(page.getByRole('heading', { name: 'Вход/регистрация' })).toBeVisible()
  const page1Promise = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'Войти через google' }).click()
  const page1 = await page1Promise
  await expect(page1.getByText('Sign in with Google')).toBeVisible()
  await page1.close()
  const page2Promise = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'Войти через vk' }).click()
  const page2 = await page2Promise
  await expect(page2.getByText('Sign in to «chelinstrument.ru»')).toBeVisible()
  await page2.close()
  const page3Promise = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'Войти через mail.ru' }).click()
  const page3 = await page3Promise
  await expect(page3.locator('[data-test-id="header-text"]')).toBeVisible()
  await page3.close()
  await page.getByRole('textbox', { name: 'Ваша почта' }).click()
  await page.getByRole('textbox', { name: 'Ваша почта' }).fill('ttt@ddd.ru')
})
