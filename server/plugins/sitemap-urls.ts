import { defineNitroPlugin } from '#imports'
import fs from 'fs'
import path from 'path'

export default defineNitroPlugin(nitroApp => {
  // nitroApp.hooks.hook('sitemap:resolved', ({ urls }) => {
  //   const relativeUrls = urls.map(url => {
  //     try {
  //       return new URL(url.loc).pathname
  //     } catch (e) {
  //       // Handle cases where url.loc might not be a full URL, like a malformed one.
  //       // Or if it is already a relative path.
  //       const urlString = String(url.loc)
  //       const match = urlString.match(/https?:\/\/[^/]+(\/.*)/)
  //       if (match) {
  //         return match[1]
  //       }
  //       return urlString
  //     }
  //   })
  //   const filePath = path.resolve(process.cwd(), 'helpers', 'sitemap-urls.json')
  //   fs.writeFileSync(filePath, JSON.stringify(relativeUrls, null, 2))
  //   console.log(`Sitemap URLs saved to ${filePath}`)
  // })
})
