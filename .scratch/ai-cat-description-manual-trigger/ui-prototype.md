# UI Prototype Design: AI Category Description Generation (Before & After)

## Overview

This document defines the UI prototype and layout variants for `app/pages/admin/cms/aiCatDescription.vue` in both states: **Before Generation** (category selected, waiting for explicit user trigger) and **After Generation** (AI description generated, reviewed, edited, and ready for revision/saving).

---

## State 1: Before Generation (Initial State after Category Selection)

When an administrator selects a category from the `USelectMenu`, the system fetches the category data (including `description`) via `/api/getData/category/[c_alias]` and populates `aiResult.originalData`.

### Layout Variants for State 1

#### Variant A — Stacked Sequential Flow (Recommended)
- **Top Bar**: Page title ("AI Описание Категорий") on the left, Category `USelectMenu` on the right.
- **Section 1 (Original Description)**:
  - Header with icon `i-lucide-file-text` and title "Исходное описание".
  - Raw HTML toggle (`USwitch`).
  - Content box displaying the existing category description (`v-html` or `<pre>`).
- **Section 2 (Action CTA)**:
  - Placed directly underneath the Original Description block.
  - A highlighted full-width or centered card container featuring:
    - Descriptive text: *"Нажмите кнопку ниже, чтобы запустить генерацию AI-описания на основе товаров и стандартов категории."*
    - Primary button: **`UButton`** with icon `i-lucide-sparkles` and label **"Сгенерировать AI-описание"** (color `primary`, variant `solid`, size `lg`).
- **Hidden Sections**: Generated description, judge verdict, critique, failed attempts, and revision section are completely hidden.

#### Variant B — Split Action Card
- **Section 1**: Original Description occupies the main left/top pane.
- **Section 2**: A floating or sticky action card on the right/bottom with a prominent gradient background, status indicators (Total products, available docs count from category summary), and the **"Сгенерировать"** button.

---

## State 2: After Generation (Loaded & Active AI Description)

Once the user clicks **"Сгенерировать"**, the WebSocket workflow `category-description` runs, loading the AI result into `aiResult`.

### Layout Structure for State 2

- **Section 1 (Original Description)**:
  - Compact or collapsible original description (or maintained above for reference with Raw HTML toggle).
- **Section 2 (Generated Description & Editor)**:
  - Header: "Сгенерированное описание" with `i-lucide-sparkles`.
  - `UTabs` component with two tabs:
    1. **Предпросмотр** (rendered HTML output).
    2. **Редактирование** (`UTextarea` with monospace font, 20 rows).
  - Bottom bar of Section 2:
    - Judge Verdict badge (`UBadge`: PASS in green, FAIL in red).
    - Save status badge (`Сохранено`) and **"Сохранить"** button (`UButton` with `i-lucide-save`, color `success`, variant `outline`).
- **Section 3 (Last Critique & Failed Attempts)**:
  - If previous attempts exist, display warnings, required corrections (`ul > li`), and accordions (`UAccordion`) for attempt history.
- **Section 4 (Revision Section)**:
  - Dashed border card container ("Запрос на доработку").
  - Textarea for editor instructions / correction prompt.
  - **"Отправить на доработку"** button (`UButton` with `i-lucide-send`).

---

## Summary of UX Transitions

1. **Category Select** ➔ Fetches category data ➔ Displays **Original Description** + **"Сгенерировать"** button.
2. **Click "Сгенерировать"** ➔ Triggers global loader (`isLoading`) ➔ WebSocket workflow executes.
3. **Generation Success** ➔ Hides initial CTA ➔ Renders **Generated Description**, **Tabs (Preview/Edit)**, **Verdict**, **Critique**, and **Revision** sections.
4. **Category Change** ➔ Prompts confirmation via `showMessage({ isDialog: true })` if results exist ➔ Resets state back to State 1 for the new category.
