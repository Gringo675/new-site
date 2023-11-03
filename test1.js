const changeKeyboardLayout = text => {
  const replacer = {
    q: 'й',
    w: 'ц',
    e: 'у',
    r: 'к',
    t: 'е',
    y: 'н',
    u: 'г',
    i: 'ш',
    o: 'щ',
    p: 'з',
    '[': 'х',
    ']': 'ъ',
    a: 'ф',
    s: 'ы',
    d: 'в',
    f: 'а',
    g: 'п',
    h: 'р',
    j: 'о',
    k: 'л',
    l: 'д',
    ';': 'ж',
    "'": 'э',
    z: 'я',
    x: 'ч',
    c: 'с',
    v: 'м',
    b: 'и',
    n: 'т',
    m: 'ь',
    ',': 'б',
    '<': 'б',
    '.': 'ю',
    '>': 'ю',
    '/': '.',
    '?': '.',
  }

  let result = ''
  for (let i = 0; i < text.length; i++) {
    const symbol = text[i].toLowerCase()
    result += replacer[symbol] ?? symbol
  }

  return result

  // return text.replace(/[A-z/,.;\'\]\[]/g, function (x) {
  //   return x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()
  // })
}

const transliterate = text => {
  const replacer = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'jo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ' ': '-',
    '\\': '',
    '/': '',
  }

  let result = ''
  for (let i = 0; i < text.length; i++) {
    const symbol = text[i].toLowerCase()
    result += replacer[symbol] ?? symbol
  }

  return result
}

const rus = 'Какой-то текст на-русском. Слешь: \\, второй №: /. And now english text.'

console.log(`transliterate(rus): ${JSON.stringify(transliterate(rus), null, 2)}`)
