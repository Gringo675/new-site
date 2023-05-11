export default async () => {
  //
  const cart = useCart()
  const storCart = JSON.parse(localStorage.getItem('CART'))

  const addedProducts = []

  if (storCart?.length) {
    for (const storCartItem of storCart) {
      const cartItemIndex = cart.findIndex(cartItem => cartItem.id === storCartItem.id)
      if (cartItemIndex === -1) {
        addedProducts.push(storCartItem)
      } else cart[cartItemIndex].quantity = storCartItem.quantity
    }
  }

  // проверяем на удаленные с другой вкладки товары
  cart.forEach((cartItem, cartIndex, cartArr) => {
    if (!storCart?.some(storCartItem => storCartItem.id === cartItem.id)) cartArr.splice(cartIndex, 1)
  })

  if (!addedProducts.length) return

  // получаем данные для добавленных товаров
  const addedProductIds = addedProducts.map(item => item.id)

  const newProducts = await myFetch('/api/getProducts', {
    method: 'post',
    payload: addedProductIds,
  })
  // добавляем количество из localStorage
  newProducts.forEach(newProduct => {
    newProduct.quantity = addedProducts.find(product => product.id === newProduct.id).quantity
  })

  cart.push(...newProducts)
}
