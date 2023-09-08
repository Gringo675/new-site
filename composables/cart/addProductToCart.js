export default product => {
  //
  const cart = useCart()
  console.log(`here`)
  console.log(`product: ${JSON.stringify(product, null, 2)}`)
  const { id, name, alias, price } = product
  // если не массив (строка), достаем первое слово до пробела
  const image = product.image ?? (Array.isArray(product.images) ? product.images[0] : product.images.match(/\S+/)[0])

  const quantity = 1

  cart.push({ id, name, alias, price, image, quantity })

  setCartToLocalStore()
}
