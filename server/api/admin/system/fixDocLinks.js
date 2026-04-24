const rightFiles = [
  'gost 10197-70 [chelinstrument.ru].pdf',
  'gost 10-88 [chelinstrument.ru].pdf',
  'gost 10905-86 [chelinstrument.ru].pdf',
  'gost 11098-75 [chelinstrument.ru].pdf',
  'gost 11196-74 [chelinstrument.ru].pdf',
  'gost 1121-75 [chelinstrument.ru].pdf',
  'gost 11358-89 [chelinstrument.ru].pdf',
  'gost 162-90 [chelinstrument.ru].pdf',
  'gost 164-90 [chelinstrument.ru].pdf',
  'gost 166-89 [chelinstrument.ru].pdf',
  'gost 18833-73 [chelinstrument.ru].pdf',
  'gost 2216-84 [chelinstrument.ru].pdf',
  'gost 28798-90 [chelinstrument.ru].pdf',
  'gost 3749-77 [chelinstrument.ru].pdf',
  'gost 4046-80 [chelinstrument.ru].pdf',
  'gost 4119-76 [chelinstrument.ru].pdf',
  'gost 427-75 [chelinstrument.ru].pdf',
  'gost 4380-93 [chelinstrument.ru].pdf',
  'gost 4381-87 [chelinstrument.ru].pdf',
  'gost 5378-88 [chelinstrument.ru].pdf',
  'gost 5584-75 [chelinstrument.ru].pdf',
  'gost 5641-66 [chelinstrument.ru].pdf',
  'gost 577-68 [chelinstrument.ru].pdf',
  'gost 6507-90 [chelinstrument.ru].pdf',
  'gost 7470-92 [chelinstrument.ru].pdf',
  'gost 7502-98 [chelinstrument.ru].pdf',
  'gost 7661-67 [chelinstrument.ru].pdf',
  'gost 8026-92 [chelinstrument.ru].pdf',
  'gost 868-82 [chelinstrument.ru].pdf',
  'gost 9038-90 [chelinstrument.ru].pdf',
  'gost 9244-75 [chelinstrument.ru].pdf',
  'gost 9392-89 [chelinstrument.ru].pdf',
  'gost 9696-75 [chelinstrument.ru].pdf',
  'tu 2-034-227-87 [chelinstrument.ru].pdf',
  'tu 2-034-230-88 [chelinstrument.ru].pdf',
  'tu 2-034-439-88 [chelinstrument.ru].pdf',
  'tu 2-034-666-82 [chelinstrument.ru].pdf',
  'tu 2-034-812-88 [chelinstrument.ru].pdf',
  'tu 3-3.2123-88 [chelinstrument.ru].pdf',
  'tu 3936-214-54769955-2008 [chelinstrument.ru].pdf',
  'tu 3943-002-45634966-2001 [chelinstrument.ru].pdf',
]

export default defineEventHandler(async event => {
  const batchSize = 100 // how many products to process in one go
  const results = {
    fixed: 0,
    skipped: 0,
    errors: [],
  }
  console.log(`started...`)
  // const products = await dbReq(`SELECT id, name, characteristics FROM i_products WHERE characteristics LIKE "%/Library/%" LIMIT ${batchSize}`)
  // the same for categories
  const products = await dbReq(`SELECT id, name, characteristics FROM i_categories WHERE characteristics LIKE "%/Library/%" LIMIT ${batchSize}`)

  if (!products || products.length === 0) return 'No products found'

  for (const product of products) {
    try {
      const originalChars = product.characteristics
      let updatedChars = originalChars

      // Regex to find <a> tags with href starting with /Library/
      // Handles: newlines, single/double quotes, and whitespace in closing tag
      const linkRegex = /<a\s+[^>]*?href=['"]\/Library\/([^'"]*?)['"][^>]*?>([\s\S]*?)<\/a\s*>/gi

      let match
      let hasChanged = false

      // console.log(`product.name: ${JSON.stringify(product.name, null, 2)}`)
      // console.log(`updatedChars: ${JSON.stringify(updatedChars, null, 2)}`)

      while ((match = linkRegex.exec(updatedChars)) !== null) {
        const [fullTag, encodedFilename, linkText] = match
        const decodedFilename = decodeURIComponent(encodedFilename)
        // console.log(`decodedFilename: ${JSON.stringify(decodedFilename, null, 2)}`)

        // Find a matching filename from rightFiles
        const matchedFile = rightFiles.find(rf => {
          const rfLower = rf.toLowerCase()
          const decodedLower = decodedFilename.toLowerCase()

          // Take only the first and second words as the core identifiers
          const tokens = rfLower.split(/\s+/).slice(0, 2)
          let lastIndex = -1

          // Check if these core tokens exist in the decoded filename in the correct sequence
          for (const token of tokens) {
            const index = decodedLower.indexOf(token, lastIndex + 1)
            if (index === -1) return false
            lastIndex = index
          }
          return true
        })
        console.log(`matchedFile: ${JSON.stringify(matchedFile, null, 2)}`)

        if (matchedFile) {
          // FIXED: Removed backslashes from interpolation
          const newTag = `<a class="doc-viewer-link" target="_blank" title="Открыть ${linkText}" 
          href="/static/doc/stnd/${matchedFile}">${linkText}</a>`
          // console.log(`newTag: ${JSON.stringify(newTag, null, 2)}`)
          updatedChars = updatedChars.replace(fullTag, newTag)
          // console.log(`updatedChars: ${JSON.stringify(updatedChars, null, 2)}`)

          // cat.characteristics = await prettier.format(cat.characteristics, { parser: 'html' })

          hasChanged = true
          results.fixed++
        } else {
          console.error(`${product.name} skipped. Can't find the link.`)
          results.skipped++
        }
      }

      if (hasChanged) {
        // const query = `UPDATE i_products
        // SET characteristics = '${prepareString(updatedChars)}'
        // WHERE id = ${product.id}`
        const query = `UPDATE i_categories 
        SET characteristics = '${prepareString(updatedChars)}' 
        WHERE id = ${product.id}`
        // return query
        await dbReq(query)
        // timeout
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (e) {
      results.errors.push({ id: product.id, error: e.message })
    }
  }
  console.log(`finished`)
  return {
    processed: products.length,
    ...results,
  }
})
