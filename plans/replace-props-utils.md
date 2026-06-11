# Replace useCatProps and usePropsGroups with usePrpsGroupsMap

## Goal
Replace the deprecated `useCatProps` and `usePropsGroups` utilities with the new `usePrpsGroupsMap` utility across the project. Ensure that the code correctly handles the `Map` return type of `usePrpsGroupsMap`.

## Todo List
- [ ] Update `server/utils/searchIndex.js`
    - Replace `usePropsGroups()` with `Array.from(usePrpsGroupsMap().keys())`
- [ ] Update `server/api/getData/product/[p_alias].js`
    - Replace `usePropsGroups()` with `Array.from(usePrpsGroupsMap().keys())`
    - Replace `useCatProps(productData.category_id)` with `usePrpsGroupsMap(productData.category_id)`
    - Replace `catProps[prop.name]` with `catProps.get(prop.name)`
- [ ] Update `server/api/getData/category/[c_alias].js`
    - Replace `useCatProps(productsCatId)` with `usePrpsGroupsMap(productsCatId)`
    - Replace `for (let propKey in filterGroups)` with `for (let propKey of filterGroups.keys())`
    - Replace `filterGroups[propKey]` with `filterGroups.get(propKey)`
    - Replace `Object.values(filterGroups)` with `Array.from(filterGroups.values())`
- [ ] Update `server/api/admin/setProperties.js`
    - Replace `usePropsGroups()` with `Array.from(usePrpsGroupsMap().keys())`
- [ ] Delete `server/utils/useCatProps.js`
- [ ] Delete `server/utils/usePropsGroups.js`
