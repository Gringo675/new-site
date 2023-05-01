export default event => {
  setCookie(event, 'token', '', {
    path: '/',
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
}
