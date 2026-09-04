import { JSDOM } from 'jsdom'

/**
 * Converts HTML content to readable Markdown text.
 * Strips unsupported/layout tags while preserving headings, paragraphs, lists, tables, and inline emphasis.
 */
export function htmlToMarkdown(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') return ''

  const dom = JSDOM.fragment(`<div>${html}</div>`)
  const root = dom.firstElementChild as HTMLElement

  if (!root) return ''

  function processNode(node: Node): string {
    if (node.nodeType === 3) {
      // Text node
      return node.textContent || ''
    }

    if (node.nodeType !== 1) {
      return ''
    }

    const el = node as HTMLElement
    const tagName = el.tagName.toLowerCase()

    // Process child contents first for container tags
    const getChildrenText = () => {
      let text = ''
      for (const child of Array.from(el.childNodes)) {
        text += processNode(child)
      }
      return text
    }

    switch (tagName) {
      case 'h1':
        return `\n\n# ${getChildrenText().trim()}\n\n`
      case 'h2':
        return `\n\n## ${getChildrenText().trim()}\n\n`
      case 'h3':
        return `\n\n### ${getChildrenText().trim()}\n\n`
      case 'h4':
        return `\n\n#### ${getChildrenText().trim()}\n\n`
      case 'h5':
      case 'h6':
        return `\n\n##### ${getChildrenText().trim()}\n\n`

      case 'p':
        return `\n\n${getChildrenText().trim()}\n\n`

      case 'br':
        return '\n'

      case 'strong':
      case 'b': {
        const content = getChildrenText().trim()
        return content ? `**${content}**` : ''
      }

      case 'em':
      case 'i': {
        const content = getChildrenText().trim()
        return content ? `*${content}*` : ''
      }

      case 'a': {
        const text = getChildrenText().trim()
        const href = el.getAttribute('href')
        if (!text) return ''
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          return `[${text}](${href})`
        }
        return text
      }

      case 'ul': {
        const items: string[] = []
        for (const child of Array.from(el.children)) {
          if (child.tagName.toLowerCase() === 'li') {
            const itemText = processNode(child).trim()
            if (itemText) {
              items.push(`- ${itemText}`)
            }
          }
        }
        return `\n\n${items.join('\n')}\n\n`
      }

      case 'ol': {
        const items: string[] = []
        let idx = 1
        for (const child of Array.from(el.children)) {
          if (child.tagName.toLowerCase() === 'li') {
            const itemText = processNode(child).trim()
            if (itemText) {
              items.push(`${idx}. ${itemText}`)
              idx++
            }
          }
        }
        return `\n\n${items.join('\n')}\n\n`
      }

      case 'li':
        return getChildrenText()

      case 'table': {
        const rows: string[][] = []
        const trs = el.querySelectorAll('tr')

        trs.forEach(tr => {
          const cells: string[] = []
          tr.querySelectorAll('th, td').forEach(cell => {
            // Replace newlines within a cell with space
            const cellText = (cell.textContent || '').replace(/\s+/g, ' ').trim()
            cells.push(cellText)
          })
          if (cells.length > 0) {
            rows.push(cells)
          }
        })

        if (rows.length === 0) return ''

        // Normalize column count
        const maxCols = Math.max(...rows.map(r => r.length))
        const normalizedRows = rows.map(r => {
          while (r.length < maxCols) {
            r.push('')
          }
          return r
        })

        const headerRow = normalizedRows[0]
        const dataRows = normalizedRows.slice(1)

        let mdTable = `\n\n| ${headerRow.join(' | ')} |\n`
        mdTable += `| ${headerRow.map(() => '---').join(' | ')} |\n`

        for (const row of dataRows) {
          mdTable += `| ${row.join(' | ')} |\n`
        }

        return `${mdTable}\n`
      }

      case 'script':
      case 'style':
      case 'noscript':
        return ''

      default:
        return getChildrenText()
    }
  }

  let result = processNode(root)

  // Clean up whitespace: remove raw HTML tags if any escaped, collapse empty lines
  result = result
    .replace(/<[^>]+>/g, '') // remove any stray HTML tags
    .replace(/[ \t]+/g, ' ') // collapse horizontal spaces
    .replace(/\n\s+\n/g, '\n\n') // clean empty whitespace lines
    .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines to at most 2 newlines
    .trim()

  return result
}
