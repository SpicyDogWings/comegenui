---
name: marked
description: Use when working with the marked npm package (markdown parser/renderer), creating custom renderers, handling markdown-to-HTML conversion, or debugging marked v15+ API issues. Covers v18 renderer API, inline vs block token parsing, and Vue integration patterns.
---

# Marked - Markdown Parser Skill

Marked is a low-level compiler for parsing markdown without caching or blocking for long periods of time. It implements all markdown features from supported flavors & flavors.

## Version Compatibility (CRITICAL)

Marked v15+ introduced breaking API changes. Always check `node_modules/marked/package.json` for the version before writing code.

### v18 API Differences (most common issues)

1. **`marked.parse()` returns Promise by default in v15+**
   ```ts
   // ❌ Wrong - returns Promise, not string
   const html = marked.parse(md)

   // ✅ Correct - force sync return
   const html = marked.parse(md, { async: false }) as string
   ```

2. **Inline renderer methods receive token object, not individual params**
   ```ts
   // ❌ Old API (v14 and below)
   renderer.strong = function({ text }) {
     return `<strong>${text}</strong>`
   }

   // ✅ v18 API - parse inline tokens manually
   renderer.strong = function(token) {
     return `<strong>${this.parser.parseInline(token.tokens)}</strong>`
   }
   ```

3. **List token structure changed - `items` instead of `body`**
   ```ts
   // ❌ Old API
   renderer.list = function({ body, ordered }) {
     return `<ul>${body}</ul>`
   }

   // ✅ v18 API - iterate items array
   renderer.list = function(token) {
     const tag = token.ordered ? 'ol' : 'ul'
     let body = ''
     for (const item of token.items) {
       body += `<li>${this.parser.parseInline(item.tokens)}</li>`
     }
     return `<${tag}>${body}</${tag}>`
   }
   ```

4. **Blockquote contains block-level tokens (not inline)**
   ```ts
   // ✅ Use parse() not parseInline() for blockquote
   renderer.blockquote = function(token) {
     return `<blockquote>${marked.parser(token.tokens)}</blockquote>`
   }
   ```

5. **Text tokens may contain nested inline tokens**
   ```ts
   // ✅ Handle both plain text and token arrays
   renderer.text = function(token) {
     if (token.tokens && token.tokens.length > 0) {
       return this.parser.parseInline(token.tokens)
     }
     return token.escaped ? token.text : escapeHtml(token.text)
   }
   ```

## Custom Renderer Pattern (v18)

```ts
import { marked } from 'marked'

const renderer = new marked.Renderer()

// Block-level renderers
renderer.heading = function(token) {
  const tag = `h${token.depth}`
  return `<${tag} class="heading-${token.depth}">${this.parser.parseInline(token.tokens)}</${tag}>\n`
}

renderer.paragraph = function(token) {
  return `<p>${this.parser.parseInline(token.tokens)}</p>\n`
}

renderer.code = function(token) {
  return `<pre><code>${escapeHtml(token.text)}</code></pre>\n`
}

renderer.blockquote = function(token) {
  return `<blockquote>${marked.parser(token.tokens)}</blockquote>\n`
}

renderer.list = function(token) {
  const tag = token.ordered ? 'ol' : 'ul'
  let body = ''
  for (const item of token.items) {
    body += `<li>${this.parser.parseInline(item.tokens)}</li>\n`
  }
  return `<${tag}>${body}</${tag}>\n`
}

// Inline-level renderers
renderer.strong = function(token) {
  return `<strong>${this.parser.parseInline(token.tokens)}</strong>`
}

renderer.em = function(token) {
  return `<em>${this.parser.parseInline(token.tokens)}</em>`
}

renderer.link = function(token) {
  return `<a href="${token.href}">${this.parser.parseInline(token.tokens)}</a>`
}

renderer.codespan = function(token) {
  return `<code>${escapeHtml(token.text)}</code>`
}

renderer.del = function(token) {
  return `<del>${this.parser.parseInline(token.tokens)}</del>`
}

renderer.image = function(token) {
  return `<img src="${token.href}" alt="${token.text}" />`
}

renderer.hr = function() {
  return `<hr />\n`
}

renderer.br = function() {
  return `<br />`
}

// Table (mixed block/inline)
renderer.table = function(token) {
  let headerRow = ''
  for (const cell of token.header) {
    headerRow += `<th>${this.parser.parseInline(cell.tokens)}</th>`
  }
  let bodyRows = ''
  for (const row of token.rows) {
    let rowCells = ''
    for (const cell of row) {
      rowCells += `<td>${this.parser.parseInline(cell.tokens)}</td>`
    }
    bodyRows += `<tr>${rowCells}</tr>`
  }
  return `<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>\n`
}

// Text handler (important for nested tokens)
renderer.text = function(token) {
  if (token.tokens && token.tokens.length > 0) {
    return this.parser.parseInline(token.tokens)
  }
  return token.escaped ? token.text : escapeHtml(token.text)
}

marked.setOptions({ renderer, gfm: true })

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
```

