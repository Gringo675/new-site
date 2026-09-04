// llms-full.txt — Full plain-text knowledge base & catalog corpus for AI engines
//
// Архитектура генерации llms-full.txt:
// 1. ДИНАМИЧЕСКИЙ КОНТЕНТ (Каталог):
//    - Читается напрямую из таблицы `i_categories WHERE published = 1` при каждом запросе.
//    - Поля `description` и `characteristics` конвертируются из HTML в читаемый Markdown через `htmlToMarkdown()`.
//    - Исключены прямые ссылки на товары (/product/*) во избежание загромождения файла.
//    - Изменения и AI-генерации текстов категорий в админке сразу отражаются в этом эндпоинте.
// 2. СТАТИЧЕСКИЙ КОНТЕНТ (Статьи и Сервис):
//    - Хранится в формате Markdown в `server/assets/articles/*.md` и `server/assets/pages/*.md`.
//    - Читается через стандартный сторадж Nitro `useStorage('assets:server')`, что гарантирует
//      автоматическое включение файлов в production-сборку (`.output/server`) без внешних зависимостей.
//    - Включает только содержательные разделы с высокой информационной ценностью (О компании, Контакты, Поверка).
//      Низкоинформативные юридические/сервисные заглушки исключены для снижения шума при индексации AI-краулерами.
// 3. КЭШИРОВАНИЕ И ПРОИЗВОДИТЕЛЬНОСТЬ:
//    - В `nuxt.config.ts` настроено SWR-кэширование (`swr: 2 * 60 * 60` — 2 часа в production), аналогично каталогу.
//    - Отдается открыто (без авторизации) с заголовком `Content-Type: text/plain; charset=utf-8`.

interface CategoryRow {
  id: number
  parent_id: number
  name: string
  alias: string
  description?: string
  characteristics?: string
}

export default defineEventHandler(async (event) => {
  const storage = useStorage('assets:server')

  // Helper to load static markdown assets safely
  async function loadServerAsset(assetKey: string): Promise<string> {
    try {
      const content = await storage.getItem<string>(assetKey)
      return content ? content.trim() : ''
    } catch (err) {
      console.error(`Failed to read server asset: ${assetKey}`, err)
      return ''
    }
  }

  // 1. Fetch all published categories
  let categories: CategoryRow[] = []
  try {
    const query = `SELECT id, parent_id, name, alias, description, characteristics 
                   FROM i_categories 
                   WHERE published = 1 
                   ORDER BY id ASC`
    categories = (await dbReq(query)) as CategoryRow[]
  } catch (err) {
    console.error('Error fetching categories for llms-full.txt:', err)
  }

  // Map of categories by ID for parent lookup
  const catMap = new Map<number, CategoryRow>()
  categories.forEach((cat) => catMap.set(cat.id, cat))

  const sections: string[] = []

  // Header & introduction
  sections.push(
    '# База знаний и каталог продукции — ООО ТД «Челябинский Инструмент»',
    '',
    '> ООО ТД «Челябинский Инструмент» — комплексные поставки профессионального измерительного инструмента, калибров, приборов и оснастки по всей России и странам СНГ с 2000 года.',
    '> Официальный дистрибьютор и партнер заводов: ЧИЗ (Челябинский инструментальный завод), СТИЗ (Ставропольский инструментальный завод), КировИнструмент, ИТО-Туламаш, GRIFF.',
    '> Метрологическое обеспечение: организация первичной и периодической поверки / калибровки в аккредитованных лабораториях с внесением в ФГИС «АРШИН».',
    '> Официальный сайт: https://chelinstrument.ru',
    '> Контакты: +7 (351) 790-77-48, info@chelinstrument.ru',
    '> Доставка: по всей России и СНГ через ТК (Деловые Линии, СДЭК, ПЭК, GTD) и самовывоз со склада в Челябинске (ул. Болейко, 5).',
    '> Оплата: безналичный расчет с НДС 20% для юридических лиц и ИП.',
    '',
    '---',
    '',
    '# 1. Каталог и технические характеристики категорий',
    '',
  )

  // 2. Categories content
  for (const cat of categories) {
    const parent = cat.parent_id > 0 ? catMap.get(cat.parent_id) : null
    const parentInfo = parent ? ` (Родительская категория: ${parent.name})` : ''

    const descMd = htmlToMarkdown(cat.description)
    const charsMd = htmlToMarkdown(cat.characteristics)

    sections.push(`## Категория: ${cat.name}${parentInfo}`)
    sections.push(`- URL: /catalog/${cat.alias}`)
    sections.push('')

    if (descMd) {
      sections.push('### Назначение и описание')
      sections.push(descMd)
      sections.push('')
    }

    if (charsMd) {
      sections.push('### Технические характеристики и стандарты')
      sections.push(charsMd)
      sections.push('')
    }

    sections.push('---', '')
  }

  // 3. Informational articles & guides
  sections.push('# 2. Обучающие и технические статьи', '')

  const articleFiles = [
    {
      title: 'Как выбрать штангенциркуль?',
      url: '/materials/kak-vybrat-shtangentsirkul',
      assetKey: 'articles/kak-vybrat-shtangentsirkul.md',
    },
    {
      title: 'Как выбрать микрометр?',
      url: '/materials/kak-vybrat-mikrometr',
      assetKey: 'articles/kak-vybrat-mikrometr.md',
    },
    {
      title: 'Что такое поверка инструмента?',
      url: '/materials/chto-takoe-poverka-instrumenta',
      assetKey: 'articles/chto-takoe-poverka-instrumenta.md',
    },
    {
      title: 'Что такое калибровка инструмента?',
      url: '/materials/chto-takoe-kalibrovka-instrumenta',
      assetKey: 'articles/chto-takoe-kalibrovka-instrumenta.md',
    },
  ]

  for (const article of articleFiles) {
    const content = await loadServerAsset(article.assetKey)
    sections.push(`## Статья: ${article.title}`)
    sections.push(`- URL: ${article.url}`)
    sections.push('')
    if (content) {
      sections.push(content)
      sections.push('')
    }
    sections.push('---', '')
  }

  // Standards and GRSI registry sections
  sections.push(
    '## Нормативная база и реестры средств измерений',
    '- URL: /materials/standards — Справочник государственных стандартов (ГОСТ, ГОСТ Р, ТУ) на измерительный инструмент.',
    '- URL: /materials/grsi — Федеральный информационный фонд ГРСИ: описания типов средств измерений и методики поверки (МИ).',
    '',
    '---',
    '',
  )

  // 4. Marketing and service core pages
  sections.push('# 3. Информация о компании и метрологических услугах', '')

  const serviceFiles = [
    {
      title: 'О компании',
      url: '/about',
      assetKey: 'pages/about.md',
    },
    {
      title: 'Контакты, реквизиты и склад',
      url: '/contacts',
      assetKey: 'pages/contacts.md',
    },
    {
      title: 'Поверка и калибровка средств измерений',
      url: '/poverka',
      assetKey: 'pages/poverka.md',
    },
  ]

  for (const page of serviceFiles) {
    const content = await loadServerAsset(page.assetKey)
    sections.push(`## ${page.title}`)
    sections.push(`- URL: ${page.url}`)
    sections.push('')
    if (content) {
      sections.push(content)
      sections.push('')
    }
    sections.push('---', '')
  }

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return sections.join('\n')
})
