export default defineEventHandler(async event => {
  // Query all registry numbers from local database and count linked published products
  const query = `
    SELECT r.number, COUNT(p.id) as count
    FROM i_docs_rstr r
    LEFT JOIN i_products p ON FIND_IN_SET(r.id, p.reestr_ids) AND p.published = 1
    WHERE r.number IS NOT NULL AND r.number != ''
    GROUP BY r.number
  `

  const rows = await dbReq(query)
  const numbersMap = {}

  for (const row of rows) {
    if (row.number) {
      numbersMap[row.number.trim()] = Number(row.count) || 0
    }
  }

  return numbersMap
})
