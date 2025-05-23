/**
 * Получает formData c тремя полями: cart (JSON), comment, files; и поле user при быстром заказе.
 * Быстрые заказы не сохраняются в базе, для них всегда возвращается номер (id) = 1.
 */

export default defineEventHandler(async event => {
  //

  const order = await getFormData(event)
  console.log(`order: ${JSON.stringify(order, null, 2)}`)

  order.created = new Date().toISOString()
  order.id = order.user.auth ? await saveOrder(event, order) : 1
  await sendMails(order)

  return order.id
})

const saveOrder = async (event, order) => {
  // сохраняем заказ в базе и возвращаем id (номер) заказа
  const userId = (await checkToken(event)).id
  const query = `INSERT INTO i_orders SET created = '${order.created}', user_id = '${userId}',
                  cart = '${prepareString(order.cart)}', comment = '${prepareString(order.comment)}',
                  files = '${
                    order.files.length ? prepareString(order.files.map(file => file.filename).join(', ')) : ''
                  }'`
  // @ts-ignore
  return Number((await dbReq(query)).insertId)
}

const sendMails = async order => {
  // посылаем письма клиенту и менеджеру
  const client =
    order.user ||
    (await dbReq(`SELECT mail, name, org, inn, address, phone FROM i_users WHERE id = ${order.user_id} LIMIT 1`))[0]

  const cart = JSON.parse(order.cart)
  const cartTemplate =
    cart.reduce((acc, item) => {
      return (
        acc +
        `
      <div style="background: blue">
        <span style=""> ${item.id} </span>
        <span style=""> ${item.name} </span>
        <span style=""> ${item.quantity} </span>
        <span style=""> ${item.price} </span>
      </div>`
      )
    }, '<div style="border: 1px solid red">') + '</div>'

  const sellerMail = {
    to: 'gringo675@mail.ru',
    subject: order.fastOrder ? 'Сайт - Быстрый заказ' : `Сайт - Новый заказ №${order.id}`,
    attachments: order.files,
  }
  sellerMail.html = `
  <h1>Заголовок</h1>
  ${cartTemplate}
  <div>Примечание к заказу: <pre>${order.comment}</pre></div>
  <div>Client name: ${client.name}</div>
  <div>Client mail: ${client.mail}</div>
  <div>Client org: ${client.org}</div>
  <div>Client inn: ${client.inn}</div>
  <div>Client address: ${client.address}</div>
  <div>Client phone: ${client.phone}</div>
  `

  const clientMail = {
    to: client.mail,
    subject: `chelinstrument.ru - Информация по заказу` + order.fastOrder ? '' : ` №${order.id}`,
  }
  clientMail.html = `
  <h1>Благодарим за заказ!</h1>
  ${cartTemplate}
  <div>Подвал</div>
  `

  await sendMail(sellerMail)
  await sendMail(clientMail)
}
