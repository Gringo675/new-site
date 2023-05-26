const validate = phone => {
  // проверяет телефон на соответствие маске ### ###-##-##
  return /^\d\d\d \d\d\d-\d\d-\d\d$/.test(phone)
}

const phone = '951-775-34 08'

const aaa = validate(phone)

console.log(`aaa: ${JSON.stringify(aaa, null, 2)}`)
