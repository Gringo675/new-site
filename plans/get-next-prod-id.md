# Plan: Implement getNextProdId API and integrate into AdminProdsProd

## Goals
Implement a server-side endpoint to fetch the next available product ID and update the frontend to call this endpoint correctly.

## Todo
- [ ] Update `app/components/admin/prods/AdminProdsProd.vue` to calculate `rootId` within `addNewProd`
- [ ] Create `server/api/admin/cms/products/getNextProdId.js`
    - [ ] Implement logic to fetch `MAX(id)` from `i_products2`
    - [ ] If `maxId` exists, return `maxId + 1`
    - [ ] If no products exist, return `parseInt(cat_id + "0001")`
- [ ] Verify the integration by checking if `addNewProd` correctly receives the new ID
