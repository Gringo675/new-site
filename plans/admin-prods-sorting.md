# Admin Products Sorting Plan

Implement the same default sorting of products by properties in the admin panel as it is in the catalog.

## Implementation Details

The sorting will be implemented on the client in `app/components/admin/prods/AdminProdsProd.vue` to leverage existing client-side state and avoid unnecessary server requests. The logic will be encapsulated in a separate function for better maintainability.

### Sorting Logic
1. **`sortProdsByProperties` Function**:
   - **Prepare Sort Order**:
     - Sort property groups from `prpsGroupsMap` by `ordering`.
     - For each group, sort its properties from `prps.value` by `ordering`.
   - **Normalize Products**:
     - For each product, create a `props` array containing all its property IDs (values of `p0_brand`, `p1_type`, etc.).
   - **Sort Products**:
     - Apply the sorting algorithm:
       - Iterate through sorted groups.
       - Within each group, iterate through sorted properties.
       - If product A has the property and B doesn't, A comes first (`return -1`).
       - If product B has the property and A doesn't, B comes first (`return 1`).
       - If both or neither have it, continue to the next property.
2. **Integration**:
   - Call `sortProdsByProperties` within the `getProds` function after the API call.

## Todo List
- [ ] Implement default sorting by properties in `app/components/admin/prods/AdminProdsProd.vue`
    - [ ] Create a separate `sortProdsByProperties` function
        - [ ] Implement pre-calculation of sorted groups and properties using `prpsGroupsMap` and `prps`
        - [ ] Implement product normalization (adding `props` array to each product)
        - [ ] Implement the sorting algorithm based on property ordering
    - [ ] Update `getProds` to call `sortProdsByProperties` after fetching products
