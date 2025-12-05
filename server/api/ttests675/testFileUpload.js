// import fs from 'node:fs'

export default defineEventHandler(async event => {
  //
  try {
    console.log(`from testFileUpload`)
    // const body = await readBody(event)
    // console.log(`typeof body: ${JSON.stringify(typeof body, null, 2)}`)
    // console.log(`body.length: ${JSON.stringify(body.length, null, 2)}`)
    // console.log(`body: ${JSON.stringify(body, null, 2)}`)
    const formData = await readMultipartFormData(event)
    // console.log(`formData: ${JSON.stringify(formData, null, 2)}`)
    for (const formItem of formData) {
      console.log(`name: ${formItem.name}`)

      if (formItem.filename) {
        console.log(`type: ${formItem.type}`)
        console.log(`filename: formItem.filename}`)
        console.log(`length: ${formItem.data.length}`)
        // fs.writeFileSync(`${formItem.filename}`, formItem.data)
        sendFileToMail(formItem.filename, formItem.data)
        console.log(`file ${formItem.filename} saved!`)
      } else {
        console.log(`data: ${formItem.data.toString()}`)
      }
    }
    // console.log(`body: ${JSON.stringify(body, null, 2)}`)

    // const { file } = await readBody(event)
    // console.log(`file.name: ${JSON.stringify(file.name, null, 2)}`)
    // console.log(`file.size: ${JSON.stringify(file.size, null, 2)}`)
    // console.log(`typeof file: ${JSON.stringify(typeof file, null, 2)}`)
    // for (const key in file) {
    //   console.log(`key: ${JSON.stringify(key, null, 2)}`)
    //   console.log(`file[key]: ${JSON.stringify(file[key], null, 2)}`)
    // }
  } catch (e) {
    console.log(`e: ${JSON.stringify(e.message, null, 2)}`)
  }

  return true
})

const sendFileToMail = (filename, content) => {
  const mail = {
    to: 'gringo675@mail.ru',
    subject: 'Test',
    html: 'Some text',
    attachments: [{ filename, content }],
  }
  sendMail(mail)
}
