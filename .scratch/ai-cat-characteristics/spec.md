# Spec: AI Category Characteristics Admin Component (`aiCatCharacteristics.vue`)

## Overview

Create a new Vue component `/home/v-srv/projects/site/app/pages/admin/cms/aiCatCharacteristics.vue` based on `aiCatDescription.vue` layout and behavior. This component enables administrators to select a category, inspect initial characteristics and source documents/research, trigger AI generation of technical characteristics via Mastra workflows (`category-characteristics`), review/edit HTML, submit revision requests (`category-characteristics-revision`), and save results to the database (`i_categories.characteristics`).

## Requirements

### 1. Page Header & Category Selection
- Component path: `app/pages/admin/cms/aiCatCharacteristics.vue`.
- Title: **"AI Характеристики Категорий"**.
- Category dropdown (`USelectMenu`) mapped using `useCats()` / `mapCats()`.
- Selection handling:
  - Fetches category data from `/api/getData/category/[alias]`.
  - Initializes state: `aiResult = { originalData: res.catData, generatedCharacteristics: null }`.
  - Displays initial characteristics and source document extractions/fallback research upon selection before triggering generation.
  - Category switch confirmation prompt (`showMessage`) when generated content exists.

### 2. Original Characteristics Section
- Displays current `aiResult.originalData?.characteristics`.
- Toggle switch for Raw HTML vs Rendered HTML preview.
- Category alias badge in header.

### 3. Sources & Research Context Section
- Displays document extraction / research metadata:
  - If `usedFallback` is true: Displays a fallback badge (**"Fallback-исследование"**) and the `fallbackResearch.technicalSummary`.
  - If `documentExtractions` exist: Displays a badge (**"Официальные документы (N)"**) and an accordion listing extracted documents (`docNumber`, `docName`, `docType`, `year`, `extractedMarkdown`).

### 4. Generation Trigger CTA
- Rendered when `!aiResult.generatedCharacteristics`.
- Button **"Сгенерировать характеристики"** triggers WebSocket call (`connectionHandler`) to workflow `category-characteristics` with input `{ alias: activeCatAlias.value }`.
- Sets `aiResult` to the workflow result payload upon completion.

### 5. Generated Characteristics & Editor Section
- Rendered when `aiResult.generatedCharacteristics` is present.
- Displays Judge Verdict badge (`PASS` / `FAIL`).
- `UTabs` with:
  - **Предпросмотр**: Renders HTML via `v-html="aiResult.generatedCharacteristics"`.
  - **Редактирование**: Editable `UTextarea` bound to `aiResult.generatedCharacteristics`.
- Action bar:
  - **"Сбросить и сгенерировать заново"** (Reset & Regenerate dialog confirmation).
  - **"Сохранить"** button sending POST to `/api/admin/setCategories` payload:
    `{ [cat.id]: { characteristics: aiResult.value.generatedCharacteristics } }`.
  - Badge **"Сохранено"** upon successful save.

### 6. Critique & Failed Attempts Section
- Displays last judge critique and required corrections if `failedAttempts` exist.
- Multiple accordion of historical failed attempts with original generated HTML, critique, required corrections, and editor comments.

### 7. Revision Workflow Trigger
- Textarea for editor feedback (`revisionText`).
- **"Отправить на доработку"** button calling WebSocket workflow `category-characteristics-revision` with payload:
  ```json
  {
    "originalData": "aiResult.value.originalData",
    "documentExtractions": "aiResult.value.documentExtractions || []",
    "fallbackResearch": "aiResult.value.fallbackResearch || null",
    "usedFallback": "aiResult.value.usedFallback || false",
    "generatedCharacteristics": "aiResult.value.generatedCharacteristics",
    "revisionText": "revisionText.value"
  }
  ```
- Updates `aiResult.generatedCharacteristics` with `response.finalCharacteristics`, updates judge verdict, logs history in `failedAttempts`, and resets `revisionText`.
