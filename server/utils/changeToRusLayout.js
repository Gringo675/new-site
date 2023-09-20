export default text => {
  // получаем строку и изменяем раскладку с латинских символов на русские
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
    '{': 'х',
    ']': 'ъ',
    '}': 'ъ',
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
    '"': 'э',
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
    '?': ',',
  }

  return text.replace(/[A-z/,.;\'\"\]\[\}\{<>\?]/g, function (x) {
    // return x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()
    return replacer[x.toLowerCase()]
  })
}
