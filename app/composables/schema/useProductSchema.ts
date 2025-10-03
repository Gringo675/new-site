export const useProductSchema = (product: Product) => {
  const siteConfig = useSiteConfig()

  useSchemaOrg([
    defineProduct({
      name: product.name,
      sku: String(product.id),
      description: stripHtml(product.description),
      image: product.images.map(img => `${siteConfig.url}/static/img/products/w_max/${img}.jpg`),
      brand: {
        '@type': 'Brand',
        name: product.brand.fullName,
      },
      additionalProperty: product.props.map(prop => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.val,
      })),
      offers: {
        '@type': 'Offer',
        url: `${siteConfig.url}/product/${product.alias}`,
        price: product.price,
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: product.price,
          priceCurrency: 'RUB',
          valueAddedTaxIncluded: false,
        },
      },
    }),
  ])
}
