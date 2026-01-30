import fs from 'fs'
import https from 'https'

const imgsPath = '.nitro-storage/imgs.json'
const rawContent = fs.readFileSync(imgsPath, 'utf-8')
// The file content seems to be a single line of JSON string array.
// It might be cut off if it's too long.
// The previous output was: ["SHC1STIZ","shc-i-stiz_1","shc-i-stiz_2","shc-i-stiz_3","SHC1CHIZ","shc-i-chiz_2","SHC1GRIFF","SHC2CHIZ_1","SHC2CHIZ_2","shc-iI-stiz2","SHC2STIZ
// It looks like it's not a valid JSON.
// I will try to read it again. If it is still invalid, I will have to fix it manually.
let images
try {
  images = JSON.parse(rawContent)
} catch (e) {
  console.error('Failed to parse imgs.json. It might be corrupted or too large to read in one go.')
  console.error('Raw content:', rawContent)
  // Attempting to fix the JSON
  const fixedContent = rawContent.trim().endsWith(']') ? rawContent : rawContent.trim().slice(0, -1) + '"]'
  try {
    images = JSON.parse(fixedContent)
    console.log('Successfully parsed after fixing the JSON.')
  } catch (e2) {
    console.error('Still failed to parse after attempting to fix it.')
    console.error(e2)
  }
}

const checkUrl = url => {
  return new Promise(resolve => {
    const request = https.get(url, res => {
      resolve({ url, status: res.statusCode })
      res.resume() // Consume response data to free up memory
    })

    request.on('error', e => {
      resolve({ url, status: 'error', error: e.message })
    })

    request.setTimeout(5000, () => {
      request.destroy()
      resolve({ url, status: 'error', error: 'Request timed out' })
    })
  })
}

const main = async () => {
  console.log(`Found ${images.length} images to check.`)
  const results = []
  // The user provided a URL template with a typo: {{name]].jpg. I'm correcting it to {{name}}.jpg.
  for (const imageName of images) {
    const url = `https://chelinstrument.ru/static/img/products/w_300/${imageName}.jpg`
    const result = await checkUrl(url)
    results.push(result)
    if (result.status !== 200) {
      console.log(`[FAILED] ${result.url} - Status: ${result.status}`)
    }
  }

  const failedCount = results.filter(r => r.status !== 200).length
  console.log(`\nCheck finished. ${failedCount} of ${images.length} images failed to load.`)

  // fs.writeFileSync('image_check_results.json', JSON.stringify(results, null, 2));
}

main()
