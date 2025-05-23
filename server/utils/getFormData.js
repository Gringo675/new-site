export default async event => {
  const formData = await readMultipartFormData(event)
  const data = { files: [] }

  for (const formItem of formData) {
    if (formItem.name === 'files') {
      data.files.push({
        filename: formItem.filename,
        content: formItem.data,
      })
    } else {
      data[formItem.name] = formItem.data.toString()
    }
  }

  const fileError = checkFormFiles(data.files)
  if (fileError) throw createError({ statusCode: 511, statusMessage: 'Incorrect file(s)!' }) // не работает с кириллицей, поэтому прописываем общую ошибку

  if (data.user) data.user = JSON.parse(data.user)
  if (data.cart) data.cart = JSON.parse(data.cart)

  return data
}
