// llms.txt — navigation index for AI crawlers (GPTBot, PerplexityBot, etc.)
// Serves a curated overview of the site's canonical content surface.

export default defineEventHandler(async event => {
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
    '# Челябинский Инструмент',
    '',
    '> ООО ТД «Челябинский Инструмент» — комплексные поставки профессионального измерительного инструмента, калибров, приборов и оснастки.',
    '',
    '## Каталог',
    '- [Каталог инструментов](/catalog): Полный ассортимент приборов и калибров',
    ...flatCats.map(c => `- [${c.name}](/catalog/${c.alias})`),
    '',
    '## Материалы и статьи',
    '- [Полезные статьи и обзоры](/materials)',
    '- [Онлайн-поиск по ФГИС РСТ](/materials/fgis): описания типов (ОТ), методики поверки (МП), подбор приборов в каталоге',
    '- [Нормативная документация (ГОСТы, ТУ)](/materials/standards)',
    '- [ФГИС ГРСИ: описания типов и методики поверки](/materials/grsi)',
    '- [Как выбрать штангенциркуль?](/materials/kak-vybrat-shtangentsirkul)',
    '- [Как выбрать микрометр?](/materials/kak-vybrat-mikrometr)',
    '- [Что такое поверка инструмента?](/materials/chto-takoe-poverka-instrumenta)',
    '- [Что такое калибровка инструмента?](/materials/chto-takoe-kalibrovka-instrumenta)',
    '',
    '## Сервис и информация',
    '- [О компании](/about)',
    '- [Контакты](/contacts)',
    '- [Как купить](/help)',
    '- [Доставка](/shipping)',
    '- [Возврат](/returns)',
    '- [Гарантия](/warranty)',
    '- [Поверка и калибровка](/poverka)',
    '- [Политика конфиденциальности](/privacy)',
    '',
    '## API (JSON для AI-агентов)',
    '- [Дерево категорий](/api/getData/categories): id, name, alias, children',
    '- [Данные категории](/api/getData/category/{alias}): категория с товарами, фильтрами и документами',
    '- [Данные товара](/api/getData/product/{alias}): товар с характеристиками, документами и рекомендациями',
    '',
    '## Для AI-агентов',
    '- [Полная версия базы знаний](/llms-full.txt)',
    '- [Карта сайта](/sitemap.xml)',
  ]

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return lines.join('\n')
})
