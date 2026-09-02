# 04 — Open Graph Cards Site-Wide

**What to build:** every public page emits `og:` meta tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`) so that links shared to messengers (Telegram, WhatsApp, VK) and social platforms render rich previews instead of a bare URL. `og:image` falls back to the site logo and is overridden per page where an obvious image exists (product main image, category image, article image). Twitter cards are deliberately omitted.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Every public page (homepage, category, product, article, marketing) emits `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:locale`, and `og:image` meta tags in the `<head>`
- [ ] `og:title` mirrors the page `<title>`; `og:description` mirrors the meta description
- [ ] `og:image` on product pages uses the product's main image; on category pages uses the category image; on article pages uses the article image; on all other pages falls back to the site logo
- [ ] No page emits any `twitter:` meta tag (deliberate omission)
- [ ] Existing page content and layout are unchanged (additive change only)
- [ ] Playwright E2E test verifies on 4 pages (homepage, one category, one product, one article): each has the required og tags with non-empty content, and none has `twitter:` tags