## Vue Integration Pattern

### Problem: Vue Collapses Whitespace

Vue's template compiler collapses whitespace between tags by default. This breaks markdown parsing since newlines are significant.

### Solution: Use `white-space: pre-wrap` + read textContent

> **CRITICAL GOTCHA:** The `white-space: pre-wrap` MUST be on the source element whose `textContent` you're reading. If you use `data-md-source` attribute without the class, or any element without this style, `textContent` will NOT contain newlines and markdown will render as a single inline block.

```vue
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { parseMarkdown } from './markdown'

const rendered = ref('')
const slotEl = ref<HTMLElement | null>(null)

function dedent(text: string): string {
  const lines = text.split('\n')
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()

  let minIndent = Infinity
  for (const line of lines) {
    if (line.trim() === '') continue
    const match = line.match(/^(\s*)/)
    if (match) minIndent = Math.min(minIndent, match[1].length)
  }
  if (minIndent === Infinity) minIndent = 0
  return lines.map(line => line.slice(minIndent)).join('\n')
}

onMounted(() => {
  nextTick(() => {
    const el = slotEl.value
    if (!el) return
    const raw = dedent(el.textContent || '')
    rendered.value = raw ? parseMarkdown(raw) : ''
    el.style.display = 'none'
  })
})
</script>

<template>
  <div class="cu-markdown">
    <div ref="slotEl" class="cu-md-slot"><slot /></div>
    <div class="cu-md-output" v-html="rendered"></div>
  </div>
</template>

<style scoped>
.cu-md-slot {
  white-space: pre-wrap;
}
</style>
```

### Key Points:
1. **`white-space: pre-wrap`** preserves newlines in the rendered DOM
2. **`dedent()`** removes common indentation from slot content
3. **`el.style.display = 'none'`** hides raw markdown after parsing (JS, not CSS, because CSS can't select previous siblings)
4. **`{ async: false }`** required in marked v15+ to get string instead of Promise

### Alternative: Use a prop instead of slot

```vue
<Markdown :content="markdownString" />
```

This avoids the whitespace issue entirely.

## Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Everything renders inline (no line breaks) | Source element missing `white-space: pre-wrap` | Add `.cu-md-slot { white-space: pre-wrap }` to the div with `<slot />` |
| `[object Promise]` in output | `marked.parse()` returns Promise in v15+ | Use `{ async: false }` option |
| Bold/italic not rendering | Inline tokens not parsed | Use `this.parser.parseInline(token.tokens)` |
| Lists show "undefined" | `body` param no longer exists | Use `token.items` array |
| `parseInline` error on blockquote | Contains block-level tokens | Use `marked.parser()` instead |
| Links not rendering | `token.text` is raw markdown | Parse inline tokens |
| `this.parser is undefined` | Arrow function used | Use regular `function()` syntax |

## Security Warning

**Marked does not sanitize output HTML.** Always use a sanitization library like DOMPurify on the output if rendering user-generated content:

```ts
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(marked.parse(md, { async: false }))
```

## Resources

- [Official docs](https://marked.js.org)
- [GitHub repo](https://github.com/markedjs/marked)
- [npm package](https://www.npmjs.com/package/marked)
