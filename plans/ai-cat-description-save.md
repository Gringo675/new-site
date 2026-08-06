# Implement AI Category Description Save

Implement the `handleSave` function in `app/pages/admin/cms/aiCatDescription.vue` to persist AI-generated descriptions to the database.

## Todo
- [ ] Implement `handleSave` in `app/pages/admin/cms/aiCatDescription.vue`
    - [ ] Find category ID using `activeCatAlias` and `cats` list
    - [ ] Construct payload for `/api/admin/setCategories`
    - [ ] Implement `myFetch` call to `/api/admin/setCategories`
    - [ ] Add success/error notifications using `showMessage`
