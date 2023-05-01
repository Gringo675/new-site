export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)
  // получаем user'a
  const query = `SELECT *
                   FROM i_users WHERE id = ${tokenUser.id} LIMIT 1`
  const user = (await dbReq(query))[0]
  if (!user) throw createError({ statusCode: 401, statusMessage: `User not found!` })

  return {
    id: user.id,
    name: user.name,
    mail: user.mail,
    admin: !!user.admin,
    org: user.org,
    inn: user.inn,
    address: user.address,
    phone: user.phone,
    cart: user.cart,
  }
})
