/**
 * Единая функция для добавления и удаления товаров из корзины.
 * Принимает id товара и один из следующих строковых параметров:
 * add - +1 или добавить товар
 * remove - -1 или удалить товар (если количество = 0)
 * quantity("Number") - установить количество товара (при нуле удалить)
 */

export default (productId, arg = '') => {
  // @ts-ignore
  if (arg !== 'add' || arg !== 'remove' || !isNaN(Number(arg))) return

  const cart = useCart()

  if (arg === 'add') {
    const cartIndex = cart.find(cartProduct => cartProduct.id === productId)
  }
}
