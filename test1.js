const parseIsoDate = isoDate => {
  try {
    const parse = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
    return `${parse[3]}.${parse[2]}.${parse[1]} г.`
  } catch (e) {
    return ''
  }
}
const isoDate = '2029-05-26T19:00:00.000Z'

const aaa = parseIsoDate(isoDate)
console.log(aaa)
