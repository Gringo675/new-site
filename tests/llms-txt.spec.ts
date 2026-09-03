import { test, expect } from '@playwright/test'

test('GET /llms.txt returns navigation index for AI crawlers', async ({ page }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''

  // Use page.request for a raw HTTP fetch (no browser rendering needed)
  const response = await page.request.get(new URL('/llms.txt', urlBase).toString())

  // Status code
  expect(response.status()).toBe(200)

  // Content-Type
  const contentType = response.headers()['content-type']
  expect(contentType).toContain('text/plain')
  expect(contentType).toContain('charset=utf-8')

  const body = await response.text()

  // Section markers
  expect(body).toContain('## Каталог')
  expect(body).toContain('## Материалы и статьи')
  expect(body).toContain('## Сервис и информация')
  expect(body).toContain('## API (JSON для AI-агентов)')
  expect(body).toContain('## Для AI-агентов')

  // Links to llms-full.txt and sitemap
  expect(body).toContain('/llms-full.txt')
  expect(body).toContain('/sitemap.xml')

  // Material articles
  expect(body).toContain('/materials/standards')
  expect(body).toContain('/materials/grsi')
  expect(body).toContain('/materials/kak-vybrat-shtangentsirkul')
  expect(body).toContain('/materials/kak-vybrat-mikrometr')
  expect(body).toContain('/materials/chto-takoe-poverka-instrumenta')
  expect(body).toContain('/materials/chto-takoe-kalibrovka-instrumenta')

  // API endpoints
  expect(body).toContain('/api/getData/categories')
  expect(body).toContain('/api/getData/category/{alias}')
  expect(body).toContain('/api/getData/product/{alias}')
})