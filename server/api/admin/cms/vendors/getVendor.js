export default defineEventHandler(async event => {
  // get vendor's name and returns all products for this vendor and vendor's own data
  const { vendor } = getQuery(event)
  if (!vendor) {
    throw createError({ statusCode: 400, statusMessage: 'Vendor parameter is required' })
  }
  const productsTable = 'i_products2'
  const vendorTable = `i_vendor_${vendor}`

  // Map vendor name to vendor ID
  let vendorId
  switch (vendor) {
    case 'chiz':
      vendorId = 1
      break
    case 'kiber':
      vendorId = 4
      break
    case 'kirov':
      vendorId = 2
      break
    case 'stiz':
      vendorId = 3
      break
    default:
      throw createError({ statusCode: 400, statusMessage: 'Invalid vendor' })
  }

  const products = await dbReq(`SELECT id, name, brand_eans FROM ${productsTable} WHERE p0_brand = ?`, [vendorId])

  const vendorItems = await dbReq(`SELECT ean, name, stock FROM ${vendorTable}`)

  return { products, vendorItems }
})
