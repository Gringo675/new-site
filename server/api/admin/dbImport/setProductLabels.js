export default defineEventHandler(async event => {
  // в ручном режиме навешиваем лейблы на товары через old_id (т.к. новый id может измениться после импорта)

  const labels = {
    3: [12010102, 13011001, 25010801, 24010404], // лейбл "Суперлейбл!!"
    5: [11010301, 11037301, 11040801, 14032001, 22040103, 28040404], // лейбл "Хит"
  }
  try {
    // Формируем CASE для присвоения label по old_id
    const cases = Object.entries(labels)
      .map(([label, arr]) => `WHEN old_id IN (${arr.join(',')}) THEN ${label}`)
      .join(' ')

    // Собираем все old_id в один массив
    const allIds = Object.values(labels).flat().join(',')

    const query = `UPDATE i_products
      SET label = CASE
        ${cases}
      END
      WHERE old_id IN (${allIds});`

    // console.log(`query: ${query}`)
    await dbReq(query)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
