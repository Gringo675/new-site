# AI Coding Assistant Instructions

> Note: Предпочтительно вести диалог на русском языке. При этом код, комментарии и технические термины следует оставлять на английском.

## Project Overview
This is a Nuxt 3 e-commerce website built with:
 Nuxt UI v3 and TailwindCSS v4 for styling
- Vue 3 Composition API for component logic
- Frontend: Nuxt 3, TailwindCSS, Nuxt UI
- Backend: Node.js, MySQL
 Use TailwindCSS v4 for styling

## Project Structure
- `pages/` - Route pages following Nuxt file-based routing
- `components/` - Reusable Vue components
  - `helper/` - Utility components
  - `catalog/` - Product catalog components
  - `admin/` - Admin interface components
- `composables/` - Shared composable functions
- `server/` - Server-side API routes and utilities
- `layouts/` - Page layouts (default, admin, empty)
- `middleware/` - Route middleware (auth, etc.)

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

## Development Workflow

### Running the Project
```bash
# Development
npm run dev

# Production build
npm run build

# Deploy
npm run deploy
```

### Code Style & Conventions
- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Components prefixed with function (e.g., `TheHeader`, `HelperLoader`)
- Use TailwindCSS for styling

### Project Colors
- Primary: violet
- Secondary: orange
- Tertiary: indigo
- Neutral: slate

#### Nuxt UI color usage
The colors primary (violet), secondary (orange), tertiary (indigo), and neutral (slate) are registered in `app.config.ts` and available as variants in Nuxt UI components. For example, to make an orange button, use `<UButton variant="secondary" />`. No extra classes are needed for these colors.

### Error Handling
- Use `createError()` for HTTP errors
- Global error handling in `app.vue`
- Error page in `error.vue`

## Key Files
- `app.config.ts` - UI configuration
- `nuxt.config.ts` - Nuxt configuration
- `app.vue` - Root app component
- `error.vue` - Error page

## Common Patterns
1. Protected Admin Routes:
```vue
<template>
  <HelperAdminOnly>
    <!-- Admin content here -->
  </HelperAdminOnly>
</template>
```

2. Data Fetching:
```vue
<template>
  <HelperDataFetch :url="apiUrl" v-slot="{ data }">
    <!-- Content using data -->
  </HelperDataFetch>
</template>
```

3. Loading States:
```vue
<UModal>
  <HelperLoader />
</UModal>
```

## Important Notes
1. Always check user authentication for admin routes
2. Follow the established component naming conventions
3. For any question or code generation related to NuxtJS or NuxtUI components, MUST consult the official documentation using Context7 first
4. Environment variables stored in `.env` (not in repo)
5. Do NOT import composables (e.g., useCompany, useUser, useCart) if they are available via Nuxt auto-import. Just use them directly in <script setup>.
6. Do NOT import components manually if they are available via Nuxt auto-import (i.e., placed in the components/ directory or registered by a Nuxt module). Use them directly in templates without import statements.
