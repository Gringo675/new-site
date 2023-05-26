/**
 * Получает formData c тремя полями: cart, comment, file
 */

export default defineEventHandler(async event => {
  //
  const tokenUser = await checkToken(event)

  const formData = await readMultipartFormData(event)
  // console.log(`formData: ${JSON.stringify(formData, null, 2)}`)
  const order = {}
  let cart, attachedFile
  for (const formItem of formData) {
    if (formItem.name === 'file') {
      order.file = formItem.filename
      attachedFile = formItem.data
      if (attachedFile.length > 5242880) throw createError({ statusCode: 511, statusMessage: `Very big file!` })
    } else {
      order[formItem.name] = formItem.data.toString()
      if (formItem.name === 'cart') {
        cart = JSON.parse(order.cart)
        if (!cart.length) throw createError({ statusCode: 511, statusMessage: `No products in cart!` })
      }
    }
  }

  order.created = new Date().toISOString()
  order.user_id = tokenUser.id
  order.id = await saveOrder(order)
  await sendMails(order, cart, attachedFile)

  return order.id
})

const saveOrder = async order => {
  // сохраняем заказ в базе и возвращаем id (номер) заказа
  const query = `INSERT INTO i_orders SET ${Object.keys(order)
    .map(key => `${key} = '${prepareString(order[key])}'`)
    .join(', ')}`
  // @ts-ignore
  return (await dbReq(query)).insertId
}

const sendMails = async (order, cart, attachedFile) => {
  // посылаем письма клиенту и менеджеру
  const query = `SELECT mail, name, org, inn, address, phone FROM i_users WHERE id = ${order.user_id} LIMIT 1`
  const client = (await dbReq(query))[0]
  cv({ client })
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
    subject: `Новый заказ №${order.id}`,
    attachments: order.file.length ? [{ filename: order.file, content: attachedFile }] : [],
  }
  sellerMail.html = `
  <h1>Заголовок</h1>
  ${cartTemplate}
  <div>Примечание к заказу: ${order.comment}</div>
  <div>Client name: ${client.name}</div>
  <div>Client mail: ${client.mail}</div>
  <div>Client org: ${client.org}</div>
  <div>Client inn: ${client.inn}</div>
  <div>Client address: ${client.address}</div>
  <div>Client phone: ${client.phone}</div>
  `

  const clientMail = {
    to: client.mail,
    subject: `chelinstrument.ru - Информация по заказу №${order.id}`,
  }
  clientMail.html = `
  <h1>Благодарим за заказ!</h1>
  ${cartTemplate}
  <div>Подвал</div>
  `

  await sendMail(sellerMail)
  await sendMail(clientMail)
}
