# Implementation Plan for AdminVendorsBrand.vue

The goal is to implement the `AdminVendorsBrand.vue` component to display a table of brand items with sorting and global filtering, following the pattern established in `AdminVendorsProds.vue`.

## Requirements
- **Columns**: `ean` and `name`.
- **Features**: 
  - Column sorting.
  - Global filtering.
  - Display of total and filtered item counts.
- **Data Source**: `items` prop passed from `app/pages/admin/cms/vendors.vue`.

## Technical Details
- Use `UTable` for the data grid.
- Use `UInput` for the global filter.
- Use `UButton` within the column headers for sorting triggers.
- Use `useTemplateRef` to access the `tableApi` for filtered row counts.

## Steps
1. **Define Props**:
   - Add `props` to accept `items` as an array.
2. **Implement Sorting Logic**:
   - Copy the `getHeader` function from [`app/components/admin/vendors/AdminVendorsProds.vue`](app/components/admin/vendors/AdminVendorsProds.vue:19) to provide sort buttons in the table header.
3. **Configure Columns**:
   - Define a `columns` array with:
     - `ean`: Label 'EAN'.
     - `name`: Label 'Наименование'.
4. **Implement Filtering**:
   - Create a `globalFilter` ref.
   - Implement `countFilteredRows` computed property using `table.value?.tableApi?.getFilteredRowModel().rows.length`.
5. **Build Template**:
   - Create a layout similar to [`app/components/admin/vendors/AdminVendorsProds.vue`](app/components/admin/vendors/AdminVendorsProds.vue:65).
   - Include the filter input and count display.
   - Implement `UTable` with the correct bindings (`:data="items"`, `:columns="columns"`, `v-model:global-filter="globalFilter"`).
   - Apply the same UI styling for table rows and headers.
