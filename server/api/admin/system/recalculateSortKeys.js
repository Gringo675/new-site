export default defineEventHandler(async event => {
  const method = event.method

  if (method === 'GET') {
    const [statsRow] = await dbReq(`
      SELECT 
        COUNT(*) as total_cnt,
        SUM(IF(published = 1, 1, 0)) as published_cnt,
        SUM(IF(CHAR_LENGTH(sort_key) = 51, 1, 0)) as valid_cnt,
        SUM(IF(sort_key IS NULL OR sort_key = '', 1, 0)) as empty_cnt
      FROM i_products
    `)

    const sample = await dbReq(
      `SELECT p.id, p.category_id, c.name as category_name, p.sort_key
       FROM i_products p
       LEFT JOIN i_categories c ON c.id = p.category_id
       ORDER BY p.id ASC
       LIMIT 5`
    )

    const total = Number(statsRow?.total_cnt) || 0
    const published = Number(statsRow?.published_cnt) || 0
    const valid = Number(statsRow?.valid_cnt) || 0
    const empty = Number(statsRow?.empty_cnt) || 0

    return {
      status: 'ok',
      stats: {
        totalProducts: total,
        publishedProducts: published,
        validKeysCount: valid,
        emptyKeysCount: empty,
        invalidCount: Math.max(0, total - valid - empty),
      },
      sample,
    }
  }

  // POST
  try {
    const body = (await readBody(event).catch(() => ({}))) || {}
    const target = body && typeof body === 'object' && 'target' in body ? body.target : body
    const result = await recalculateProductsSortKey(target)

    return {
      status: 'ok',
      updatedCount: result.updatedCount,
    }
  } catch (e) {
    console.error('[recalculateSortKeys error]:', e)
    throw createError({
      statusCode: 500,
      statusMessage: `Sort key calculation error: ${e.message}`,
    })
  }
})
