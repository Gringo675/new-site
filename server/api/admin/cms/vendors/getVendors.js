export default defineEventHandler(async event => {
  try {
    // Fetch chiz vendor data
    const chizItems = await dbReq(`SELECT ean, name FROM i_vendor_chiz`)
    // Fetch kiber vendor data
    const kiberItems = await dbReq(`SELECT ean, name FROM i_vendor_kiber`)

    return {
      chiz: chizItems,
      kiber: kiberItems,
    }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch vendors data', cause: error })
  }
})
