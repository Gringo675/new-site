Status: ready-for-agent
Type: task
Blocked by: none

# 01 - Implement AI Category Characteristics Admin Page (`aiCatCharacteristics.vue`)

## Description

Create the Nuxt admin page `app/pages/admin/cms/aiCatCharacteristics.vue` based on `aiCatDescription.vue` layout and adapted for technical category characteristics workflows (`category-characteristics` and `category-characteristics-revision`).

## Requirements

1. **Category Selection & Original Data**:
   - Select category via `USelectMenu`.
   - Fetch initial data from `/api/getData/category/${alias}`.
   - Set `aiResult.value = { originalData: res.catData, generatedCharacteristics: null }`.
   - Show confirm dialog on category change if generated characteristics exist.

2. **UI Sections**:
   - Header with title "AI Характеристики Категорий".
   - **Исходные характеристики** block with Raw HTML toggle (`USwitch`).
   - **Источники данных (Sources)** block:
     - Show `fallbackResearch` if `usedFallback === true`.
     - Show accordion of `documentExtractions` if documents exist.
   - **Сгенерировать характеристики** CTA block when `!aiResult.generatedCharacteristics`.
   - **Сгенерированные характеристики** block with judge verdict badge, preview tab (`v-html`), raw edit tab (`UTextarea`), reset button, and save button (`/api/admin/setCategories` payload `{ [cat.id]: { characteristics: ... } }`).
   - **История и Критика** section showing judge critique and attempt history.
   - **Запрос на доработку (Revision)** block triggering `category-characteristics-revision` WebSocket workflow.

3. **WebSocket Workflows Integration**:
   - `category-characteristics`: input `{ alias: activeCatAlias.value }`.
   - `category-characteristics-revision`: input `{ originalData, documentExtractions, fallbackResearch, usedFallback, generatedCharacteristics, revisionText }`. Handles output `{ finalCharacteristics, judgeEvaluation }`.

## Acceptance Criteria

- [ ] File `app/pages/admin/cms/aiCatCharacteristics.vue` exists and compiles without errors.
- [ ] Category dropdown correctly loads and selects categories.
- [ ] Original characteristics block displays existing category characteristics.
- [ ] Source documents/fallback research info is rendered when available in `aiResult`.
- [ ] Generation CTA initiates `category-characteristics` workflow.
- [ ] Save button correctly sends `{ [cat.id]: { characteristics: ... } }` to `/api/admin/setCategories`.
- [ ] Revision button correctly sends payload to `category-characteristics-revision` and updates `generatedCharacteristics`.
