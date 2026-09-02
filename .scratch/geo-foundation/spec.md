Status: ready-for-agent

# Spec: GEO Foundation — LLM Access (llms.txt) and Article/OG Markup

## Problem Statement

The site has solid classic SEO (schema.org for products, sitemap, canonical, meta descriptions), but AI answer engines (ChatGPT, Perplexity, Yandex Neuro, Google AI Overviews, Copilot) currently have no clean machine-readable surface to ingest the catalog's authoritative content — the Category Description and Category Characteristics built from GOST and ГРСИ documents. The four informational articles carry no `Article` structured data, and no page emits `og:` cards, so links shared to messengers and social networks render without a preview. As a result the site is under-cited by AI engines, generates no measurable AI-referral traffic, and shares poorly.

## Solution

Provide a machine-readable front door for LLMs and close the structured-data gaps:

- `/llms.txt` — a navigation index of the site's key content sections.
- `/llms-full.txt` — a plain-text compilation of the catalog corpus (Category Description + Category Characteristics for all categories) plus entries for informational articles and marketing pages.
- `Article` (schema.org) markup on the four informational articles.
- `og:` meta cards site-wide (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`), with twitter cards deliberately omitted.

## User Stories

1. As an AI crawler (GPTBot, PerplexityBot, etc.), I want a `llms.txt` at the site root, so that I can discover the canonical content surface without crawling and interpreting the HTML.
2. As an AI crawler, I want a `llms-full.txt` containing the full plain-text content of the catalog in a single request, so that I can ingest and ground answers on it efficiently.
3. As an AI answer engine, I want Category Characteristics rendered as clean text (tables and lists preserved as readable markdown) rather than raw HTML, so that I can quote GOST/ГРСИ specification data accurately.
4. As an AI answer engine, I want the informational articles to expose `Article` structured data (headline, author, publication date, image, publisher), so that I can treat them as authoritative, citable sources rather than anonymous pages.
5. As an AI answer engine, I want an article's `datePublished`/`dateModified` to be machine-readable, so that I can prefer fresh content.
6. As an AI answer engine, I want the Organization identity (already in the schema graph) to be referenced consistently from articles, so that citations carry the brand entity.
7. As a messenger or social platform (Telegram, WhatsApp, VK, ...), I want `og:title`, `og:description` and `og:image` on every public page, so that shared links render a rich preview instead of a bare URL.
8. As a buyer, I want product/category/article links shared to me to show a meaningful preview, so that I can judge relevance before opening them.
9. As a marketing/SEO specialist, I want AI-engine referral traffic to be attributable in Google Analytics and Yandex Metrika via referrer, so that I can measure the GEO KPI.
10. As a content admin, I want freshly regenerated Category Description and Category Characteristics to be reflected in `llms-full.txt` without a redeploy, so that the LLM-facing content never goes stale.
11. As a site operator, I want the `llms.txt`/`llms-full.txt` endpoints to be cached the same way the rest of the catalog is, so that repeated AI-crawler hits do not load the database.
12. As a maintainer, I want the decision «articles carry `Article` schema and og tags, but no twitter cards» to be discoverable, so that nobody "fixes" the missing twitter tags later by mistake.
13. As a site owner, I want these changes to be purely additive (new endpoints and head markup), so that existing SEO and the user experience are not regressed.
14. As an AFK agent implementing this feature, I want the spec to describe externally observable behavior (endpoints and rendered head), so that I can implement and test it without guessing internal wiring.

## Implementation Decisions

- **`llms.txt`** is a server route at `/llms.txt`, served as `text/plain; charset=utf-8`. It is a short navigation index: a list of the key sections (catalog and its main categories, materials/articles, service pages), plus links to `/llms-full.txt` and the sitemap.
- **`llms-full.txt`** is a server route at `/llms-full.txt`, served as `text/plain; charset=utf-8`. Content is assembled server-side from the canonical sources (not hand-maintained): for every catalog category, its Category Description and Category Characteristics with HTML stripped to readable plain text (tables/lists preserved); plus a titled entry (title + path + body where readily available) for each informational article and marketing page. Products are deliberately excluded — their data is already emitted as `Product` JSON-LD per page, and 1284 records would bloat the file.
- **Caching & freshness**: both endpoints use the same short-TTL SWR caching pattern already applied to catalog routes, and read live catalog data on refresh, so admin regenerations appear without redeploy.
- **Access**: both endpoints are served openly (no auth), consistent with the decision to allow AI crawlers; `robots.txt` is unchanged.
- **`Article` schema**: the four informational article pages emit schema.org `Article` (headline, description, image, `author` = Organization, `publisher`, `datePublished`, `dateModified`), joined to the existing site-wide schema.org graph (WebSite/WebPage/Organization identity).
- **Open Graph cards**: every public page emits `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:locale`, and `og:image`. `og:image` falls back to the site logo and is overridden where an obvious page image exists (product main image, category image, article image). Twitter cards are deliberately omitted.
- **No new content is authored**: this feature only exposes and marks up existing content; it does not generate or change any copy.

## Testing Decisions

- **Seam**: the single test seam is the **public HTTP / rendered-`<head>` surface** — what an external consumer (AI crawler, browser, test runner) observes. No tests should touch internal modules, composables, or the database directly; assert only through HTTP responses and rendered DOM/head, consistent with the existing Playwright E2E suite.
- **Good tests** assert external behavior only: status codes, `Content-Type`, presence/absence of head elements and JSON-LD `@type`, and that body text contains expected markers (e.g. a known category name); never internal implementation details.
- **Coverage**:
  - `/llms.txt` returns 200 `text/plain`, contains section headings and a link to `/llms-full.txt`.
  - `/llms-full.txt` returns 200 `text/plain`, contains at least one known category name and no raw HTML tags, and does **not** contain product-page URLs.
  - An article page `<head>` contains an `application/ld+json` graph with `"@type":"Article"` and the article headline.
  - Public pages (homepage, a category page, a product page, an article) each contain `og:title`/`og:description`/`og:site_name` meta tags with non-empty content, and contain **no** `twitter:` meta tags.
- **Prior art**: follow `tests/staticPages.spec.ts` and `tests/product.spec.ts` — Playwright, `TEST_URL_BASE`, direct navigation, DOM/attribute assertions. For the plain-text endpoints use Playwright's request context (HTTP-level assertions) rather than DOM queries.

## Out of Scope

- Category FAQ generation and rendering, and `FAQPage` schema — a later phase; the FAQ content is generated in the separate AI project.
- Rework of Category Characteristics templates/formatting for higher quotability — belongs with the AI-project generation work.
- AI generation of product descriptions/characteristics — backlog item.
- Twitter cards — deliberately omitted (twitter is a deprecated surface).
- Any `robots.txt` changes.
- GA4/Metrika setup — no code; manually configure an AI-referrer segment (see Further Notes).
- Gating or credential access to `llms-full.txt`.

## Further Notes

- The GEO objective is measured as referral traffic from AI engines; this feature is the enabling foundation, not the measurement itself. Measurement is a manual GA4/Metrika segment over referrers such as `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `copilot.microsoft.com` (and Yandex Neuro where the referrer is distinguishable).
- Serves all target engines (Yandex Neuro, ChatGPT, Perplexity, GigaChat, Google AI Overviews, Copilot); no per-engine separation is needed for these endpoints.
- `twitter:` cards are intentionally absent — do not "restore" them without reopening the decision.