# Admin Sub-category Filtering Plan (Final)

Implement sub-category filtering in the admin panel by passing the selected category ID and its root parent ID to the server, mirroring the catalog's filtering logic.

## Implementation Details

### 1. Frontend Changes (`app/components/admin/prods/AdminProdsProd.vue`)
- **Data Fetching**: Update `onMounted` to fetch the full category tree from `/api/getData/categories`.
- **Hierarchy Preservation**: Implement a recursive mapping function to transform the category tree for `USelectMenu` (mapping `id` $\rightarrow$ `value`, `name` $\rightarrow$ `label`, and preserving `children`).
- **Root ID Resolution**: Implement a helper function to find the root parent ID (the category where `parent_id === 0`) for any given selected category.
- **API Integration**: Update `getProds` to send `cat_id` (selected category) and `parent_id` (root category ID) to the server.

### 2. Backend Changes (`server/api/admin/cms/products/getProds.js`)
- **Parameter Handling**: Accept `cat_id` and `parent_id` from the query string.
- **Conditional Logic**:
    - **If `parent_id === 0`**:
        - The selected category is the root.
        - Execute standard query: `SELECT ... FROM i_products WHERE category_id = cat_id`.
    - **If `parent_id !== 0`**:
        - The selected category is a sub-category.
        - **Fetch Category Props**: Perform a pre-request to `i_categories` to get the record for `cat_id`.
        - **Extract Filters**: Identify all columns matching `/^p\d_/` that have values.
        - **Filtered Query**: Execute a query: `SELECT ... FROM i_products WHERE category_id = parent_id AND [property_filters]`.

## Todo List
- [ ] Update `app/components/admin/prods/AdminProdsProd.vue`
    - [ ] Change category fetch API to `/api/getData/categories`
    - [ ] Implement recursive mapping function for `USelectMenu` hierarchy
    - [ ] Implement `findRootId` helper function
    - [ ] Update `getProds` to pass `cat_id` and `parent_id` to the API
- [ ] Update `server/api/admin/cms/products/getProds.js`
    - [ ] Implement conditional logic based on `parent_id === 0`
    - [ ] Implement category property extraction for sub-categories
    - [ ] Update SQL query construction to use `parent_id` as the root category filter and apply property filters
