export default defineEventHandler(async event => {
  // получаем артикул товара и отдаем все относящиеся к нему нормативные документы
  try {
    const { ean: oldEan } = getQuery(event)

    if (!oldEan) throw new Error('Incorrect request!')

    const query = `SELECT
    (SELECT JSON_ARRAYAGG(number) FROM i_docs_stnd WHERE FIND_IN_SET(id, p.standart_ids)) as stnd_numbers,
    (SELECT JSON_ARRAYAGG(number) FROM i_docs_rstr WHERE FIND_IN_SET(id, p.reestr_ids)) as rstr_numbers
    FROM
        i_products AS p
    WHERE
        old_id = ${oldEan} 
    LIMIT 1`
    const prod = (await dbReq(query))[0]

    // reverse array
    return (prod.stnd_numbers ?? []).concat((prod.rstr_numbers ?? []).map(num => `ГРСИ №${num}`)).reverse()
  } catch (e) {
    console.error(e)
    return []
  }
})
