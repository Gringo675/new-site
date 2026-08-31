# Spec: Manual Trigger for AI Category Description Generation

## Overview

Currently, in `app/pages/admin/cms/aiCatDescription.vue`, AI description generation starts automatically immediately upon selecting a category from `USelectMenu`. This feature request changes the behavior so that generation is initiated explicitly by the user via a "Сгенерировать" button.

## Requirements

1. **Explicit Generation Trigger & Initial Original Description**:
   - Selecting a category does **not** automatically trigger the AI generation workflow.
   - Upon selecting a category (`activeCatAlias`), we fetch category data from `/api/getData/category/[alias]` and immediately store the initial description in `aiResult` (e.g., `aiResult = { originalData: { description: catData.description } }`).
   - The **Original Description** block is displayed immediately upon category selection to provide context to the administrator.
   - Below the Original Description, a prominent **"Сгенерировать"** button is shown when `aiResult` does not yet contain a generated description (`!aiResult?.generatedDescription`).
   - Once generation is executed via WebSocket workflow `category-description`, `aiResult` is populated with `generatedDescription`, `research`, `judgeVerdict`, etc., replacing the initial "Сгенерировать" CTA with the full generated results, editor, critique, and revision sections.

2. **Category Switch Behavior & Confirmation**:
   - When the user selects a different category while an active/generated `aiResult` already exists, prompt for confirmation using `showMessage({ isDialog: true, title: 'Подтвердите смену категории', description: '...' })` (similar to `AdminPrpsEditor.vue`).
   - If confirmed, reset `aiResult`, fetch the new category's initial description, and allow explicit generation. If cancelled, keep the current category and `aiResult`.
   - If no generated description exists yet, switch category silently and fetch its initial description.

3. **Data Flow & Context**:
   - Initial category data fetched via `/api/getData/category/[alias]`.
   - AI generation and revision executed via WebSocket workflow (`mastraWsAdapter`).
   - Loading state (`isLoading`) correctly reflects both data fetching and AI generation processes.

4. **UI Design & NuxtUI Polish**:
   - Clear block separation and card styling.
   - Category alias displayed as a subtle badge in the Original Description header.
   - Judge verdict badge placed prominently at the top header of the Generated Description section.
   - Tabs configured with `color="neutral" variant="link"`.
   - "Сбросить и сгенерировать заново" (Reset and regenerate) action button.
   - Cohesive NuxtUI color scheme: green (`success`) for saving/success states, neutral/black for generation and revision actions.
