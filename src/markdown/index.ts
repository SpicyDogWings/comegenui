import { marked } from 'marked'
import { slugify } from '@/utils/slugify'

export interface MarkdownBlock {
  type: 'html' | 'table' | 'code-block' | 'blockquote' | 'inline' | 'list'
  html?: string
  tag?: string
  id?: string
  htmlContent?: string
  listHtml?: string[]
  table?: {
    columns: Array<{ key: string; label: string }>
    data: Array<Record<string, string>>
  }
  codeBlock?: {
    code: string
    language: string
  }
  blockquote?: {
    html: string
  }
  listItems?: { tokens: any[] }[]
  ordered?: boolean
}

const classMap: Record<string, string> = {
  heading: 'cu-md-heading',
  paragraph: 'cu-md-paragraph',
  strong: 'cu-md-strong',
  em: 'cu-md-em',
  code: 'cu-md-code-block',
  codespan: 'cu-md-code-inline',
  blockquote: 'cu-md-blockquote',
  list: 'cu-md-list',
  list_item: 'cu-md-list-item',
  link: 'cu-md-link',
  image: 'cu-md-image',
  hr: 'cu-md-hr',
  table: 'cu-table-element',
  th: 'cu-table-th',
  td: 'cu-table-td',
  tr: 'cu-table-row',
  del: 'cu-md-del',
  br: 'cu-md-br',
}

const renderer = new marked.Renderer()

renderer.heading = function ({ depth, tokens }: any) {
  const cls = classMap.heading
  const content = this.parser.parseInline(tokens)
  const id = slugify(plainText(tokens)) || 'section'
  return `<h${depth} id="${id}" class="${cls} ${cls}-${depth}">${content}</h${depth}>\n`
}

renderer.paragraph = function ({ tokens }: any) {
  return `<p class="${classMap.paragraph}">${this.parser.parseInline(tokens)}</p>\n`
}

renderer.strong = function ({ tokens }: any) {
  return `<strong class="${classMap.strong}">${this.parser.parseInline(tokens)}</strong>`
}

renderer.em = function ({ tokens }: any) {
  return `<em class="${classMap.em}">${this.parser.parseInline(tokens)}</em>`
}

renderer.code = function ({ text, lang }: any) {
  const cls = classMap.code
  const langClass = lang ? ` ${cls}--${lang}` : ''
  return `<pre class="${cls}${langClass}"><code>${escapeHtml(text)}</code></pre>\n`
}

renderer.codespan = function ({ text }: any) {
  return `<code class="${classMap.codespan}">${escapeHtml(text)}</code>`
}

renderer.blockquote = function ({ tokens }: any) {
  const inner = this.parser.parse(tokens)
  return `<blockquote class="${classMap.blockquote}">${inner}</blockquote>\n`
}

renderer.list = function ({ ordered, items }: any) {
  const cls = classMap.list
  const tag = ordered ? 'ol' : 'ul'
  let body = ''
  for (const item of items) {
    body += `<li class="${classMap.list_item}">${this.parser.parseInline(item.tokens)}</li>\n`
  }
  return `<${tag} class="${cls} ${cls}--${ordered ? 'ordered' : 'unordered'}">${body}</${tag}>\n`
}

renderer.link = function ({ href, tokens }: any) {
  const text = this.parser.parseInline(tokens)
  return `<a href="${escapeHtml(href)}" class="${classMap.link}" target="_blank" rel="noopener">${text}</a>`
}

renderer.image = function ({ href, text, tokens }: any) {
  const alt = plainText(tokens || []) || text || ''
  return `<img src="${escapeHtml(href)}" alt="${escapeText(alt)}" class="${classMap.image}" />`
}

renderer.hr = function () {
  return `<hr class="${classMap.hr}" />\n`
}

renderer.table = function ({ header, rows }: any) {
  let headerRow = ''
  for (const cell of header) {
    headerRow += `<th class="${classMap.th}">${this.parser.parseInline(cell.tokens)}</th>`
  }
  let bodyRows = ''
  for (const row of rows) {
    let rowCells = ''
    for (const cell of row) {
      rowCells += `<td class="${classMap.td}">${this.parser.parseInline(cell.tokens)}</td>`
    }
    bodyRows += `<tr class="${classMap.tr}">${rowCells}</tr>`
  }
  return `<table class="${classMap.table}"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>\n`
}

