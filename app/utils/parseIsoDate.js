// получает содержащую дату ИСО-строку из базы и отдает в формате dd.mm.yyyy
export default isoDate => {
  try {
    const parse = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
    return `${parse[3]}.${parse[2]}.${parse[1]} г.`
  } catch (e) {
    return ''
  }
}
