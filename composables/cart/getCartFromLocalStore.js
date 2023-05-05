export default () => {
  //
  const cart = useCart()

  const storCart = JSON.parse(localStorage.getItem('CART'))
  cv({ storCart })
  if (!storCart?.length) return
}
