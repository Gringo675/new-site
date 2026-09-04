# 05 — AI Crawler Discovery (robots.txt, Sitemap & Head Link)

**What to build:** enable auto-discovery of `/llms.txt` and `/llms-full.txt` for AI crawlers and answer engines (GPTBot, PerplexityBot, ClaudeBot, etc.) across the site's discovery channels:
1. `server/routes/robots.txt.ts` includes explicit discovery references to `/llms.txt` and `/llms-full.txt`.
2. `server/api/__sitemap__/urls.ts` includes `/llms.txt` and `/llms-full.txt` in the sitemap URL list.
3. Global HTML `<head>` emits an alternate discovery link: `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />`.

**Blocked by:** 01 — llms.txt Navigation Index, 02 — llms-full.txt Content Corpus.

**Status:** closed

- [x] `GET /robots.txt` in production mode references `/llms.txt` and `/llms-full.txt`
- [x] `GET /sitemap.xml` includes entries for `/llms.txt` and `/llms-full.txt`
- [x] Main site HTML `<head>` contains `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />`
