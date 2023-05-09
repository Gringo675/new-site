export default () => {
  return useState('user', () => {
    return {
      auth: false,
      showLogin: false,
      name: '',
      mail: '',
      org: '',
      inn: '',
      address: '',
      phone: '',
    }
  })
}
