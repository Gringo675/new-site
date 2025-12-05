// to update sitemap-urls.json uncomment sitemap-urls.ts plugin, run dev server and load localhost:3000/sitemap.xml

import fs from 'fs'

console.log('Starting blocked URLs test...')

const sitemapUrls = JSON.parse(fs.readFileSync('./helpers/sitemap-urls.json', 'utf-8'))
const manualUrls = ['/admin', '/user/', '/user/profile', '/user/orders', '/user/cart', '/wp/positive-test']
const urls = [...sitemapUrls, ...manualUrls]

console.log(`urls.length: ${JSON.stringify(urls.length, null, 2)}`)

const startsWithPatterns = [
  // Generic directory probes where startsWith is safer
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
]
const includesPatterns = [
  // Specific technical signatures that can be nested
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
]

for (const url of urls) {
  for (const pattern of startsWithPatterns) {
    if (url.startsWith(pattern)) {
      console.warn(`Blocked request to ${url} matching pattern (startsWith): ${pattern}`)
    }
  }
  for (const pattern of includesPatterns) {
    if (url.includes(pattern)) {
      console.warn(`Blocked request to ${url} matching pattern (includes): ${pattern}`)
    }
  }
}

console.log('Blocked URLs test completed.')
