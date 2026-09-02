# 03 — Article Schema on Informational Articles

**What to build:** the four informational articles under `/materials/` emit schema.org `Article` structured data in the `<head>` via the existing `nuxt-schema-org` integration. Each article joins the site-wide schema graph (WebSite/WebPage/Organization identity) and carries headline, description, author (Organization), publisher, datePublished, dateModified, and image. AI answer engines then treat these pages as authoritative, citable sources rather than anonymous pages.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Each of the 4 article pages (`/materials/chto-takoe-poverka-instrumenta`, `/materials/chto-takoe-kalibrovka-instrumenta`, `/materials/kak-vybrat-mikrometr`, `/materials/kak-vybrat-shtangentsirkul`) emits `Article` JSON-LD in the head, joined to the existing schema graph
- [ ] The `Article` node includes: `headline` (article title), `description` (meta description text), `author` (referencing the Organization identity), `publisher` (Organization), `datePublished`, `dateModified`, and `image` (article image)
- [ ] The existing article page content and layout are unchanged (additive change only)
- [ ] Playwright E2E test verifies on at least one article: the `application/ld+json` graph contains `"@type":"Article"` and the correct `headline`