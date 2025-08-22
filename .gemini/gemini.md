# AI Coding Assistant Instructions

> Note: Предпочтительно вести диалог на русском языке. При этом код, комментарии и технические термины следует оставлять на английском.

## Project Overview
This is a Nuxt v4 e-commerce website built with:
 Nuxt UI v3 and TailwindCSS v4 for styling
- Vue 3 Composition API for component logic
- Frontend: Nuxt v4, TailwindCSS v4, Nuxt UI v3
- Backend: Node.js, MySQL

## Core Components & Patterns

### Navigation
- Use `NuxtLink` or `ULink` for internal navigation
- Mobile menu handled by `MobileMenuSlider.vue`
- Product catalog navigation in `CatsMenuSlider.vue`

### State Management
- User state: `useUser()` composable
- Company info: `useCompany()` composable
- Cart functionality: `useCart()` composable

### UI Components
- Modal dialogs: `UModal` from Nuxt UI
- Forms: Built with Nuxt UI form components
- Loading states: `TheLoader.vue` component
- Notifications: `UNotifications` from Nuxt UI

### Authentication & Authorization
- Protected routes use `HelperAdminOnly` component
- Auth middleware in `middleware/auth.js`
- Login handled by `TheLogin.vue`

### Product Catalog
- Category browsing: `CatalogWrapper.vue`
- Product cards: `CatalogProductCard.vue`
- Product filtering: `CatalogFilter.vue`
- Search: `TheSearch.vue`

### Code Style & Conventions
- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Components prefixed with function (e.g., `TheHeader`, `HelperLoader`)
- Use TailwindCSS v4 for styling

### Project Colors
- Primary: violet
- Secondary: orange
- Tertiary: indigo
- Neutral: slate

#### Nuxt UI color usage
The colors primary (violet), secondary (orange), tertiary (indigo), and neutral (slate) are registered in `app.config.ts` and available as variants in Nuxt UI components. For example, to make an orange button, use `<UButton variant="secondary" />`. No extra classes are needed for these colors.

## Key Files
- `app.config.ts` - UI configuration
- `nuxt.config.ts` - Nuxt configuration
- `app.vue` - Root app component
- `error.vue` - Error page

## Important Notes
1. Always check user authentication for admin routes
2. Follow the established component naming conventions
3. For any question or code generation related to NuxtJS or NuxtUI components, MUST consult the official documentation using web-search.
4. Environment variables stored in `.env` (not in repo)
5. **Never manually import composables (e.g., useCompany, useUser, useCart, useRuntimeConfig, defineEventHandler, etc.) if they are available via Nuxt auto-import.**
  - Use composables directly in `<script setup>` or server files without import statements.
  - [Official Nuxt auto-imports documentation](https://nuxt.com/docs/guide/directory-structure/composables#auto-imports)
  - [Auto-imports API reference](https://nuxt.com/docs/api/kit#addinportsdir)
  - [Auto-imports concept](https://nuxt.com/docs/guide/concepts/auto-imports)
6. **Never manually import components if they are available via Nuxt auto-import (i.e., placed in the `components/` directory or registered by a Nuxt module).**
  - Use components directly in templates without import statements.
  - [Official Nuxt components auto-import documentation](https://nuxt.com/docs/guide/directory-structure/components#auto-import)
7. Nuxt 3 auto-imports most Vue and Nuxt composables, utilities, and components automatically using the directory structure and naming conventions. This is powered by the `unimport` library.
8. If you need to explicitly import something (e.g., for testing or if auto-import is disabled), use the `#imports` alias: `import { ref } from '#imports'`.
9. For server composables, auto-imports also work in `server/` routes and utilities.
10. Never add manual imports for anything that is auto-imported by Nuxt, unless you have disabled auto-imports in your `nuxt.config.ts`.
