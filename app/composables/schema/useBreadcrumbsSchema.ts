interface Crumb {
  name: string
  alias?: string // alias опционален, т.к. у последней крошки (товара) его не будет
}

export const useBreadcrumbsSchema = (items: Crumb[]) => {
  const siteConfig = useSiteConfig()

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: siteConfig.url,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Каталог',
      item: `${siteConfig.url}/catalog`,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 3,
      name: item.name,
      // Добавляем URL для всех элементов, кроме последнего
      item: index !== items.length - 1 ? `${siteConfig.url}/catalog/${item.alias}` : undefined,
    })),
  ]

  useSchemaOrg([
    defineBreadcrumb({
      itemListElement,
    }),
  ])
}
