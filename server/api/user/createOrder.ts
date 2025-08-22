import { useStorage } from '#imports'

// --- Помощники и кэш для генерации писем ---
let cachedClientTemplate: string | null = null
let cachedSellerTemplate: string | null = null
let cachedRowTemplate: string | null = null

function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value)
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\\\]]/g, '\\$&')
}
// --- Конец блока помощников ---

/**
 * Получает formData c полями: user, cart (JSON), comment, files.
 * Быстрые заказы не сохраняются в базе, для них всегда возвращается номер (id) = 1.
 */

export default defineEventHandler(async event => {
  // const order = await getFormData(event)

  // order.created = new Date().toISOString()
  // order.id = order.user.auth ? await saveOrder(event, order) : 1

  // console.log(`order: ${JSON.stringify(order, null, 2)}`)
  const order = {
    files: [],
    message: '',
    user: {
      auth: false,
      admin: false,
      name: '',
      mail: '',
      org: '',
      inn: '',
      address: '',
      phone: '',
    },
    cart: '[{"id":180072,"image":"NIC-PT-CHIZ.jpg","name":"Нутромер индикаторный электронный НИЦ-ПТ 35-50 0,001 ЧИЗ","alias":"nut tromer-indikatornyy-elektronnyy-nic-pt-35-50-0001-chiz","price":93200,"quantity":1}]',
    created: '2025-08-22T09:48:58.814Z',
    id: 1,
  }
  await sendMails(order, event)

  return order.id
})

const saveOrder = async (event, order) => {
  // сохраняем заказ в базе и возвращаем id (номер) заказа
  const userId = (await checkToken(event)).id
  const query = `INSERT INTO i_orders SET created = '${order.created}', user_id = '${userId}',
                  cart = '${prepareString(order.cart)}', message = '${prepareString(order.message)}',
                  files = '${
                    order.files.length ? prepareString(order.files.map(file => file.filename).join(', ')) : ''
                  }'`
  // @ts-ignore
  return Number((await dbReq(query)).insertId)
}

const sendMails = async order => {
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
      const fileItems = order.files.map(file => `<li style="margin-bottom: 5px;">${file.filename}</li>`).join('')
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
  }

  // 3. Рендер обоих шаблонов
  let clientHtml = cachedClientTemplate
  let sellerHtml = cachedSellerTemplate

  for (const [key, value] of Object.entries(replacements)) {
    const escapedKey = escapeRegExp(key)
    clientHtml = clientHtml.replace(new RegExp(escapedKey, 'g'), String(value))
    sellerHtml = sellerHtml.replace(new RegExp(escapedKey, 'g'), String(value))
  }

  // 4. Подготовка и отправка писем
  const sellerMail = {
    to: 'gringo675@mail.ru', // Адрес менеджера
    subject: order.id === 1 ? 'Сайт - Быстрый заказ' : `Сайт - Новый заказ №${order.id}`,
    attachments: order.files,
    html: sellerHtml,
  }

  const clientMail = {
    to: order.user.mail,
    subject: `chelinstrument.ru - Информация по заказу` + order.fastOrder ? '' : ` №${order.id}`,
    html: clientHtml,
  }

  await sendMail(sellerMail)
  await sendMail(clientMail)
}
