export default () => {
  //
  const cart = useCart().map(product => {
    return { id: product.id, quantity: product.quantity }
  })

  localStorage.setItem('CART', JSON.stringify(cart))
}
