# Improve Published Column with Checkboxes

The goal is to replace the 'Да/Нет' text in the 'Опубликован' column of the products table with interactive checkboxes that update the server immediately.

## Tasks

- [ ] Update `published` column `cell` in [`app/components/admin/prods/AdminProdsProd.vue`](app/components/admin/prods/AdminProdsProd.vue) to use `UCheckbox`
- [ ] Implement server-side update logic within the checkbox's `onUpdate:modelValue` handler
- [ ] Test the checkbox toggle and verify server updates
