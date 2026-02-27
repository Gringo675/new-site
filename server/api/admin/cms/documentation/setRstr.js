const { saveFile, deleteFile, fileExists } = useStaticStorage()

export default defineEventHandler(async event => {
  //
  const dbTable = 'i_docs_rstr2'
  const rstr = await getFormData(event)
  let query

  if (rstr.delete) {
    query = `DELETE FROM ${dbTable} WHERE id = ${rstr.id}`
    if (rstr.fileName_ot && (await fileExists(`/doc/rstr/${rstr.fileName_ot}`))) {
      await deleteFile(`/doc/rstr/${rstr.fileName_ot}`)
    }
    if (rstr.fileName_mp && (await fileExists(`/doc/rstr/${rstr.fileName_mp}`))) {
      await deleteFile(`/doc/rstr/${rstr.fileName_mp}`)
    }
    if (rstr.fileName_svid && (await fileExists(`/doc/rstr/${rstr.fileName_svid}`))) {
      await deleteFile(`/doc/rstr/${rstr.fileName_svid}`)
    }
  } else {
    rstr.number = rstr.number
    rstr.name = prepareString(rstr.name)
    rstr.type_si = prepareString(rstr.type_si)
    rstr.brand = prepareString(rstr.brand)
    rstr.fileName_ot = ''
    rstr.fileName_mp = ''
    rstr.fileName_svid = ''

    if (rstr.files?.length) {
      const baseName = `${rstr.number} [chelinstrument.ru]`

      // Process files by temp filename prefix: otFile, mpFile, svFile
      for (const file of rstr.files) {
        let fileName = ''

        if (file.filename === 'otFile.pdf') {
          fileName = `ot_${baseName}.pdf`
          rstr.fileName_ot = fileName
        } else if (file.filename === 'mpFile.pdf') {
          fileName = `mp_${baseName}.pdf`
          rstr.fileName_mp = fileName
        } else if (file.filename === 'svFile.pdf') {
          fileName = `sv_${baseName}.pdf`
          rstr.fileName_svid = fileName
        }

        if (fileName) {
          const path = `/doc/rstr/${fileName}`
          await saveFile(path, file.content)
        }
      }
    }

    if (rstr.id > 0) {
      // don't update files if no new files were uploaded
      query = `UPDATE ${dbTable} SET 
        number = '${rstr.number}', 
        name = '${rstr.name}', 
        type_si = '${rstr.type_si}', 
        brand = '${rstr.brand}', 
        date = '${rstr.date || null}'
        ${rstr.fileName_ot.length ? `, file_ot = '${rstr.fileName_ot}'` : ''}
        ${rstr.fileName_mp.length ? `, file_mp = '${rstr.fileName_mp}'` : ''}
        ${rstr.fileName_svid.length ? `, file_svid = '${rstr.fileName_svid}'` : ''}
        WHERE id = ${rstr.id}`
    } else {
      query = `INSERT INTO ${dbTable} (number, name, type_si, brand, date, file_ot, file_mp, file_svid) 
        VALUES ('${rstr.number}', '${rstr.name}', '${rstr.type_si}', '${rstr.brand}', '${rstr.date || null}', '${rstr.fileName_ot}', '${rstr.fileName_mp}', '${rstr.fileName_svid}')`
    }
  }
  console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query)

  return true
})
