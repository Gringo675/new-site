import { writeFileSync } from 'fs'

export default defineEventHandler(async event => {
  const text = "s'om''e text`"

  const response = await dbReq(
    "SELECT `name`, `characteristics` FROM `i_categories` WHERE `characteristics` LIKE '%class%'",
  )
  // console.log(`response: ${JSON.stringify(response, null, 2)}`)

  // Save response to C: drive root
  const outputPath = 'C:/111response.json'
  writeFileSync(outputPath, JSON.stringify(response, null, 2), 'utf8')

  return 'OK'
})
