const { saveFile, deleteFile, fileExists } = useStaticStorage()

export default defineEventHandler(async event => {
  //
  const dbTable = 'i_docs_stnd2'
  const stnd = await getFormData(event)
  let query

  if (stnd.delete) {
    query = `DELETE FROM ${dbTable} WHERE id = ${stnd.id}`
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
      query = `UPDATE ${dbTable} SET number = '${stnd.number}', name = '${stnd.name}' ${stnd.fileName.length ? `, file = '${stnd.fileName}'` : ''} WHERE id = ${stnd.id}`
    } else {
      query = `INSERT INTO ${dbTable} (number, name, file) VALUES ('${stnd.number}', '${stnd.name}', '${stnd.fileName}')`
    }
  }
  // console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query)

  return true
})
