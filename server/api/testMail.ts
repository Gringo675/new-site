import { useStorage } from '#imports'

// Кэш для шаблонов
let cachedClientTemplate: string | null = null
let cachedSellerTemplate: string | null = null
let cachedRowTemplate: string | null = null

// Функция для форматирования цены
function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value)
}

// Функция для экранирования спецсимволов в строке для создания RegExp
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\\]/g, '\\$&') // $& значит всю найденную подстроку
}

export default defineEventHandler(async event => {
  try {
    // Эмуляция входных данных заказа
    const order = {
      files: ['реквизиты.doc', 'карта.pdf'],
      message: 'Это примечание к заказу',
      user: {
        auth: true,
        admin: true,
        name: 'Карл Мартынов',
        mail: 'gringo675g@gmail.com',
        org: 'ООО "Ромашка"',
        inn: '6737472938',
        address: 'г. Большой Костел, ул. Пятой Пятилетки, д.1',
        phone: '8-800-555-35-35',
        id: 45,
      },
      cart: `[{"id":110193,"image":"SHCC3-CHIZ.jpg","name":"Штангенциркуль электронный ШЦЦ-III-500-0,01 губк. 100 ЧИЗ","alias":"shtangentsirkul-shtsts-iii-500-0-01-elektronnyj-chiz","price":37200,"quantity":2},{"id":110194,"image":"SHCC3-GRIFF.jpg","name":"Штангенциркуль электронный ШЦЦ-III-500-0,01 GRIFF","alias":"shtangentsirkul-shtsts-iii-500-0-01-elektronnyj-griff","price":20150,"quantity":1},{"id":110191,"image":"SHCC3-CHIZ.jpg","name":"Штангенциркуль электронный ШЦЦ-III-400-0,01 губк. 100 ЧИЗ","alias":"shtangentsirkul-shtsts-iii-400-0-01-elektronnyj-chiz","price":27250,"quantity":3}]`,
      created: '2025-08-21T10:38:10.441Z',
      id: 31,
    }

    // 1. Загрузка шаблонов с кэшированием
    if (process.env.NODE_ENV === 'development' || !cachedClientTemplate || !cachedSellerTemplate || !cachedRowTemplate) {
      const storage = useStorage('assets:server')
      const [clientTpl, sellerTpl, rowTpl] = await Promise.all([
        storage.getItem('emails/orderClientTemplate.html'),
        storage.getItem('emails/orderSellerTemplate.html'),
        storage.getItem('emails/orderProductRow.html'),
      ])
      if (!clientTpl || !sellerTpl || !rowTpl) throw new Error('Не удалось загрузить один из шаблонов письма.')
      cachedClientTemplate = clientTpl
      cachedSellerTemplate = sellerTpl
      cachedRowTemplate = rowTpl
    }

    // 2. Сборка общего контента для обоих писем
    const cartProducts = JSON.parse(order.cart)
    const total = cartProducts.reduce((sum: number, product: any) => sum + product.price * product.quantity, 0)

    const imagePath = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/thumb_'
    const productBaseUrl = 'https://chelinstrument.ru/product/'
    let productRowsHtml = ''
    for (const product of cartProducts) {
      const rowHtml = cachedRowTemplate
        .replace(/{{productImageUrl}}/g, imagePath + product.image)
        .replace(/{{productName}}/g, product.name)
        .replace(/{{productId}}/g, product.id)
        .replace(/{{productUrl}}/g, productBaseUrl + product.alias)
        .replace(/{{productQuantity}}/g, String(product.quantity))
        .replace(/{{productPrice}}/g, formatCurrency(product.price * product.quantity))
      productRowsHtml += rowHtml
    }

    let orderNoteHtml = ''
    if (order.message || (order.files && order.files.length > 0)) {
      let messagePart = ''
      if (order.message) {
        messagePart = `<h4 style="font-size: 16px; font-weight: bold; color: #8a2be2; margin: 20px 0 5px;">Примечание к заказу</h4><p style="margin: 0 0 15px; color: #555555;">${order.message}</p>`
      }
      let filesPart = ''
      if (order.files && order.files.length > 0) {
        const fileItems = order.files.map(file => `<li style="margin-bottom: 5px;">${file}</li>`).join('')
        filesPart = `<h4 style="font-size: 16px; font-weight: bold; color: #8a2be2; margin: 20px 0 5px;">Прикрепленные файлы</h4><ul style="margin: 0; padding-left: 20px; color: #555555;">${fileItems}</ul>`
      }
      orderNoteHtml = messagePart + filesPart
    }

    const replacements = {
      '<!--PRODUCT_ROWS-->': productRowsHtml,
      '<!--ORDER_NOTE-->': orderNoteHtml,
      '{{orderId}}': String(order.id),
      '{{orderDate}}': new Date(order.created).toLocaleDateString('ru-RU'),
      '{{customerName}}': order.user.name,
      '{{customerEmail}}': order.user.mail,
      '{{customerPhone}}': order.user.phone,
      '{{customerOrg}}': order.user.org,
      '{{customerInn}}': order.user.inn,
      '{{customerAddress}}': order.user.address,
      '{{orderTotal}}': formatCurrency(total),
      '{{currentYear}}': String(new Date().getFullYear()),
      '{{adminOrderUrl}}': `https://chelinstrument.ru/admin/orders/${order.id}`,
    }

    // 3. Рендер обоих шаблонов
    let clientHtml = cachedClientTemplate
    let sellerHtml = cachedSellerTemplate

    for (const [key, value] of Object.entries(replacements)) {
      const escapedKey = escapeRegExp(key)
      clientHtml = clientHtml.replace(new RegExp(escapedKey, 'g'), String(value))
      sellerHtml = sellerHtml.replace(new RegExp(escapedKey, 'g'), String(value))
    }

    const divider = '<hr style="border: none; border-top: 5px solid red; margin: 50px 0;">'

    return clientHtml + divider + sellerHtml

  } catch (error) {
    console.error('Ошибка при генерации письма:', error)
    return new Response(error.message, { status: 500 })
  }
})