renderer.del = function ({ tokens }: any) {
  return `<del class="${classMap.del}">${this.parser.parseInline(tokens)}</del>`
}

renderer.text = function (token: any) {
  if (token.tokens) {
    return this.parser.parseInline(token.tokens)
  }
  return token.escaped ? token.text : escapeText(token.text)
}

marked.setOptions({ renderer })

// Escapa texto normal respetando las entidades que ya vienen (`&amp;` no se
// vuelve `&amp;amp;`). Escapa comillas porque también se usa en atributos.
function escapeText(text: string): string {
  return text
    .replace(/&(?!#?\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Texto plano de un árbol de tokens inline: el `id` de un heading y el `alt` de
// una imagen salen del texto, no del HTML renderizado (antes `# **Hola**`
// generaba `id="strong-classcu-md-strongholastrong"`).
function plainText(tokens: any[] | undefined): string {
  if (!tokens) return ''
  return tokens
    .map((token) => {
      if (token.type === 'br') return ' '
      if (token.tokens && token.tokens.length > 0) return plainText(token.tokens)
      return token.text || ''
    })
    .join('')
}

export function parseMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string
}

export function extractHeadingIds(blocks: MarkdownBlock[]): string[] {
  return blocks
    .filter(b => b.type === 'inline' && b.tag?.startsWith('h'))
    .map(b => b.id)
    .filter((id): id is string => !!id)
}

function stripOuterBlockquote(html: string): string {
  return html.replace(/^<blockquote[^>]*>/, '').replace(/<\/blockquote>\s*$/, '')
}

export function parseToBlocks(markdown: string): MarkdownBlock[] {
  const tokens = marked.lexer(markdown)
  const result: MarkdownBlock[] = []
  // Los ids de ancla tienen que ser únicos: dos `# Igual` generaban el mismo id
  // y el ancla saltaba siempre al primero. Se numeran como en GitHub.
  const usedHeadingIds = new Map<string, number>()

  for (const token of tokens) {
    if (token.type === 'table') {
      // `key` es la clave interna de la columna (y del slot de Table): tiene que
      // ser única. Antes se usaba el texto crudo del encabezado, así que dos
      // columnas `a` colapsaban en una y se perdía una celda de cada fila.
      const usedKeys = new Map<string, number>()
      const columns = token.header.map((cell: any, i: number) => {
        const label = plainText(cell.tokens)
        const base = label || `col-${i + 1}`
        const count = usedKeys.get(base) ?? 0
        usedKeys.set(base, count + 1)
        return { key: count === 0 ? base : `${base}-${count}`, label }
      })
      const data = token.rows.map((row: any[]) => {
        const obj: Record<string, string> = {}
        row.forEach((cell: any, i: number) => {
          const column = columns[i]
          if (column) obj[column.key] = marked.parseInline(cell.text)
        })
        return obj
      })
      result.push({ type: 'table', table: { columns, data } })
    } else if (token.type === 'code') {
      result.push({
        type: 'code-block',
        codeBlock: { code: token.text, language: token.lang || '' },
      })
    } else if (token.type === 'blockquote') {
      const html = marked.parser([token])
      const inner = stripOuterBlockquote(html)
      result.push({ type: 'blockquote', blockquote: { html: inner } })
    } else if (token.type === 'paragraph') {
      result.push({
        type: 'inline',
        tag: 'p',
        tokens: token.tokens,
        html: classMap.paragraph,
      })
    } else if (token.type === 'heading') {
      const base = slugify(plainText(token.tokens)) || 'section'
      const count = usedHeadingIds.get(base) ?? 0
      usedHeadingIds.set(base, count + 1)
      result.push({
        type: 'inline',
        tag: `h${token.depth}`,
        tokens: token.tokens,
        html: `${classMap.heading} ${classMap.heading}-${token.depth}`,
        id: count === 0 ? base : `${base}-${count}`,
      })
    } else if (token.type === 'list') {
      result.push({
        type: 'list',
        tag: token.ordered ? 'ol' : 'ul',
        listItems: token.items.map((item: any) => ({ tokens: item.tokens })),
        html: `${classMap.list} ${classMap.list}--${token.ordered ? 'ordered' : 'unordered'}`,
        ordered: token.ordered,
      })
    } else if (token.type === 'html') {
      result.push({
        type: 'code-block',
        codeBlock: { code: token.raw, language: 'html' },
      })
    } else {
      const html = marked.parser([token])
      result.push({ type: 'html', html })
    }
  }

  return result
}
