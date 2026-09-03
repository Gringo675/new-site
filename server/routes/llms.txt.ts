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
    '/materials/standards — Нормативная документация (ГОСТы, ТУ)',
    '/materials/grsi — ФГИС ГРСИ: описания типов и методики поверки',
    '/materials/kak-vybrat-shtangentsirkul — Как выбрать штангенциркуль?',
    '/materials/kak-vybrat-mikrometr — Как выбрать микрометр?',
    '/materials/chto-takoe-poverka-instrumenta — Что такое поверка?',
    '/materials/chto-takoe-kalibrovka-instrumenta — Что такое калибровка?',
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