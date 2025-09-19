import { useStorage } from '#imports'

// --- Помощники и кэш для генерации писем ---
let cachedClientTemplate = null
let cachedSellerTemplate = null
let cachedRowTemplate = null

function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value)
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\\]]/g, '\\$&')
}
// --- Конец блока помощников ---

/**
 * Получает formData c полями: user, cart (JSON), comment, files.
 * Быстрые заказы не сохраняются в базе, для них номером заказа возвращаем случайное число.
 */

export default defineEventHandler(async event => {
  const order = await getFormData(event)

  order.created = new Date().toISOString()
  order.id = order.user.auth ? await saveOrder(event, order) : getRandomCode()

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
  const total = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)

  const imagePath = `${config.STATIC_ABSOLUTE_PATH}img/products/thumb_`
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

  // 3. Рендер HTML-шаблонов
  let clientHtml = cachedClientTemplate
  let sellerHtml = cachedSellerTemplate

  for (const [key, value] of Object.entries(replacements)) {
    const escapedKey = escapeRegExp(key)
    clientHtml = clientHtml.replace(new RegExp(escapedKey, 'g'), String(value))
    sellerHtml = sellerHtml.replace(new RegExp(escapedKey, 'g'), String(value))
  }

  // 4. Генерация текстовых версий писем
  const productRowsText = cartProducts
    .map(
      product =>
        `* ${product.name} (Арт: ${product.id}) - ${product.quantity} шт. x ${formatCurrency(
          product.price,
        )} = ${formatCurrency(product.price * product.quantity)}`,
    )
    .join('\n')

  const clientText = `Здравствуйте, ${order.user.name}!

Спасибо за ваш заказ №${order.id} от ${new Date(order.created).toLocaleDateString('ru-RU')}.
В ближайшее время Вы получите счет для оплаты, или наш менеджер свяжется с Вами для уточнения делатей заказа.

СОСТАВ ЗАКАЗА:
${productRowsText}

ИТОГО: ${formatCurrency(total)}
Стоимость указана в рублях РФ без учета НДС.

С уважением,
Команда ООО Торговый Дом "Челябинский Инструмент"
г. Челябинск, ул. Болейко, 5 | +7 (351) 790-77-48`

  const sellerText = `Новый заказ №${order.id} от ${new Date(order.created).toLocaleDateString('ru-RU')}

ИНФОРМАЦИЯ О КЛИЕНТЕ:
Имя: ${order.user.name}
Email: ${order.user.mail}
Телефон: ${order.user.phone}
Организация: ${order.user.org || '-'}
ИНН: ${order.user.inn || '-'}
Адрес: ${order.user.address || '-'}

СОСТАВ ЗАКАЗА:
${productRowsText}

ИТОГО: ${formatCurrency(total)}

ПРИМЕЧАНИЕ К ЗАКАЗУ:
${order.message || 'Нет'}

ПРИКРЕПЛЕННЫЕ ФАЙЛЫ:
${order.files && order.files.length > 0 ? order.files.map(f => f.filename).join(', ') : 'Нет'}`

  // 5. Подготовка и отправка писем
  const sellerMail = {
    to: 'gringo675@mail.ru', // Адрес менеджера
    subject: order.user.auth ? 'Сайт - Быстрый заказ' : `Сайт - Новый заказ №${order.id}`,
    attachments: order.files,
    html: sellerHtml,
    text: sellerText, // Текстовая версия
  }

  const clientMail = {
    to: order.user.mail,
    subject: `chelinstrument.ru - Информация по заказу №${order.id}`,
    html: clientHtml,
    text: clientText, // Текстовая версия
  }

  await sendMail(sellerMail)
  await sendMail(clientMail)
}
