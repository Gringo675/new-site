// используется для удаления cookie (token), т.к. из-за httpOnly на клиенте через js это сделать нельзя

export default defineEventHandler(async event => {
  deleteToken(event)

  return true // если ничего не возвращать, будет 404
})
