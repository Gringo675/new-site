# API Security Audit and SQL Injection Refactor

## Overview
The security audit revealed that almost all API endpoints in `server/api` and the authentication utility in `server/utils/auth.js` are vulnerable to SQL injection. The current implementation interpolates variables directly into SQL query strings using template literals.

## Goals
- Eliminate all SQL injection vulnerabilities by transitioning to parameterized queries.
- Refactor all `dbReq(query)` calls to `dbReq(query, [parameters])`.
- Ensure all database interactions use the `mysql2` prepared statement capabilities via `pool.execute` (already implemented in `server/utils/dbReq.js`).

## Action Plan

### 1. Refactor `server/utils/auth.js`
- [ ] Refactor `createToken` to use parameterized query for updating `last_refresh`.
- [ ] Refactor `refreshToken` to use parameterized query for selecting the user.

### 2. Refactor `server/api/user` Endpoints
- [ ] `changeUser.js`: Parameterize `UPDATE` query.
- [ ] `verifyNewMail.js`: Parameterize `SELECT` query.
- [ ] `getUser.js`: Parameterize `SELECT` query.
- [ ] `createOrder.js`: Parameterize `INSERT` query.

### 3. Refactor `server/api/auth` Endpoints
- [ ] `oauth/[provider].js`: Parameterize `SELECT` and `UPDATE` queries.
- [ ] `login/verifyCode.js`: Parameterize `SELECT` and `UPDATE` queries.
- [ ] `login/createCode.js`: Parameterize `SELECT` query.
- [ ] `logout.js`: (Verify if `dbReq` is used).

### 4. Refactor `server/api/getData` Endpoints
- [ ] `category/[c_alias].js`: Parameterize `SELECT` queries. Handle `IN` clauses for properties and docs using dynamic placeholders.
- [ ] `product/[p_alias].js`: Parameterize `SELECT` queries. Handle `IN` clauses for properties, reestr, standart, and pasport docs.
- [ ] `content/[cont_alias].js`: Parameterize `SELECT` query.
- [ ] `products.js`: Parameterize `SELECT` query.
- [ ] `categories.js`: Parameterize `SELECT` query.
- [ ] `label.js`: Parameterize `SELECT` query.
- [ ] `standards.js`: Parameterize `SELECT` query.
- [ ] `grsi.js`: Parameterize `SELECT` query.
- [ ] `searchOld.js`: Parameterize `SELECT` queries. Handle `IN` clauses and dynamic `WHERE` conditions.

### 5. Refactor `server/api/admin` Endpoints
- [ ] `getCategories.js`: Parameterize `SELECT` query.
- [ ] `getProperties.js`: Parameterize `SELECT` query.
- [ ] `setCategories.js`: Parameterize `INSERT`/`UPDATE` queries.
- [ ] `setProperties.js`: Parameterize `SELECT` and `UPDATE` queries.
- [ ] `cms/getBrands.js`: (Check if parameterization is needed).
- [ ] `cms/getMainCats.js`: (Check if parameterization is needed).
- [ ] `cms/documentation/getProds.js`: Parameterize `SELECT` query. Handle dynamic `propFilters`.
- [ ] `cms/documentation/getPasp.js`, `getRstr.js`, `getStnd.js`: (Check if parameterization is needed).
- [ ] `cms/documentation/setProd.js`, `setPasp.js`, `setRstr.js`, `setStnd.js`: Parameterize queries.
- [ ] `cms/labels/getLabels.js`: (Check if parameterization is needed).
- [ ] `cms/labels/getProds.js`: (Check if parameterization is needed).
- [ ] `cms/labels/updProds.js`: Parameterize `UPDATE` query.
- [ ] `cms/prices/getProducts.js`: (Check if parameterization is needed).
- [ ] `cms/products/getNextProdId.js`: Parameterize `SELECT` query.
- [ ] `cms/products/getProds.js`: Parameterize `SELECT` query. Handle dynamic `propFilters`.
- [ ] `cms/products/updProds.js`: Parameterize `DELETE`, `INSERT`, and `UPDATE` queries.
- [ ] `cms/vendors/getVendor.js`: (Already partially parameterized, verify all).
- [ ] `cms/vendors/setProducts.js`: (Already partially parameterized, verify all).
- [ ] `dbImport/brands.js`, `categories.js`, `docs.js`, `products.js`, `properties.js`, `users.js`, `setProductLabels.js`: Parameterize queries.
- [ ] `log/getLog.js`, `clearLog.js`: Parameterize queries.
- [ ] `system/fixDocLinks.js`: Parameterize queries.
- [ ] `setVendors.js`: (Already partially parameterized, verify all).

### 6. Refactor `server/api/log` and `server/api/other`
- [ ] `log/setText.js`: Parameterize `INSERT` query.
- [ ] `log/setError.js`: Parameterize `INSERT` query.
- [ ] `other/getNormDocsForProduct.js`: Parameterize `SELECT` query.
- [ ] `other/getLyrics.js`: Verify `dodbReq` implementation.

### 7. Final Verification
- [ ] Search for all remaining `dbReq` calls in the project to ensure none were missed.
- [ ] Verify that no variables are still being interpolated into query strings.
- [ ] Test key endpoints to ensure functionality is preserved.
