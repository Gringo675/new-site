export default defineEventHandler(async event => {
  //
  try {
    const body = await readBody(event)
    console.log(`typeof body: ${JSON.stringify(typeof body, null, 2)}`)
    console.log(`body.length: ${JSON.stringify(body.length, null, 2)}`)
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
