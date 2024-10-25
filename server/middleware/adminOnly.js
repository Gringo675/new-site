export default defineEventHandler(async event => {
  const { path } = event
  if (path.startsWith('/api/admin')) {
    await checkToken(event, {
      adminOnly: true,
    })
  }
})
