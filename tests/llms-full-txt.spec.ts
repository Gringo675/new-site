import { test, expect } from '@playwright/test'

test('GET /llms-full.txt returns full plain-text knowledge corpus for AI engines', async ({ page }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''

  // Raw HTTP request without browser rendering
  const response = await page.request.get(new URL('/llms-full.txt', urlBase).toString())

  // 1. Status and Content-Type
  expect(response.status()).toBe(200)
  const contentType = response.headers()['content-type']
  expect(contentType).toContain('text/plain')
  expect(contentType).toContain('charset=utf-8')

  const body = await response.text()

  // 2. High-level sections
  expect(body).toContain('# База знаний и каталог продукции — ООО ТД «Челябинский Инструмент»')
  expect(body).toContain('# 1. Каталог и технические характеристики категорий')
  expect(body).toContain('# 2. Обучающие и технические статьи')
  expect(body).toContain('# 3. Информация о компании и метрологических услугах')

  // 3. Category names and descriptions presence
  expect(body).toContain('Штангенциркули')
  expect(body).toContain('/catalog/shtangentsirkuli')
  expect(body).toContain('Микрометры')
  expect(body).toContain('/catalog/mikrometry')

  // 4. Articles presence
  expect(body).toContain('/materials/kak-vybrat-shtangentsirkul')
  expect(body).toContain('Как выбрать штангенциркуль')
  expect(body).toContain('/materials/kak-vybrat-mikrometr')
  expect(body).toContain('Как выбрать микрометр')
  expect(body).toContain('/materials/chto-takoe-poverka-instrumenta')
  expect(body).toContain('Что такое поверка')
  expect(body).toContain('/materials/chto-takoe-kalibrovka-instrumenta')
  expect(body).toContain('Что такое калибровка')

  // 5. Core company and service pages presence
  expect(body).toContain('/about')
  expect(body).toContain('/contacts')
  expect(body).toContain('/poverka')

  // 6. Exclusion of product-page URLs
  // Must NOT contain links to individual product pages (e.g. /product/...)
  expect(body).not.toMatch(/\/product\/[a-zA-Z0-9_-]+/)

  // 7. Absence of raw HTML tags
  expect(body).not.toMatch(/<\/?(div|p|span|table|tbody|thead|tr|th|td|ul|ol|li|strong|b|em|i|a|header|section|article|button|img|h1|h2|h3|h4|h5|h6)[^>]*>/i)
})
