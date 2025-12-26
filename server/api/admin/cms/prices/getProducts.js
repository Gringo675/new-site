export default defineEventHandler(async event => {
  // 
  let query = `SELECT id, name, category_id, brand_eans, 	price, 	special_price, old_price, vendor_price, 	vendor_old_price, verification_price, 	stock, vendor_stock, 	date_price_changed, date_vendor_price_changed FROM i_products limit 10`
  const products = await dbReq(query)

  return products
})
