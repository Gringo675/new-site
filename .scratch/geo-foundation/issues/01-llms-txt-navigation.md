# 01 — llms.txt Navigation Index

**What to build:** a server route at `/llms.txt` that serves a short plain-text navigation index. External AI crawlers (GPTBot, PerplexityBot, etc.) hit this endpoint and discover the canonical content surface — key sections of the site, plus links to `/llms-full.txt` and the sitemap.

**Blocked by:** None — can start immediately.

**Status:** closed

- [x] `GET /llms.txt` returns HTTP 200 with `Content-Type: text/plain; charset=utf-8`
- [x] Body contains a curated list of key site sections: catalog (with main category names), materials/articles, and service/marketing pages
- [x] Body contains a link to `/llms-full.txt`
- [x] Body contains a link to `/sitemap.xml`
- [x] The endpoint is served openly (no auth), and `robots.txt` is unchanged
- [x] Playwright E2E test verifies the above: status, content-type, presence of section markers, and the two links