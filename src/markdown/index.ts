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
  const id = slugify(content)
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
  return `<a href="${href}" class="${classMap.link}" target="_blank" rel="noopener">${text}</a>`
}

renderer.image = function ({ href, text }: any) {
  return `<img src="${href}" alt="${text}" class="${classMap.image}" />`
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
  return token.escaped ? token.text : escapeHtml(token.text)
}

marked.setOptions({ renderer })

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
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

  for (const token of tokens) {
    if (token.type === 'table') {
      const header = token.header.map((cell: any) => cell.text)
      const columns = header.map((text: string) => ({ key: text, label: text }))
      const data = token.rows.map((row: any[]) => {
        const obj: Record<string, string> = {}
        row.forEach((cell: any, i: number) => {
          if (header[i]) {
            obj[header[i]] = marked.parseInline(cell.text)
          }
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
      const html = marked.parser([token])
      const id = html.match(/id="([^"]+)"/)?.[1] || ''
      result.push({
        type: 'inline',
        tag: `h${token.depth}`,
        tokens: token.tokens,
        html: `${classMap.heading} ${classMap.heading}-${token.depth}`,
        id,
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
      result.push({ type: 'html', html: escapeHtml(token.raw) })
    } else {
      const html = marked.parser([token])
      result.push({ type: 'html', html })
    }
  }

  return result
}
