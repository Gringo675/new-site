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
    '.': 'ю',
    '/': '.',
  }

  return text.replace(/[A-z/,.;\'\]\[]/g, function (x) {
    return x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()
  })
}

const test = {
  '[': 'aaa',
  '{': 'bbb',
}

const ccc = '{'.toLowerCase()

const ddd = test[ccc]

console.log(`ddd: ${JSON.stringify(ddd, null, 2)}`)
