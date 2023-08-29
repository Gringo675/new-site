/**
 * выполняет поиск по каталогу
 * q - строка поиска
 * f - флаг быстрого поиска (max 20 результатов)
 */
export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 3000))
  const { q, f } = getQuery(event)
  if (typeof q !== 'string' || q.length < 3) throw createError({ statusCode: 505, statusMessage: `Incorrect request!` })
  const fastSearch = f === '1'

  let query = `SELECT id, name, alias, category_id, price, special_price, images, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack FROM i_products WHERE name LIKE '%${q}%' LIMIT ${
    fastSearch ? '10' : '100'
  }`
  let products = await dbReq(query)

  if (!products.length) return null

  // получаем все категории и подкатегории
  const catsSet = new Set(products.map(product => product.category_id))
  const catsID = Array.from(catsSet).join(', ')
  query = `SELECT name, alias, id, parent_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, ordering FROM i_categories WHERE id IN (${catsID}) OR parent_id IN (${catsID})`
  const catsBase = await dbReq(query)

  const cats = catsBase
    .filter(cat => cat.parent_id === 0)
    .map(cat => {
      const cProducts = products.filter(product => product.category_id === cat.id)

      const childs = catsBase
        .filter(subCat => {
          if (subCat.parent_id !== cat.id) return false
          subCat.activeProps = []
          for (const key in subCat) {
            if (/^p\d_/.test(key) && subCat[key] > 0) subCat.activeProps.push([key, subCat[key]]) // [name, value]
          }
          return cProducts.some(product => subCat.activeProps.every(prop => product[prop[0]] === prop[1]))
        })
        .map(subCat => {
          // удаляем лишнее
          return {
            name: subCat.name,
            alias: subCat.alias,
            activeProps: subCat.activeProps,
          }
        })
      return {
        name: cat.name,
        alias: cat.alias,
        childs,
      }
    })
  // console.log(`cats: ${JSON.stringify(cats, null, 2)}`)

  // todo: sort products, labels
  products = products.map(product => {
    // берем только первое изображение
    const image = product.images.match(/\S+/)[0]
    // проверяем наличие спец.цены
    const price = product.special_price > 0 ? product.special_price : product.price
    // собираем активные параметры
    const activeProps = Object.fromEntries(
      Object.keys(product)
        .filter(key => /^p\d_/.test(key) && product[key] > 0)
        .map(key => {
          return [key, product[key]]
        })
    )
    return {
      name: product.name,
      alias: product.alias,
      image,
      price,
      activeProps,
    }
  })
  console.log(`products: ${JSON.stringify(products, null, 2)}`)
  return {
    products,
    cats,
  }
})
