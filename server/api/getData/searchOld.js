/**
 * выполняет поиск по каталогу
 * q - строка поиска
 * f - флаг быстрого поиска (max 10 результатов)
 */
export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 3000))

  const { q, f } = getQuery(event)

  if (typeof q !== 'string' || q.length < 3) throw createError({ statusCode: 505, statusMessage: `Incorrect request!` })
  const fastSearch = f === '1'
  // экранируем и меняем пробел на паттерн % - любая строка любой длины
  const qExpression = q.replaceAll("'", "\\'").replaceAll(' ', '%')

  const getProducts = (qExpression, fastSearch) => {
    try {
      const query = `SELECT id, name, alias, category_id, price, special_price, images, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, label FROM i_products WHERE name LIKE ? LIMIT ?`
      return dbReq(query, [`%${qExpression}%`, fastSearch ? 10 : 100])
    } catch (e) {
      return null
    }
  }

  let products = await getProducts(qExpression, fastSearch)

  if (!products.length) {
    // если нет результатов, пробуем изменить раскладку и повторить поиск
    const newQ = changeToRusLayout(qExpression)
    if (newQ !== qExpression) products = await getProducts(newQ, fastSearch)
    if (!products.length) return { products: [] }
  }

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
  // для получения подкатегорий создаем объект из id категорий, в котором для каждой категории собираем наборы из пропсов входящих в нее товаров
  const catsWithProductProps = []
  for (const product of products) {
    product.props = []
    for (const propsGroup of propsGroupOrder) {
      product.props.push(product[propsGroup.name])
      if (product[propsGroup.name] > 0) propsSet.add(product[propsGroup.name])
    }
    if (catsWithProductProps[product.category_id] === undefined) catsWithProductProps[product.category_id] = [product.props]
    else catsWithProductProps[product.category_id].push(product.props)
  }
  // получаем категории
  const qWhere = []
  const qParams = []
  for (const key in catsWithProductProps) {
    const productsProps = []
    for (const props of catsWithProductProps[key]) {
      const chunks = []
      for (let i = 0; i < 8; i++) {
        if (props[i] === 0) {
          chunks.push(`${propsGroupOrder[i].name} = ''`)
        } else {
          chunks.push(`(${propsGroupOrder[i].name} = '' OR FIND_IN_SET(?, ${propsGroupOrder[i].name}))`)
          qParams.push(props[i])
        }
      }
      productsProps.push(`(${chunks.join(' AND ')})`)
    }
    const chunk = `((id = ? OR parent_id = ?) AND ${productsProps.join(' OR ')})`
    qParams.push(key, key)
    qWhere.push(chunk)
  }
  let query = `SELECT name, alias, id, parent_id, ordering FROM i_categories WHERE ${qWhere.join(' OR ')}`
  const rawCats = await dbReq(query, qParams)
  let cats = sortCategories(rawCats)

  // обрабатываем полученные категории
  // const collectPropsAndClear = cat => {
  //   cat.props = []
  //   for (const propsGroup of propsGroupOrder) {
  //     if (cat[propsGroup.name] > 0) cat.props.push(cat[propsGroup.name])
  //     delete cat[propsGroup.name]
  //   }
  //   delete cat.parent_id
  //   delete cat.ordering
  // }
  // for (const cat of cats) {
  //   delete cat.id
  //   delete cat.parent_id
  //   delete cat.ordering
  //   for (const subCat of cat.children) {
  //     delete subCat.id
  //     delete subCat.parent_id
  //     delete subCat.ordering
  //   }
  // collectPropsAndClear(cat)
  // if (cat.children) {
  //   for (const subCat of cat.children) {
  //     collectPropsAndClear(subCat)
  //     if (subCat.children) {
  //       for (const subSubCat of subCat.children) {
  //         collectPropsAndClear(subSubCat)
  //       }
  //     }
  //   }
  // }
  // }

  // получаем пропсы
  query = `SELECT id, group_id, ordering FROM i_properties WHERE id IN (${Array.from(propsSet)
    .map(() => '?')
    .join(', ')})`
  const props = await dbReq(query, Array.from(propsSet))
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
      if (a.category_id !== b.category_id) return cats.findIndex(cat => cat.id === a.category_id) - cats.findIndex(cat => cat.id === b.category_id)
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
        image: product.images.match(/^[^,]+/)[0], // берем только первое изображение
        price: product.special_price > 0 ? product.special_price : product.price,
        priceRegular: product.special_price > 0 ? product.price : undefined,
        label: product.label,
        // props: product.props.filter(prop => prop > 0), // оставляем только активные значения
        order: index,
      }
    })

  cats = cats.map(cat => {
    return {
      name: cat.name,
      alias: cat.alias,
      children: cat.children?.map(cat => {
        return {
          name: cat.name,
          alias: cat.alias,
        }
      }),
    }
  })

  // log the search request
  $fetch('/api/log/setText', {
    method: 'POST',
    body: {
      text: `Search request: q='${q}', f='${f}', results=${products.length}`,
    },
  })

  // console.log(
  //   `result: ${JSON.stringify(
  //     {
  //       products,
  //       cats,
  //     },
  //     null,
  //     2,
  //   )}`,
  // )
  return {
    products,
    cats,
  }
})
