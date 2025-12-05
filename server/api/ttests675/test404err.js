export default defineEventHandler(async event => {
  const urls = []
  const query = `SELECT text FROM i_log WHERE error = 1`
  const errors = await dbReq(query)

  for (const err of errors) {
    const pE = JSON.parse(err.text)
    if (pE.statusCode === 404) urls.push(pE.url)
  }

  console.log(`urls: ${JSON.stringify(urls, null, 2)}`)
  return urls
})
