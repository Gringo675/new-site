export default defineEventHandler(async event => {
  //
  const { vendor, items } = await readBody(event)
  if (!vendor || !items) throw createError({ statusCode: 400, statusMessage: 'vendor and items are required' })

  const productsTable = 'i_products'

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

  // Update vendor's data and products within a transaction
  await withTransaction(async conn => {
    // 1. Очищаем старые данные вендора транзакционно
    await conn.execute(`DELETE FROM \`${vendorTable}\``)

    // 2. Вставляем новые данные вендора (порциями для защиты от пакетных лимитов)
    const chunkSize = 1000
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)
      const placeholders = chunk.map(() => '(?, ?, ?, ?, ?)').join(', ')
      const values = chunk.flatMap(item => [String(item.ean).trim(), item.name, item.quantity, item.price, item.d_price])
      await conn.execute(`INSERT INTO \`${vendorTable}\` (ean, name, stock, price, d_price) VALUES ${placeholders}`, values)
    }

    // 3. Выбираем товары бренда для сверки изменений
    const [products] = await conn.execute(
      `SELECT id, brand_eans, vendor_price, vendor_stock FROM ${productsTable} WHERE p0_brand = ?`,
      [vendorId]
    )

    const itemsMap = new Map(items.map(i => [String(i.ean), i]))
    const changedBoth = []
    const changedPrice = []
    const changedStock = []
    const date = new Date().toISOString()

    for (const product of products) {
      // У кирова и стиза нет собственных артикулов, используем свои (новый id)
      const eans = vendorId === 2 || vendorId === 3 ? [String(product.id)] : product.brand_eans ? product.brand_eans.split(' ') : []
      let price = 0,
        stock = ''
      for (const ean of eans) {
        const item = itemsMap.get(String(ean))
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

    // 4. Обновляем изменившиеся товары в i_products
    if (changedBoth.length > 0) {
      for (let i = 0; i < changedBoth.length; i += chunkSize) {
        const chunk = changedBoth.slice(i, i + chunkSize)
        const placeholders = chunk.map(() => '(?, ?, ?, ?, ?)').join(', ')
        const values = chunk.flatMap(p => [p.id, p.price, p.oldPrice, p.stock, p.date])
        await conn.execute(
          `INSERT INTO ${productsTable} (id, vendor_price, vendor_old_price, vendor_stock, date_vendor_price_changed) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_price = VALUES(vendor_price), vendor_stock = VALUES(vendor_stock), date_vendor_price_changed = VALUES(date_vendor_price_changed)`,
          values
        )
      }
    }
    if (changedPrice.length > 0) {
      for (let i = 0; i < changedPrice.length; i += chunkSize) {
        const chunk = changedPrice.slice(i, i + chunkSize)
        const placeholders = chunk.map(() => '(?, ?, ?, ?)').join(', ')
        const values = chunk.flatMap(p => [p.id, p.price, p.oldPrice, p.date])
        await conn.execute(
          `INSERT INTO ${productsTable} (id, vendor_price, vendor_old_price, date_vendor_price_changed) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_price = VALUES(vendor_price), date_vendor_price_changed = VALUES(date_vendor_price_changed)`,
          values
        )
      }
    }
    if (changedStock.length > 0) {
      for (let i = 0; i < changedStock.length; i += chunkSize) {
        const chunk = changedStock.slice(i, i + chunkSize)
        const placeholders = chunk.map(() => '(?, ?)').join(', ')
        const values = chunk.flatMap(p => [p.id, p.stock])
        await conn.execute(
          `INSERT INTO ${productsTable} (id, vendor_stock) VALUES ${placeholders} ON DUPLICATE KEY UPDATE vendor_stock = VALUES(vendor_stock)`,
          values
        )
      }
    }
  })

  return 'ok'
})
