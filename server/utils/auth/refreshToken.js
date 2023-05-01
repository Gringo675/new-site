export default async (tokenUser, event) => {
  console.log(`from refresh`)
  const query = `SELECT id, admin
                   FROM i_users WHERE id = ${tokenUser.id} LIMIT 1`
  const user = (await dbReq(query))[0]
  if (!user) throw createError({ statusCode: 401, statusMessage: `User not found!` })

  createToken(user, event)
}
