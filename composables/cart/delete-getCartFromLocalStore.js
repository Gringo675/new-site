export default async () => {
  //
  const cart = useCart()

  const storCart = JSON.parse(localStorage.getItem('CART'))
  if (!storCart?.length) return

  const productIds = storCart.map(item => item.id)

  const products = await myFetch('/api/getProducts', {
    method: 'post',
    payload: productIds,
  })

  storCart.map(item => {
    const product = products.find(product => product.id === item.id)
    const params = ['name', 'alias', 'price', 'image']
    params.forEach(key => (item[key] = product[key]))
  })

  cart.push(...storCart)
}
