export const useProductMetaDescription = (product: Product) => {
  const siteConfig = useSiteConfig()
  const route = useRoute()
  const currentUrl = route.path === '/' ? siteConfig.url : siteConfig.url + route.path
  // no more than 5 props
  const props = product.props
    .slice(0, 5)
    .map(prop => `${prop.name}: ${prop.val}`)
    .join('. ')
  const description = `${product.name} купить по лучшей цене ${product.price} р. с поверкой и доставкой. ${props}. Производитель: ${product.brand.fullName}.`
  const ogImage = product.images?.[0]
    ? `${siteConfig.url}/static/img/products/w_max/${product.images[0]}.jpg`
    : `${siteConfig.url}/img/logo.svg`
  useSeoMeta({
    description,
    ogDescription: description,
    ogImage,
    ogType: 'product',
    ogUrl: currentUrl,
  })
}
