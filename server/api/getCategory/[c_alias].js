export default defineEventHandler(async event => {
  // const start = performance.now()

  const alias = getRouterParam(event, 'c_alias')
  if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Incorrect URI!' })

  // получаем категорию
  let query = `SELECT * FROM i_categories WHERE alias = '${alias}'  AND published = 1 LIMIT 1`
  const catData = (await dbReq(query))[0]
  if (catData === undefined) throw createError({ statusCode: 404, statusMessage: 'Page Not Found!!!!' })

  const catActiveProps = [] // для основных категорий будет пустой массив, для подкатегорий добавляем ниже
  if (catData.parent_id !== 0) {
    for (const key in catData) {
      if (/^p\d_/.test(key) && catData[key].length) catActiveProps.push([key, catData[key]]) // [name, value]
    }
  }

  // получаем товары
  // т.к. товары принадлежат главным категориям, необходимо найти id этого первого родителя
  let productsCatId
  if (catData.parent_id === 0) productsCatId = catData.id
  else {
    // т.к. на данный момент в категориях максимум 2 уровня вложенности, достаточно одного запроса для определения первого родителя
    query = `SELECT parent_id FROM i_categories WHERE id = '${catData.parent_id}' LIMIT 1`
    const parentParentId = (await dbReq(query))[0].parent_id
    productsCatId = parentParentId > 0 ? parentParentId : catData.parent_id
  }
  query = `SELECT id, name, alias, price, special_price, images, label,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack,
                 standart_ids, reestr_ids
                 FROM i_products WHERE category_id = '${productsCatId}' 
                 ${catActiveProps.reduce((acc, prop) => {
                   acc += `AND ${prop[0]} IN (${prop[1]}) ` // [name, value]
                   return acc
                 }, '')}
                 AND published = 1`
  const products = await dbReq(query)
  if (!products.length) return { catData }

  // на основе полученных товаров создаем фильтр
  const filterGroups = useCatProps(productsCatId)
  const allProps = [] // набор из всех уникальных id, для запроса в базу

  for (let propKey in filterGroups) {
    filterGroups[propKey].ids = {} // будем считать, в скольких продуктах присутствует активный пропс, чтобы исключить значения, присутствующие во всех продуктах

    products.forEach(product => {
      if (!filterGroups[propKey].disabled && product[propKey] > 0) {
        filterGroups[propKey].ids[product[propKey]] = (filterGroups[propKey].ids[product[propKey]] || 0) + 1
        if (product.props === undefined) product.props = [] // собираем все пропсы в 1 массив, чтобы легче работать с фильтром
        product.props.push(product[propKey])
      }
      delete product[propKey] // удаляем, больше не понадобится
    })
    for (const id in filterGroups[propKey].ids) {
      if (filterGroups[propKey].ids[id] === products.length) delete filterGroups[propKey].ids[id]
      else allProps.push(id)
    }
  }
  if (!allProps.length) return { catData, products } // нет фильтра

  // получаем пропсы
  query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${allProps.join(',')})`
  const propsArr = await dbReq(query)
  const props = {} // для удобства создаем объект из всех пропсов
  propsArr.forEach(prop => {
    props[prop.id] = { name: prop.name, order: prop.ordering }
  })

  // создаем фильтр: отбираем группы в которых есть пропсы, сортируем группы
  const filter = Object.values(filterGroups)
    .filter(fGroup => !fGroup.disabled && Object.keys(fGroup.ids).length > 0)
    .sort((a, b) => a.ordering - b.ordering)
  filter.forEach(fGroup => {
    fGroup.values = []
    for (const id in fGroup.ids) {
      fGroup.values.push({
        val: Number(id),
        name: props[id].name,
      })
    }
    fGroup.values.sort((a, b) => props[a.val].order - props[b.val].order)
    // удаляем ненужное
    delete fGroup.ordering
    delete fGroup.ids
  })

  // упорядочиваем товары по фильтру
  products.sort((a, b) => {
    for (const fGroup of filter) {
      for (const prop of fGroup.values) {
        const isA = a.props.includes(prop.val)
        const isB = b.props.includes(prop.val)
        if (isA && !isB) return -1
        if (!isA && isB) return 1
      }
    }
    return 0
  })

  const stnds = new Set()
  const rstrs = new Set()

  for (const [i, product] of products.entries()) {
    product.order = i
    product.image = product.images.match(/^[^,]+/)[0] // берем только первое изображение
    // проверяем, есть ли на продукт спец. цена
    if (product.special_price > 0) {
      product.priceRegular = product.price
      product.price = product.special_price
    }
    // обрабатываем документацию
    if (product.standart_ids.length) product.standart_ids.split(',').forEach(stnd => stnds.add(stnd))
    if (product.reestr_ids.length) product.reestr_ids.split(',').forEach(rstr => rstrs.add(rstr))
    // удаляем ненужное
    delete product.images
    delete product.reestr_ids
    delete product.standart_ids
    delete product.special_price
  }

  // catData.docs = {}
  if (stnds.size) {
    query = `SELECT number, name, file FROM i_docs_stnd
                 WHERE id IN (${Array.from(stnds).join(',')})`
    ;(catData.docs = catData.docs || {}).stnd = await dbReq(query)
  }
  if (rstrs.size) {
    query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr
                 WHERE id IN (${Array.from(rstrs).join(',')})`
    ;(catData.docs = catData.docs || {}).rstr = await dbReq(query)
  }

  // удаляем ненужное
  delete catData.parent_id
  delete catData.published

  // const catPerformance = Math.round(performance.now() - start)
  // cv({ catPerformance })
  return { catData, products, filter }
})
