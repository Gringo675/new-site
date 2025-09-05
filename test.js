const phones = [
  '8 (495) 532-44-92',
  '+7 495 5324492',
  '8-800-555-44-92',
  '8 800 555 44 92',
  '+7 (800) 555-44-92',
  '8.800.555.44.92',
  '8 495 5324492',
  '84955324492',
  '88005554492',
  '+74955324492',
  '+78005554492',
  '12345',
]

const createPhone = rawPhone => {
  let digits = rawPhone.replace(/\D/g, '')
  if (digits[0] === '7' || digits[0] === '8') {
    digits = digits.slice(1)
  }
  if (digits.length !== 10) {
    return ''
  }
  // Формат: xxx xxx-xx-xx
  return digits.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4')
}

phones.forEach(phone => {
  console.log(createPhone(phone))
})
