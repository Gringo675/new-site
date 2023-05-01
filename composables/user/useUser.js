export default () => {
  return useState('user', () => {
    return {
      auth: false,
    }
  })
}
