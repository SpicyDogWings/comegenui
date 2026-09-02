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

### Problem: Vue Collapses Whitespace at Compile Time

Vue's template compiler collapses whitespace between tags by default. This happens **before** DOM rendering, so `textContent` already arrives without newlines. CSS `white-space: pre-wrap` does NOT fix this because the newlines are gone before the browser even renders.

### Solution: `whitespace: 'preserve'` in Vue Compiler Options

**This is the ONLY reliable fix.** You must configure Vue's template compiler to preserve whitespace:

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      whitespace: 'preserve'
    }
  }
})
```

> **CRITICAL:** Without this compiler option, `el.textContent` will NOT contain newlines regardless of any CSS you apply.

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
    <div ref="slotEl"><slot /></div>
    <div class="cu-md-output" v-html="rendered"></div>
  </div>
</template>
```

### Key Points:
1. **`whitespace: 'preserve'` in vite.config.ts** - THE critical fix, without this nothing works
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
| Everything renders inline (no line breaks) | Vue compiler collapsing whitespace | Add `whitespace: 'preserve'` to `@vitejs/plugin-vue` config |
| `[object Promise]` in output | `marked.parse()` returns Promise in v15+ | Use `{ async: false }` option |
| Bold/italic not rendering | Inline tokens not parsed | Use `this.parser.parseInline(token.tokens)` |
| Lists show "undefined" | `body` param no longer exists | Use `token.items` array |
| `parseInline` error on blockquote | Contains block-level tokens | Use `marked.parser()` instead |
| Links not rendering | `token.text` is raw markdown | Parse inline tokens |
| `this.parser is undefined` | Arrow function used | Use regular `function()` syntax |

## Security Warning

### XSS en Markdown

Marked no sanitiza el HTML de salida. El composable `useMarkdown` ya incluye DOMPurify por defecto:

```ts
import DOMPurify from 'dompurify'

export function useMarkdown(source: string | Ref<string>) {
  const rendered = computed(() => {
    const raw = dedent(unref(sourceRef.value))
    if (!raw) return ''
    const html = parseMarkdown(raw)
    return DOMPurify.sanitize(html)
  })
  return { rendered }
}
```

### Audit de v-html en otros componentes

Los siguientes componentes usan `v-html` y podrían ser vulnerables a XSS si reciben contenido no confiable:

| Componente | Línea | Uso | Riesgo |
|-------------|-------|-----|--------|
| `DropdownMenu.vue` | 134 | `item.icon` (prop) | **Medio** - si `item.icon` viene de datos de usuario |
| `AdvancedTable.vue` | 385 | `button.icon` (prop) | **Medio** - si `button.icon` viene de datos de usuario |
| `Autocomplete.vue` | 159 | `item.icon` (prop) | **Medio** - si `item.icon` viene de datos de usuario |
| `FileList.vue` | 59 | `getFileIconSvg()` | Bajo - SVG generado internamente |
| `FileInput.vue` | 205 | `getFileIconSvg()` | Bajo - SVG generado internariamente |

**Recomendaciones:**
1. Las props `item.icon`, `button.icon` deben ser controladas por el developer, nunca directamente de input de usuario
2. Si se necesita renderizar HTML arbitrario en estos componentes, agregar DOMPurify
3. Los métodos `getFileIconSvg()` son seguros porque generan SVG paths, no HTML arbitrario

```ts
// ❌ Peligroso - nunca hagas esto
const items = userInput.map(i => ({ icon: i.htmlFromUser }))

// ✅ Seguro - iconos controlados por el developer
const items = [
  { icon: '<svg>...</svg>', label: 'Opción 1' }
]
```

## Resources

- [Official docs](https://marked.js.org)
- [GitHub repo](https://github.com/markedjs/marked)
- [npm package](https://www.npmjs.com/package/marked)
