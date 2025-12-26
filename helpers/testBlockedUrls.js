// to update sitemap-urls.json uncomment sitemap-urls.ts plugin, run dev server and load localhost:3000/sitemap.xml

// to get 404 urls form log (put on browser's page):
// onMounted(async () => {
//   const logs = await $fetch('http://localhost:3000/api/admin/log/getLog')
//   console.log(`logs[1]: ${JSON.stringify(logs[1], null, 2)}`)

//   const urls = []
//   const errors = logs.filter(log => log.error === 1)
//   for (const err of errors) {
//     const obj = JSON.parse(err.text)
//     if (obj.statusCode === 404) {
//       urls.push(obj.url)
//     }
//   }
//   console.log(`404 urls: ${JSON.stringify(urls, null, 2)}`)
// })

import fs from 'fs'

console.log('Starting blocked URLs test...')

const sitemapUrls = JSON.parse(fs.readFileSync('./helpers/sitemap-urls.json', 'utf-8'))
const manualUrls = ['/admin', '/user/', '/user/profile', '/user/orders', '/user/cart', '/wp/positive-test']
const urls = [...sitemapUrls, ...manualUrls]

console.log(`Testing ${urls.length} URLs...`)

const startsWithPatterns = [
  '/backup',
  '/old',
  '/new',
  '/blog',
  '/shop',
  '/test',
  '/cms',
  '/sql',
  '/database',
  '/server-status',
  '/.well-known/',
  '/wp',
  '/wordpress',
  '/login',
  '/_next',
  '/apps',
  '/administrator',
  '/register',
  '/feed',
  '/magento_version',
  '/license.txt',
  '/readme.md',
  '/changelog.txt',
  '/install.txt',
  '/release_notes.txt',
]

const includesPatterns = [
  '.php',
  '/.env',
  '/.git',
  'xmlrpc.php',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/wp-login',
  '/myadmin', // Catches phpmyadmin
  '/pma',
  '/file-manager',
  '/old-admin',
  '/laravel',
  '/vendor/',
  '/.aws/',
  '.yml',
  '.yaml',
  '../',
  'phpinfo',
  '/filemanager',
  '/mage/',
  '/skin/',
  '/varien/',
  '/joomla',
  '/drupal',
  '/shopware',
  '/volusion',
  '/eccube',
]

// Escape special regex characters from pattern strings.
const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

const startsWithRegexPart = startsWithPatterns.map(p => `^${escape(p)}`).join('|')
const includesRegexPart = includesPatterns.map(escape).join('|')

const blockedPatternRegex = new RegExp(`${startsWithRegexPart}|${includesRegexPart}`)

for (const url of urls) {
  const urlLower = url.toLowerCase()
  const match = blockedPatternRegex.exec(urlLower)
  if (match) {
    console.warn(`URL should be blocked: ${url} - Matched: ${match[0]}`)
  }
}

console.log('Blocked URLs test completed.')
