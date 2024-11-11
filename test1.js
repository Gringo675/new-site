import { JSDOM } from 'jsdom'
import prettier from 'prettier'

// const dom = new JSDOM(`<!DOCTYPE html><html><head><title>Documentation</title></head><body/></html>`)

// const resultHtml = dom.serialize()

const ttext = `<ul><li>Диапазоны измерений - до 125, 150, 200, 250, 300 мм.</li>  <li>Точность измерений - 0,1 и 0,05 мм.</li>  <li>Производства СТИЗ поставляются с поверкой.</li></ul>`

const formattedHtml = await prettier.format(ttext, { parser: 'html' })
console.log(formattedHtml)

// const frag = JSDOM.fragment(ttext)
// const el = frag.querySelector('#description1')?.innerHTML
