export default defineEventHandler(event => {
  // A hybrid approach is used for precision and security.
  // `startsWith` is safer for root-level directory probes to avoid false positives.
  // `includes` is better for catching file types or paths that can be nested.

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
    '/login',
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

  const url = event.node.req.url

  for (const pattern of startsWithPatterns) {
    if (url.startsWith(pattern)) {
      console.warn(`Blocked request to ${url} matching pattern (startsWith): ${pattern}`)
      setResponseStatus(event, 404)
      return 'Not Found'
    }
  }

  for (const pattern of includesPatterns) {
    if (url.includes(pattern)) {
      console.warn(`Blocked request to ${url} matching pattern (includes): ${pattern}`)
      setResponseStatus(event, 404)
      return 'Not Found'
    }
  }
})
