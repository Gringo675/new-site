# AI Coding Assistant Instructions

## Project Overview
This is a Nuxt v4 e-commerce website built with:
 Nuxt UI v4 and TailwindCSS v4 for styling
- Vue 3 Composition API for component logic
- Frontend: Nuxt v4, TailwindCSS v4, Nuxt UI v4
- Backend: Node.js, MySQL

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

## Important Notes
1. For any question or code generation related to NuxtJS or NuxtUI components, MUST consult the official documentation using web-search.
2. **Never manually import composables (e.g., useCompany, useUser, useCart, useRuntimeConfig, defineEventHandler, etc.) if they are available via Nuxt auto-import.**
  - Use composables directly in `<script setup>` or server files without import statements.
  - [Official Nuxt auto-imports documentation](https://nuxt.com/docs/guide/directory-structure/composables#auto-imports)
  - [Auto-imports API reference](https://nuxt.com/docs/api/kit#addinportsdir)
  - [Auto-imports concept](https://nuxt.com/docs/guide/concepts/auto-imports)
3. **Never manually import components if they are available via Nuxt auto-import (i.e., placed in the `components/` directory or registered by a Nuxt module).**
  - Use components directly in templates without import statements.
  - [Official Nuxt components auto-import documentation](https://nuxt.com/docs/guide/directory-structure/components#auto-import)
4. For server composables, auto-imports also work in `server/` routes and utilities.
