export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)
  const query = `SELECT id, created, cart, message, files FROM i_orders WHERE user_id = ${tokenUser.id}`
  const orders = (await dbReq(query)) as any[]

  for (const order of orders) {
    order.created = new Date(order.created).toLocaleDateString('ru-RU')
    order.cart = JSON.parse(order.cart)
  }
  // const order = orders[0]
  // console.log(`order.id: ${JSON.stringify(order.id, null, 2)}`)
  // const cart = order.cart
  // console.log(`cart: ${cart}`)
  // console.log(`cart: ${JSON.stringify(cart, null, 2)}`)
  // console.log(`type of cart: ${typeof cart}`)
  return orders
})
