# Domain Context: Category AI Content Generation

## Glossary

### Category Description (Описание категории)
Marketing and introductory HTML text block for a product category, generated via the `category-description` Mastra workflow. Stored in `i_categories.description`.

### Category Characteristics (Характеристики категории)
Structured technical specification block in HTML for a product category, synthesized from official standards (GOST), State Register of Measuring Instruments (GRSI) documents, or fallback technical web research via the `category-characteristics` Mastra workflow. Stored in `i_categories.characteristics`.

### Category FAQ (Частые вопросы категории)
Structured question–answer content for a product category, synthesized from the category's Characteristics and official documents to answer common buyer questions; rendered inline on the category page and marked up with `FAQPage` schema.
_Avoid_: Q&A block, FAQ article

### Document Extractions (Выжимки из документов)
Relevant specification snippets extracted from official standard texts (`stnd`) or State Register entries (`rstr`) for specific category products during category characteristics workflow execution.

### Fallback Research (Fallback-исследование)
Synthesized technical summary produced via search agent when no relevant official standard or registry documents exist for a category.

### Judge Verdict (Вердикт судьи)
Validation result (`PASS` or `FAIL`) produced by the judge agent evaluating generated content against domain quality policies, links, and technical accuracy.
