const cart = reactive([])

export const useCart = () => cart

export const addProductToCart = product => {
  const { id, name, alias, price, label, priceRegular } = product
  const image = product.image ?? (Array.isArray(product.images) ? product.images[0] : product.images.match(/\S+/)[0])
  cart.push({ id, name, alias, price, image, label, priceRegular, quantity: 1 })
}

// using in TheCart.vue
export const updateCartFromLocalStore = () => updateCartFromLocalStoreHelper.handle()

const updateCartFromLocalStoreHelper = {
  pending: false,
  updateWaiting: false,
  async handle() {
    if (this.pending) {
      this.updateWaiting = true
      return
    }
    try {
      this.pending = true
      await this.update()
    } catch (e) {
      console.error(`Can't update cart: ${e.message}`)
    } finally {
      this.pending = false
      if (this.updateWaiting) {
        this.updateWaiting = false
        this.handle()
      }
    }
  },
  async update() {
    let storCart
    try {
      storCart = JSON.parse(localStorage.getItem('CART'))
    } catch (e) {
      console.error('Failed to get CART from localStorage:', e)
      return
    }

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
    const newProducts = await myFetch(`/api/getData/products?pIds=${addedProductIds.join(',')}`, {
      silent: true,
    })
    newProducts.forEach(newProduct => {
      newProduct.quantity = addedProducts.find(product => product.id === newProduct.id).quantity
    })
    cart.push(...newProducts)
  },
}

// using in TheCart.vue
export const setCartToLocalStore = () => {
  const cartMapped = cart.map(product => {
    return { id: product.id, quantity: product.quantity }
  })
  try {
    localStorage.setItem('CART', JSON.stringify(cartMapped))
  } catch (e) {
    console.error('Failed to set CART in localStorage:', e)
  }
}

// export const clearCart = async () => {
//   const proceed = await confirmCartDelete()
//   if (!proceed) return
//   cart.length = 0
//   localStorage.setItem('CART', '[]')
// }

// export const changeCartQuantity = (index, quantity) => {
//   console.log(`from changeCartQuantity`)
//   if (quantity < 1) cart.splice(index, 1)
//   else {
//     cart[index].quantity = quantity
//   }
//   console.log(`before cart[index].quantity: ${JSON.stringify(cart[index].quantity, null, 2)}`)
//   setCartToLocalStore()
//   console.log(`after cart[index].quantity: ${JSON.stringify(cart[index].quantity, null, 2)}`)
// }

// export const confirmCartDelete = () => {
//   // return promise
//   return showMessage({
//     title: 'Подтвердите удаление',
//     description: `Товар(-ы) будут удалены из корзины без возможности восстановления. Продолжить?`,
//     isDialog: true,
//   })
// }
