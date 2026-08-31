Status: ready-for-agent
Type: task
Blocked by: none

# 01 - Refactor AI Cat Description UI for Manual Generation Trigger and Initial Description

## Description

Modify `app/pages/admin/cms/aiCatDescription.vue` so that:
1. Selecting a category (`activeCatAlias`) fetches category data via `/api/getData/category/${alias}` and sets `aiResult = { originalData: { description: catData.description, ... } }`.
2. AI description generation is no longer triggered automatically on `watch(activeCatAlias)`.
3. When a category is selected and `aiResult` has only `originalData` (no `generatedDescription` yet), display the **Original Description** block with a prominent **"Сгенерировать"** button underneath it.
4. Clicking **"Сгенерировать"** invokes `connectionHandler` with workflow `category-description`, updating `aiResult` with the AI-generated description, research, judge verdict, etc., which then reveals the generated description preview, editor, critique, and revision sections.

## Acceptance Criteria

- [ ] Selecting a category loads the original description immediately without triggering AI generation.
- [ ] A "Сгенерировать" button is rendered directly under the Original Description when generation has not yet run.
- [ ] Clicking "Сгенерировать" triggers the WebSocket workflow and updates `aiResult` with generated content.
- [ ] Loader state handles both initial category data fetching and AI generation.
