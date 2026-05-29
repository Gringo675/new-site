# Implement Category and Product Fetch Logic in AdminDocumentationProd

The goal is to mirror the category and product fetching logic from `AdminProdsProd.vue` into `AdminDocumentationProd.vue`.

## Todo List

- [ ] Implement `mapCats` recursive helper function in `app/components/admin/documentation/AdminDocumentationProd.vue`.
- [ ] Update `onMounted` in `app/components/admin/documentation/AdminDocumentationProd.vue` to fetch categories from `/api/getData/categories` and use `mapCats`.
- [ ] Update `updateProds` in `app/components/admin/documentation/AdminDocumentationProd.vue` to implement `parent_id` calculation logic.
- [ ] Update the product fetch request in `updateProds` to include the `parent_id` parameter.
