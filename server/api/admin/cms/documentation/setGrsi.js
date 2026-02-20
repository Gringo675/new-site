export default defineEventHandler(async event => {
  const data = await getFormData(event)

  // Build doc object from form data
  const doc = {
    number: data.number,
    name: data.name,
    type_si: data.type_si,
    brand: data.brand,
    date: data.date,
  }

  // Convert date from DD.MM.YYYY to MySQL DATE format (YYYY-MM-DD)
  if (doc.date) {
    const [day, month, year] = doc.date.split('.')
    doc.date = `${year}-${month}-${day}`
    console.log(`doc.date: ${JSON.stringify(doc.date, null, 2)}`)
  }

  // Process files if present
  const files = data.files || []
  // debug
  console.log('Files received:', files.map(f => f.filename).join(', '))
  return { success: true }

  let query
  if (doc.id) {
    // UPDATE existing record
    const params = []
    for (const key in doc) {
      if (key !== 'id') {
        params.push(`${key} = '${prepareString(doc[key])}'`)
      }
    }
    query = `UPDATE i_docs_rstr SET ${params.join(', ')} WHERE id = ${doc.id}`
  } else {
    // INSERT new record
    const keys = []
    const values = []
    for (const key in doc) {
      keys.push(key)
      values.push(`'${prepareString(doc[key])}'`)
    }
    query = `INSERT INTO i_docs_rstr (${keys.join(', ')}) VALUES (${values.join(', ')})`
  }

  const result = await dbReq(query)

  // TODO: Handle file storage (save files and update DB with paths)

  return {
    success: true,
    id: doc.id || result.insertId,
  }
})
