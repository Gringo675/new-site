export const useCategoryMetaDescription = (cat: Category) => {
  const siteConfig = useSiteConfig()
  let description = `${cat.name} купить по ценам производителя с поверкой и доставкой.`
  if (cat.docs) {
    if (cat.docs.stnd?.length) {
      description += ` ${cat.docs.stnd.map(item => item.number).join(', ')}.`
    }
    if (cat.docs.rstr?.length) {
      description += ` ГРСИ ${cat.docs.rstr.map(item => item.number).join(', ')}.`
    }
  }

  description += ' Консультации по подбору измерительного инструмента. Гарантия качества.'
  
  const ogImage = cat.image
    ? `${siteConfig.url}/static/img/categories/${cat.image}`
    : `${siteConfig.url}/img/logo.svg`

  useSeoMeta({
    description,
    ogDescription: description,
    ogImage,
    ogType: 'website',
  })
}
