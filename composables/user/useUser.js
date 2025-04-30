export default () => {
  return useState('user', () => {
    return {
      auth: false,
      admin: false,
      name: '',
      mail: '',
      org: '',
      inn: '',
      address: '',
      phone: '',
    }
  })
}
