import { marked } from 'marked'

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
  return `<h${depth} class="${cls} ${cls}-${depth}">${content}</h${depth}>\n`
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
  return `<a href="${href}" class="${classMap.link}" target="_blank" rel="noopener">${this.parser.parseInline(tokens)}</a>`
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
