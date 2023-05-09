export default (index, quantity) => {
  // используется для изменения количества и удаления товаров из корзины
  const cart = useCart()

  if (quantity < 1) cart.splice(index, 1)
  else {
    cart[index].quantity = quantity
  }

  setCartToLocalStore()
}
