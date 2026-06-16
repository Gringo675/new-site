export default defineEventHandler(async event => {
  //
  const table = 'i_products2'
  try {
    const body = await readBody(event)
    console.log('[setProducts] Incoming body:', body)
    const { id, brand_eans } = body

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Product ID is required' })
    }

    if (brand_eans === undefined || brand_eans === null) {
      throw createError({ statusCode: 400, statusMessage: 'brand_eans are required' })
    }

    // Process brand_eans: join array to space-separated string
    const eansValue = Array.isArray(brand_eans) ? brand_eans.join(' ') : String(brand_eans).trim()

    // Update the product record
    await dbReq(`UPDATE ${table} SET brand_eans = ? WHERE id = ?`, [eansValue, id])

    return 'ok'
  } catch (error) {
    console.error('[setProducts] Error updating product:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Failed to update product brand_eans', cause: error })
  }
})
