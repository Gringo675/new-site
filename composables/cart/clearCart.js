export default () => {
  // полностью очищает корзину
  const cart = useCart()
  cart.length = 0
  localStorage.setItem('CART', JSON.stringify(cart))
}
