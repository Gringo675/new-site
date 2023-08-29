export default async event => {
  // возвращает объект из formData
  const formData = await readMultipartFormData(event)

  const data = {
    files: [],
  }
  let overallFilesSize = 0
  for (const formItem of formData) {
    if (formItem.name === 'files') {
      // в formData каждый файл находится в отдельном объекте с именем 'files'
      if (!formItem.filename.length) continue // пустой объект, нет файлов
      // if (formItem.data.length > 5242880) throw createError({ statusCode: 511, statusMessage: `Very big file!` })
      data.files.push({
        filename: formItem.filename,
        content: formItem.data,
      })
      overallFilesSize += formItem.data.length
    } else {
      data[formItem.name] = formItem.data.toString()
      if (formItem.name === 'user') data.user = JSON.parse(data.user)
    }
  }
  // проверяем количество файлов
  if (data.files.length > 10) throw createError({ statusCode: 511, statusMessage: `Too many files!` })
  // проверяем размер файлов
  if (overallFilesSize > 10485760) throw createError({ statusCode: 511, statusMessage: `Very big file(-s) size!` })

  return data
}
