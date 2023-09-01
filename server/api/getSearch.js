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

  const catsSet = new Set() // собираем все категории
  const propsSet = new Set() // собираем все пропсы
  // вспомогательный массив для сбора пропсов и дальнейшего упорядочивания товаров (без p8_pack)
  const propsGroupOrder = [
    { name: 'p0_brand', order: 8 },
    { name: 'p1_type', order: 1 },
    { name: 'p2_counting_system', order: 2 },
    { name: 'p3_range', order: 3 },
    { name: 'p4_size', order: 4 },
    { name: 'p5_accuracy', order: 5 },
    { name: 'p6_class', order: 6 },
    { name: 'p7_feature', order: 7 },
  ]
  for (const product of products) {
    catsSet.add(product.category_id)
    product.props = [] // собираем активные пропсы
    for (const propsGroup of propsGroupOrder) {
      if (product[propsGroup.name] > 0) {
        product.props.push(product[propsGroup.name])
        propsSet.add(product[propsGroup.name])
      }
    }
    product.image = product.images.match(/\S+/)[0] // берем только первое изображение
    product.price = product.special_price > 0 ? product.special_price : product.price // проверяем наличие спец.цены
  }
  // получаем категории
  const catsID = Array.from(catsSet).join(', ')
  query = `SELECT name, id, parent_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, ordering FROM i_categories WHERE id IN (${catsID}) OR parent_id IN (${catsID})`
  const catsBase = await dbReq(query)

  const catsOrder = {} // вспомогательный объект типа catID: orderingValue для сортировки товаров

  // вкладываем подкатегории в родительские категории, сортируем
  const cats = catsBase
    .filter(cat => cat.parent_id === 0)
    .sort((a, b) => a.ordering - b.ordering)
    .map(cat => {
      catsOrder[cat.id] = cat.ordering
      const cProducts = products.filter(product => product.category_id === cat.id)

      const childs = catsBase
        .filter(subCat => {
          if (subCat.parent_id !== cat.id) return false
          subCat.props = []
          for (const propsGroup of propsGroupOrder) {
            // if (subCat[propsGroup.name] > 0) subCat.props.push([propsGroup.name, subCat[propsGroup.name]]) // [name, value]
            if (subCat[propsGroup.name] > 0) subCat.props.push(subCat[propsGroup.name])
          }
          return cProducts.some(product => subCat.props.every(prop => product.props.includes(prop)))
        })
        .sort((a, b) => a.ordering - b.ordering)
        .map(subCat => {
          // удаляем лишнее
          return {
            name: subCat.name,
            props: subCat.props,
          }
        })
      return {
        id: cat.id,
        name: cat.name,
        childs,
      }
    })

  // получаем пропсы
  query = `SELECT id, group_id, name, ordering FROM i_properties WHERE id IN (${Array.from(propsSet).join(', ')})`
  const props = await dbReq(query)
  const propsOrder = props
    .sort((a, b) => {
      // сначала отсортируем все пропсы по порядку групп
      if (a.group_id !== b.group_id) return propsGroupOrder[a.group_id].order - propsGroupOrder[b.group_id].order
      // затем по порядку значений
      return a.ordering - b.ordering
    })
    .map(prop => prop.id) // нужен только id

  products = products
    .sort((a, b) => {
      // сначала сортируем по порядку категорий
      if (a.category_id !== b.category_id) return catsOrder[a.category_id] - catsOrder[b.category_id]
      // затем по пропсам
      for (const prop of propsOrder) {
        const isA = a.props.includes(prop)
        const isB = b.props.includes(prop)
        if (isA && !isB) return -1
        if (!isA && isB) return 1
      }
      return 0
    })
    .map((product, index) => {
      return {
        id: product.id,
        catId: product.category_id,
        name: product.name,
        alias: product.alias,
        image: product.image,
        price: product.price,
        props: product.props,
        order: index,
      }
    })

  return {
    products,
    cats,
  }
})
