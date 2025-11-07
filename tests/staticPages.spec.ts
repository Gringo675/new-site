import { test, expect } from '@playwright/test'

test('test static pages', async ({ page }) => {
  await page.goto('https://test.chelinstrument.ru/')

  await expect(page.getByText('Лидеры продаж')).toBeVisible()
  await expect(page.getByText('Всегда для вас')).toBeVisible()
  await expect(page.getByText('Полезные статьи')).toBeVisible()

  await page.getByRole('link', { name: 'О компании' }).click()
  await expect(page.getByRole('heading', { name: 'О компании' })).toBeVisible()

  await page.getByRole('link', { name: 'Материалы' }).click()
  await expect(page.getByRole('heading', { name: 'Материалы' })).toBeVisible()

  await page.getByRole('link', { name: 'Как выбрать штангенциркуль?' }).click()
  await expect(page.getByRole('heading', { name: 'Как выбрать штангенциркуль?' })).toBeVisible()

  await page.getByRole('link', { name: 'Контакты' }).click()
  await expect(page.getByRole('heading', { name: 'Контакты' })).toBeVisible()
  await expect(page.locator('ymaps').nth(3)).toBeVisible()

  await page.getByRole('button', { name: 'Каталог' }).click()
  await page.getByRole('link', { name: 'Микрометры', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Микрометры' })).toBeVisible()

  await page.getByRole('button', { name: 'Принять' }).click() // cookie banner
})
