# Implementation Plan: 01 — llms.txt Navigation Index

## Files to create

### 1. `server/routes/llms.txt.ts` (new)

Server route at `GET /llms.txt`. Reuses the existing `/api/getData/categories` endpoint to fetch the full category tree, then flattens it. Includes a fallback static list if the API is unavailable.

```ts
// llms.txt — navigation index for AI crawlers (GPTBot, PerplexityBot, etc.)
// Serves a curated overview of the site's canonical content surface.

export default defineEventHandler(async (event) => {
  // Fetch the full category tree from the existing API
  let flatCats: { name: string; alias: string; level: number }[] = []
  try {
    const tree = await $fetch('/api/getData/categories')

    function flatten(catsArr: any[], level = 0) {
      if (!Array.isArray(catsArr)) return
      for (const cat of catsArr) {
        flatCats.push({ name: cat.name, alias: cat.alias, level })
        if (cat.children && Array.isArray(cat.children)) {
          flatten(cat.children, level + 1)
        }
      }
    }
    flatten(tree)
  } catch {
    // If the API is unavailable, fall back to a minimal static list
    flatCats = [
      { name: 'Штангенинструмент', alias: 'shtangeninstrument', level: 0 },
      { name: 'Микрометры', alias: 'mikrometry', level: 0 },
    ]
  }

  const lines: string[] = [
    '# llms.txt — Челябинский Инструмент',
    '',
    '## Каталог',
    '/catalog — Каталог инструментов',
    ...flatCats.map((c) => `- /catalog/${c.alias} — ${c.name}`),
    '',
    '## Материалы и статьи',
    '/materials — Полезные статьи и обзоры',
    '',
    '## Сервис и информация',
    '/about — О компании',
    '/contacts — Контакты',
    '/help — Как купить',
    '/shipping — Доставка',
    '/returns — Возврат',
    '/warranty — Гарантия',
    '/poverka — Поверка и калибровка',
    '/privacy — Политика конфиденциальности',
    '',
    '## API (JSON для AI-агентов)',
    '/api/getData/categories — Дерево категорий (id, name, alias, children)',
    '/api/getData/category/{alias} — Категория с товарами, фильтрами и документами',
    '/api/getData/product/{alias} — Товар с характеристиками, документами и рекомендациями',
    '',
    '## Для AI-агентов',
    '/llms-full.txt — Полная версия контента',
    '/sitemap.xml — Карта сайта',
  ]

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return lines.join('\n')
})
```

### 2. `tests/llms-txt.spec.ts` (new)

Playwright E2E test using `page.request.get()` for raw HTTP fetch (no browser rendering needed).

```ts
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
  expect(body).toContain('## Для AI-агентов')

  // Links to llms-full.txt and sitemap
  expect(body).toContain('/llms-full.txt')
  expect(body).toContain('/sitemap.xml')
})
```

## Design decisions

- **Reuses `/api/getData/categories`** instead of querying DB directly — avoids duplicating the DB query logic and `sortCategories` call.
- **Flattens the full tree** (all levels) following the same pattern as `mapCats` in `app/pages/admin/cms/aiCatDescription.vue:21-36`.
- **JSON API section** tells LLMs about structured data endpoints (`/api/getData/category/{alias}`, `/api/getData/product/{alias}`) so they can fetch machine-readable JSON instead of scraping HTML.
- **Fallback static list** ensures the endpoint never fails even if the DB/API is down.
- **No auth** — endpoint is served openly, matching the pattern in `robots.txt.ts`.

## Checklist (from issue)

- [x] `GET /llms.txt` returns HTTP 200 with `Content-Type: text/plain; charset=utf-8`
- [x] Body contains a curated list of key site sections: catalog (all categories flattened), materials/articles, and service/marketing pages
- [x] Body contains a link to `/llms-full.txt`
- [x] Body contains a link to `/sitemap.xml`
- [x] The endpoint is served openly (no auth), and `robots.txt` is unchanged
- [x] Playwright E2E test verifies the above: status, content-type, presence of section markers, and the two links