# 02 — llms-full.txt Content Corpus

**What to build:** a server route at `/llms-full.txt` that serves the full plain-text catalog corpus. AI answer engines ingest this single file to ground their answers on the site's authoritative content — Category Descriptions and Category Characteristics (GOST/ГРСИ-derived), plus entries for informational articles and marketing pages. Content is assembled live from the canonical data sources, HTML-stripped to readable text, and SWR-cached so admin regenerations appear without a redeploy.

**Blocked by:** None — can start immediately.

**Status:** closed

- [x] `GET /llms-full.txt` returns HTTP 200 with `Content-Type: text/plain; charset=utf-8`
- [x] Body contains the Description and Characteristics of every catalog category, with HTML stripped to readable plain text (tables and lists preserved as readable markdown)
- [x] Body contains at least one known category name verifiable in the test
- [x] Body contains titled entries (title + path + body where readily available) for each of the 4 informational articles and each marketing/service page
- [x] Body does **not** contain product-page URLs (products are excluded — their data is already in Product JSON-LD per page)
- [x] The endpoint is SWR-cached at the same TTL as existing catalog routes, and reads live data on refresh
- [x] The endpoint is served openly (no auth)
- [x] Playwright E2E test verifies: status, content-type, presence of a known category name, absence of product URLs, and absence of raw HTML tags