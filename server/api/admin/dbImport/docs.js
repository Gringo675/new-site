export default defineEventHandler(async event => {
  // полностью переписывает таблицы i_docs_stnd, i_docs_rstr, i_docs_pasp из старой базы

  const tables = [
    // {
    //   old: 'instr_jshopping_docs_stnd',
    //   new: 'i_docs_stnd',
    // },
    {
      old: 'instr_jshopping_docs_rstr',
      new: 'i_docs_rstr',
    },
    // {
    //   old: 'instr_jshopping_docs_pasp',
    //   new: 'i_docs_pasp',
    // },
  ]
  try {
    for (const table of tables) {
      await copyTableHelper(table)
    }

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})

const copyTableHelper = async table => {
  const data = await dbOldReq(`SELECT * FROM ${table.old}`)
  const fieldsArr = Object.keys(data[0]) // вытаскиваем названия полей из первого элемента
  const placeholders = data.map(() => `(${fieldsArr.map(() => '?').join(', ')})`).join(', ')
  const values = data.flatMap(row => fieldsArr.map(field => (field === 'date' ? setDateObjToString(row[field]) : row[field])))
  const query = `INSERT INTO ${table.new} (${fieldsArr.join(', ')}) VALUES ${placeholders}`
  await dbReq(`TRUNCATE ${table.new}`) // удаляет все записи
  await dbReq(query, values)
}
