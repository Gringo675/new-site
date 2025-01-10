const cart = reactive([])

export const useCart = () => cart

export const addProductToCart = product => {
  const { id, name, alias, price } = product
  const image = product.image ?? (Array.isArray(product.images) ? product.images[0] : product.images.match(/\S+/)[0])
  const quantity = 1
  cart.push({ id, name, alias, price, image, quantity })
  setCartToLocalStore()
}

export const updateCartFromLocalStore = async () => {
  const storCart = JSON.parse(localStorage.getItem('CART'))
  if (!storCart?.length) {
    cart.length = 0
    return
  }

  // обновляем количество и убираем отсутствующие товары
  const newCart = []
  for (const cartItem of cart) {
    const itemIndex = storCart.findIndex(storCartItem => storCartItem.id === cartItem.id)
    if (itemIndex === -1) continue
    cartItem.quantity = storCart[itemIndex].quantity
    newCart.push(cartItem)
  }
  cart.splice(0, cart.length, ...newCart)
  // добавляем новые товары
  const addedProducts = storCart.filter(storCartItem => !cart.some(cartItem => cartItem.id === storCartItem.id))
  if (!addedProducts.length) return
  const addedProductIds = addedProducts.map(item => item.id)
  console.log(
    `cartIds: ${JSON.stringify(
      cart.map(item => item.id),
      null,
      2
    )}`
  )
  console.log(
    `storIds: ${JSON.stringify(
      storCart.map(item => item.id),
      null,
      2
    )}`
  )
  console.log(`addedProductIds: ${JSON.stringify(addedProductIds, null, 2)}`)
  const newProducts = await myFetch('/api/getProducts', {
    method: 'post',
    payload: addedProductIds,
  })
  newProducts.forEach(newProduct => {
    newProduct.quantity = addedProducts.find(product => product.id === newProduct.id).quantity
  })
  cart.push(...newProducts)
}

export const setCartToLocalStore = () => {
  const cartMapped = cart.map(product => {
    return { id: product.id, quantity: product.quantity }
  })
  localStorage.setItem('CART', JSON.stringify(cartMapped))
}

export const clearCart = async () => {
  // const proceed = await confirmCartDelete()
  // if (!proceed) return
  cart.length = 0
  localStorage.setItem('CART', '[]')
}

export const changeCartQuantity = (index, quantity) => {
  if (quantity < 1) cart.splice(index, 1)
  else {
    cart[index].quantity = quantity
  }
  setCartToLocalStore()
}

export const confirmCartDelete = async () => {
  return showMessage({
    title: 'Подтвердите удаление',
    description: `Товар(-ы) будут удалены из корзины без возможности восстановления. Продолжить?`,
    isDialog: true,
  })
}
