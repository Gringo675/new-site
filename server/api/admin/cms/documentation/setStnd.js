const { saveFile, deleteFile, fileExists } = useStaticStorage()

export default defineEventHandler(async event => {
  //
  const dbTable = 'i_docs_stnd'
  const stnd = await getFormData(event)
  let query
  let params = []

  if (stnd.delete) {
    query = `DELETE FROM ${dbTable} WHERE id = ?`
    params = [stnd.id]
    if (stnd.fileName && (await fileExists(`/doc/stnd/${stnd.fileName}`))) {
      await deleteFile(`/doc/stnd/${stnd.fileName}`)
    }
  } else {
    stnd.number = stnd.number
    stnd.name = prepareString(stnd.name)
    stnd.fileName = ''
    if (stnd.files?.length) {
      // can contain only one file
      stnd.fileName = `${transliterate(stnd.number.toLowerCase())} [chelinstrument.ru].pdf`
      const path = `/doc/stnd/${stnd.fileName}`
      await saveFile(path, stnd.files[0].content)
    }
    if (stnd.id > 0) {
      // don't update file if no new file was uploaded
      let updateSet = 'number = ?, name = ?'
      params = [stnd.number, stnd.name]
      if (stnd.fileName.length) {
        updateSet += ', file = ?'
        params.push(stnd.fileName)
      }
      params.push(stnd.id)
      query = `UPDATE ${dbTable} SET ${updateSet} WHERE id = ?`
    } else {
      query = `INSERT INTO ${dbTable} (number, name, file) VALUES (?, ?, ?)`
      params = [stnd.number, stnd.name, stnd.fileName]
    }
  }
  // console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query, params)

  return true
})
