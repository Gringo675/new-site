# Implement Nuxt UI in AdminVendorsProds

Goal: Migrate `app/components/admin/vendors/AdminVendorsProds.vue` from basic HTML elements to Nuxt UI components, following the pattern in `app/pages/admin/cms/products.vue`.

## Todo List

- [ ] **Setup Table Configuration**
    - Define `columns` array for `UTable` including:
        - Код (`id`)
        - Наименование (`name`)
        - Brand EANs (`brand_eans`)
    - Implement `useTemplateRef('table')` to access table API.
    - Create a `countFilteredRows` computed property.

- [ ] **Migrate Input Components**
    - Replace the `<select>` element with `USelectMenu`.
    - Replace the `<input>` element with `UInput` (adding `i-lucide-filter` icon).

- [ ] **Migrate Table Component**
    - Replace the `<table>` structure with `UTable`.
    - Bind `:data="products"`, `:columns="columns"`, and `v-model:global-filter="globalFilter"`.
    - Apply the same `:ui` styles as `app/pages/admin/cms/products.vue` for consistency.

- [ ] **Refine Layout and Count Display**
    - Update the filtered count text to use the new `countFilteredRows` computed property.
    - Ensure the flex layout remains consistent.
