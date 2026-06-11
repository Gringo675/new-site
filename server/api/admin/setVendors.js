export default defineEventHandler(async event => {
  //
  const { vendor, items } = await readBody(event)
  if (!vendor || !items) throw createError({ statusCode: 400, statusMessage: 'vendor and items are required' })

  const productsTable = 'i_products2'

  let vendorTable, vendorId
  switch (vendor) {
    case 'chiz':
      vendorTable = 'i_vendor_chiz'
      vendorId = 1
      break
    case 'kiber':
      vendorTable = 'i_vendor_kiber'
      vendorId = 4
      break
    case 'kirov':
      vendorTable = 'i_vendor_kirov'
      vendorId = 2
      break
    case 'stiz':
      vendorTable = 'i_vendor_stiz'
      vendorId = 3
      break
    default:
      throw createError({ statusCode: 400, statusMessage: 'Invalid vendor' })
  }

  // Update vendor's data
  await dbReq(`TRUNCATE \`${vendorTable}\``) // удаляет все записи
  const placeholders = items.map(() => '(?, ?, ?, ?, ?)').join(', ')
  const values = items.flatMap(item => [item.ean, item.name, item.quantity, item.price, item.d_price])
  await dbReq(`INSERT INTO \`${vendorTable}\` (ean, name, stock, price, d_price) VALUES ${placeholders}`, values)

  // Update products table with new stock and price
  const products = await dbReq(`SELECT id, old_id, brand_eans, vendor_price, vendor_stock FROM ${productsTable} WHERE p0_brand = ?`, [vendorId])

  const itemsMap = new Map(items.map(i => [i.ean, i]))
  const changedBoth = []
  const changedPrice = []
  const changedStock = []
  const date = new Date().toISOString()

  for (const product of products) {
    // У кирова и стиза нет собственных артикулов, используем свои
    const eans = vendorId === 2 || vendorId === 3 ? [product.old_id] : product.brand_eans ? product.brand_eans.split(' ') : []
    let price = 0,
      stock = ''
    for (const ean of eans) {
      const item = itemsMap.get(ean)
      if (item) {
        price === 0 && (price = item.price) // только первое совпадение
        stock = stock ? stock + ',' + item.quantity : item.quantity
      }
    }
    if (price != product.vendor_price) {
      if (stock != product.vendor_stock) changedBoth.push({ id: product.id, price, oldPrice: product.vendor_price, stock, date })
      else changedPrice.push({ id: product.id, price, oldPrice: product.vendor_price, date })
    } else if (stock != product.vendor_stock) {
      changedStock.push({ id: product.id, stock })
    }
  }

  if (changedBoth.length > 0) {
    const placeholders = changedBoth.map(() => '(?, ?, ?, ?, ?)').join(', ')
    const values = changedBoth.flatMap(p => [p.id, p.price, p.oldPrice, p.stock, p.date])
    await dbReq(`INSERT INTO ${productsTable} (id, vendor_price, vendor_old_price, vendor_stock, date_vendor_price_changed) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_price = VALUES(vendor_price), vendor_stock = VALUES(vendor_stock), date_vendor_price_changed = VALUES(date_vendor_price_changed)`, values)
  }
  if (changedPrice.length > 0) {
    const placeholders = changedPrice.map(() => '(?, ?, ?, ?)').join(', ')
    const values = changedPrice.flatMap(p => [p.id, p.price, p.oldPrice, p.date])
    await dbReq(`INSERT INTO ${productsTable} (id, vendor_price, vendor_old_price, date_vendor_price_changed) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_price = VALUES(vendor_price), date_vendor_price_changed = VALUES(date_vendor_price_changed)`, values)
  }
  if (changedStock.length > 0) {
    const placeholders = changedStock.map(() => '(?, ?)').join(', ')
    const values = changedStock.flatMap(p => [p.id, p.stock])
    await dbReq(`INSERT INTO ${productsTable} (id, vendor_stock) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_stock = VALUES(vendor_stock)`, values)
  }

  return 'ok'
})
