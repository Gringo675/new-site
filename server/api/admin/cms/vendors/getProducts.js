export default defineEventHandler(async event => {
  try {
    const table = 'i_products2'
    const { vendor } = getQuery(event)

    if (!vendor) {
      throw createError({ statusCode: 400, statusMessage: 'Vendor parameter is required' })
    }

    // Map vendor name to vendor ID (same as in setVendors.js)
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

    // Fetch products from i_products2 table for this vendor
    const products = await dbReq(`SELECT id, name, brand_eans FROM ${table} WHERE p0_brand = ?`, [vendorId])

    return products
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch products data', cause: error })
  }
})
