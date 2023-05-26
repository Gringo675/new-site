export default phone => {
  // проверяет телефон на соответствие маске ### ###-##-##
  return /^\d\d\d \d\d\d-\d\d-\d\d$/.test(phone)
}
