export const useProductMetaDescription = (product: Product) => {
  // no more than 5 props
  const props = product.props
    .slice(0, 5)
    .map(prop => `${prop.name}: ${prop.val}`)
    .join('. ')
  const description = `${product.name} купить по лучшей цене ${product.price} р. с поверкой и доставкой. ${props}. Производитель: ${product.brand.fullName}.`
  useSeoMeta({ description })
}
