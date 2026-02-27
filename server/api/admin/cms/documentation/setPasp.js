const { saveFile, deleteFile, fileExists } = useStaticStorage()

export default defineEventHandler(async event => {
  //
  const dbTable = 'i_docs_pasp2'
  const pasp = await getFormData(event)
  let query

  if (pasp.delete) {
    query = `DELETE FROM ${dbTable} WHERE id = ${pasp.id}`
    if (pasp.fileName && (await fileExists(`/doc/pasp/${pasp.fileName}`))) {
      await deleteFile(`/doc/pasp/${pasp.fileName}`)
    }
  } else {
    pasp.name = prepareString(pasp.name)
    pasp.fileName = ''
    if (pasp.files?.length) {
      // can contain only one file
      pasp.fileName = `${transliterate(pasp.name.toLowerCase())} [chelinstrument.ru].pdf`
      const path = `/doc/pasp/${pasp.fileName}`
      await saveFile(path, pasp.files[0].content)
    }
    if (pasp.id > 0) {
      // don't update file if no new file was uploaded
      query = `UPDATE ${dbTable} SET name = '${pasp.name}' ${pasp.fileName.length ? `, file = '${pasp.fileName}'` : ''} WHERE id = ${pasp.id}`
    } else {
      query = `INSERT INTO ${dbTable} (name, file) VALUES ('${pasp.name}', '${pasp.fileName}')`
    }
  }
  // console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query)

  return true
})
