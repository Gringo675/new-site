Status: ready-for-agent
Type: task
Blocked by: 01-ui-component-refactor.md

# 02 - Category Change Confirmation and State Reset

## Description

Implement confirmation logic when switching categories in `aiCatDescription.vue` if an active `aiResult` with generated content already exists.

## Acceptance Criteria

- [ ] Watch changes to `activeCatAlias`.
- [ ] If an existing `aiResult` has a generated description (`aiResult?.generatedDescription`), prompt the user using `showMessage({ isDialog: true, title: 'Подтвердите смену категории', description: '...' })` before switching.
- [ ] If the user confirms, reset `aiResult`, fetch the new category data (`/api/getData/category/[alias]`), and update the view.
- [ ] If the user cancels, revert `activeCatAlias` to the previous category.
- [ ] If no generated description exists yet, switch category and fetch initial data silently without confirmation dialog.
