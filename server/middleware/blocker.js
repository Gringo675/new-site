// Pre-compile the regular expression for blocking patterns to improve performance.
// `startsWith` patterns are anchored to the start of the string (^).
// `includes` patterns can match anywhere. All matching is case-insensitive.
// To create regex may use helpers\testBlockedUrls.js
const PRE_COMPILED_BLOCKED_PATTERN_REGEX = new RegExp(
  '(^/backup|^/old|^/new|^/blog|^/shop|^/test|^/cms|^/sql|^/database|^/server\\-status|^/\\.well\\-known/|^/wp|^/wordpress|^/login|^/_next|^/apps|^/administrator|^/register|^/feed|^/magento_version|^/license\\.txt|^/readme\\.md|^/changelog\\.txt|^/install\\.txt|^/release_notes\\.txt)|\\.php|/\\.env|/\\.git|xmlrpc\\.php|/wp\\-admin|/wp\\-content|/wp\\-includes|/wp\\-login|/myadmin|/pma|/file\\-manager|/old\\-admin|/laravel|/vendor/|/\\.aws/|\\.yml|\\.yaml|\\.\\./|phpinfo|/filemanager|/mage/|/skin/|/varien/|/joomla|/drupal|/shopware|/volusion|/eccube',
)

// `startsWith` patterns are anchored to the start of the string (^).
// `includes` patterns can match anywhere. All matching is case-insensitive.

// The arrays are kept for readability and ease of modification, but the regex
// is pre-compiled for performance.
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

export default defineEventHandler(event => {
  const originalUrl = event.node.req.url
  const url = originalUrl.toLowerCase()

  if (PRE_COMPILED_BLOCKED_PATTERN_REGEX.test(url)) {
    console.warn(`Blocked request to ${originalUrl} - matched a blocked pattern`)
    // temporarily
    // $fetch('/api/log/setText', {
    //   method: 'POST',
    //   body: {
    //     text: `${originalUrl} - blocked by middleware`,
    //   },
    // })
    setResponseStatus(event, 404)
    return 'Not Found'
  }
})
