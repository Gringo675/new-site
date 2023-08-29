export default defineEventHandler(async event => {
  // const start = performance.now()

  const { alias } = getQuery(event)
  if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Parsing alias error!' })

  // получаем категорию
  let query = `SELECT * FROM i_categories WHERE alias = '${alias}'  AND published = 1 LIMIT 1`
  const catData = (await dbReq(query))[0]
  if (catData === undefined) throw createError({ statusCode: 404, statusMessage: 'Page Not Found!!!!' })

  // если основная категория получаем дочерние подкатегории
  if (catData.parent_id === 0) {
    query = `SELECT name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.id}' AND published = 1
                 ORDER BY ordering`
    catData.childCats = await dbReq(query)
  } else {
    // для подкатегории получаем смежные подкатегории и родительскую категорию
    query = `SELECT name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.parent_id}' AND id != '${catData.id}' AND published = 1
                 ORDER BY ordering`
    catData.siblingCats = await dbReq(query)
    query = `SELECT name, alias FROM i_categories 
                 WHERE id = '${catData.parent_id}'`
    catData.parentCat = (await dbReq(query))[0]
  }

  // получаем все товары (товары относятся к основным категориям)
  const productsCatID = catData.parent_id > 0 ? catData.parent_id : catData.id
  query = `SELECT id, name, alias, price, special_price, images, label_id,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack,
                 standart_ids, reestr_ids, pasport_ids
                 FROM i_products WHERE category_id = '${productsCatID}' AND published = 1`
  const products = await dbReq(query)

  // на основе полученных продуктов создаем фильтр
  const filterGroups = useCatProps(productsCatID)

  let filter = {}
  let allProps = new Set() // набор из всех уникальных id, для запроса в базу
  const filterInitial = [] // массив из активных для данной категории пропсов

  for (let propKey in filterGroups) {
    if (catData[propKey] > 0) filterInitial.push(catData[propKey])

    products.forEach(product => {
      if (product[propKey] > 0) {
        if (filter[propKey] === undefined) {
          // первое обращение, нужно создать
          filter[propKey] = filterGroups[propKey]
          filter[propKey].values = new Set()
        }
        filter[propKey].values.add(product[propKey])
        allProps.add(product[propKey])
        if (product.props === undefined) product.props = [] // собираем все пропсы в 1 массив, чтобы легче работать с фильтром
        product.props.push(product[propKey])
        // console.log(`filter ${propKey} size: ${filter[propKey].values.size}`);
      }
      delete product[propKey] // удаляем, больше не понадобится
    })
  }

  // console.log(`filter: ${JSON.stringify(filter)}`);
  // console.log(`allProps: ${Array.from(allProps).join(',')}`);
  // console.log(`catActivePropsSet: ${Array.from(catActivePropsSet).join(',')}`);

  // получаем пропсы
  query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${Array.from(allProps).join(',')})`
  const propsArr = await dbReq(query)

  const props = {} // для удобства создаем объект из всех пропсов
  propsArr.forEach(prop => {
    props[prop.id] = { name: prop.name, order: prop.ordering }
  })
  filter = Object.values(filter).sort((a, b) => a.ordering - b.ordering) // преобразуем объект в массив и сортируем
  filter.forEach(fGroup => {
    let values = []
    fGroup.values.forEach(valueSet => {
      const value = {
        val: valueSet,
        name: props[valueSet].name,
        order: props[valueSet].order,
      }
      values.push(value)
    })
    values.sort((a, b) => a.order - b.order)
    values.forEach(value => delete value.order) // больше не нужно
    fGroup.values = values
    delete fGroup.ordering // больше не нужно
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
  const pasps = new Set()

  const labels = {} // для кеширования
  const getLabel = async label_id => {
    if (!labels[label_id]) {
      labels[label_id] = (await dbReq(`SELECT name, image FROM i_labels WHERE id = ${label_id} LIMIT 1`))[0] || {}
    }
    return labels[label_id]
  }

  for (const [i, product] of products.entries()) {
    product.order = i
    // проверяем, есть ли на продукт спец. цена
    if (product.special_price > 0) {
      product.priceRegular = product.price
      product.price = product.special_price
    }
    // обрабатываем лейбл
    if (product.label_id > 0) product.label = await getLabel(product.label_id)
    // обрабатываем документацию
    if (product.standart_ids.length) product.standart_ids.split(' ').forEach(stnd => stnds.add(stnd))
    if (product.reestr_ids.length) product.reestr_ids.split(' ').forEach(rstr => rstrs.add(rstr))
    if (product.pasport_ids.length) product.pasport_ids.split(' ').forEach(pasp => pasps.add(pasp))
    // удаляем ненужное
    delete product.pasport_ids
    delete product.reestr_ids
    delete product.standart_ids
    delete product.special_price
    delete product.label_id
  }

  catData.docs = {}
  if (stnds.size) {
    query = `SELECT number, name, file FROM i_docs_stnd
                 WHERE id IN (${Array.from(stnds).join(', ')})`
    catData.docs.stnd = await dbReq(query)
  }
  if (rstrs.size) {
    query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr
                 WHERE id IN (${Array.from(rstrs).join(', ')})`
    catData.docs.rstr = await dbReq(query)
  }
  if (pasps.size) {
    query = `SELECT name, file FROM i_docs_pasp
                 WHERE id IN (${Array.from(pasps).join(', ')})`
    catData.docs.pasp = await dbReq(query)
  }

  // удаляем ненужное
  delete catData.parent_id
  delete catData.published

  // const catPerformance = Math.round(performance.now() - start)
  // cv({ catPerformance })

  return { catData, products, filter, filterInitial }
})
