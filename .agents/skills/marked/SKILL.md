---
name: marked
description: Use when working with the marked npm package (markdown parser/renderer), creating custom renderers, handling markdown-to-HTML conversion, or debugging marked v15+ API issues. Covers v18 renderer API, inline vs block token parsing, Vue integration patterns, and comegen-ui component-based rendering.
---

# Marked - Markdown Parser Skill

## Arquitectura del Markdown Component

```
src/
├── markdown/
│   └── index.ts              # Parser + renderer config + parseToBlocks()
├── composables/
│   └── useMarkdown.ts        # Composable (HTML simple)
├── components/
│   ├── information/
│   │   ├── Markdown.vue      # Componente principal (usa componentes Vue)
│   │   ├── CodeBlock.vue     # Bloque de código con label de lenguaje
│   │   └── Blockquote.vue    # Cita en bloque
│   ├── data/
│   │   └── Table.vue         # Tabla (htmlCells prop para markdown)
│   └── customElements/
│       └── information/
│           └── Markdown.ce.vue  # Wrapper CE (NO expone htmlCells)
└── lib/
    └── information/
        └── markdown.ts       # Entry point UMD
```

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

## Component-Based Rendering

The `Markdown.vue` component uses `parseToBlocks()` to render markdown with Vue components instead of raw HTML.

### Block Types

```ts
interface MarkdownBlock {
  type: 'html' | 'table' | 'code-block' | 'blockquote'
  html?: string
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
}
```

### Parsing to Blocks

```ts
// src/markdown/index.ts
export function parseToBlocks(markdown: string): MarkdownBlock[] {
  const tokens = marked.lexer(markdown)
  const result: MarkdownBlock[] = []

  for (const token of tokens) {
    if (token.type === 'table') {
      // Tables → Table.vue component
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
      // Code blocks → CodeBlock.vue component
      result.push({
        type: 'code-block',
        codeBlock: { code: token.text, language: token.lang || '' },
      })
    } else if (token.type === 'blockquote') {
      // Blockquotes → Blockquote.vue component
      const html = marked.parser([token])
      result.push({ type: 'blockquote', blockquote: { html } })
    } else {
      // Everything else → sanitized HTML
      const html = marked.parser([token])
      result.push({ type: 'html', html })
    }
  }

  return result
}
```

### Rendering Blocks

```vue
<!-- Markdown.vue -->
<template>
  <div class="cu-markdown">
    <div ref="slotEl" class="cu-md-slot"><slot /></div>
    <div class="cu-md-output">
      <template v-for="(block, i) in blocks" :key="i">
        <Table
          v-if="block.type === 'table' && block.table"
          :columns="block.table.columns"
          :data="block.table.data"
          :html-cells="true"
        />
        <CodeBlock
          v-else-if="block.type === 'code-block' && block.codeBlock"
          :code="block.codeBlock.code"
          :language="block.codeBlock.language"
        />
        <Blockquote
          v-else-if="block.type === 'blockquote' && block.blockquote"
          :html="block.blockquote.html"
        />
        <div v-else-if="block.html" v-html="block.html"></div>
      </template>
    </div>
  </div>
</template>
```

## Components Used by Markdown

### Table (`src/components/data/Table.vue`)

The `htmlCells` prop enables v-html rendering for table cells (for markdown inline formatting).

```vue
<Table :columns="columns" :data="data" :html-cells="true" />
```

**IMPORTANT:** `htmlCells` is NOT exposed in `Table.ce.vue` (CE wrapper). This prevents XSS via the public API.

```vue
<!-- Table.vue internal cell rendering -->
<slot :name="`cell-${col.key}`" :value="getCellValue(row, col)">
  <span v-if="props.htmlCells" v-html="getCellValue(row, col)"></span>
  <template v-else>{{ getCellValue(row, col) }}</template>
</slot>
```

### CodeBlock (`src/components/information/CodeBlock.vue`)

Renders code with a language label at bottom right.

```vue
<CodeBlock :code="codeString" :language="'javascript'" />
```

Output:
```
┌─────────────────────────────┐
│ function hello() {          │
│   console.log("Hello");     │
│ }                           │
│                    javascript│
└─────────────────────────────┘
```

### Blockquote (`src/components/information/Blockquote.vue`)

Renders a blockquote with left border and optional color.

```vue
<Blockquote :html="blockquoteHtml" color="primary" />
```

## Vue Integration Pattern

### Problem: Vue Collapses Whitespace at Compile Time

Vue's template compiler collapses whitespace between tags by default. This happens **before** DOM rendering, so `textContent` already arrives without newlines. CSS `white-space: pre-wrap` does NOT fix this.

### Solution: `whitespace: 'preserve'` in Vue Compiler Options

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

### Dedent Function

```ts
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
```

## Security

### XSS Protection

The markdown component uses DOMPurify to sanitize all output:

```ts
import DOMPurify from 'dompurify'

function sanitizeBlock(block: MarkdownBlock): MarkdownBlock {
  if (block.html) {
    block.html = DOMPurify.sanitize(block.html)
  }
  if (block.blockquote) {
    block.blockquote.html = DOMPurify.sanitize(block.blockquote.html)
  }
  if (block.table) {
    block.table.data = block.table.data.map(row => {
      const sanitized: Record<string, string> = {}
      for (const key in row) {
        sanitized[key] = DOMPurify.sanitize(row[key])
      }
      return sanitized
    })
  }
  return block
}
```

### Components Using v-html (XSS Audit)

| Component | Line | Uso | Riesgo |
|-----------|------|-----|--------|
| `DropdownMenu.vue` | 134 | `item.icon` (prop) | Medio - si viene de usuario |
| `AdvancedTable.vue` | 385 | `button.icon` (prop) | Medio - si viene de usuario |
| `Autocomplete.vue` | 159 | `item.icon` (prop) | Medio - si viene de usuario |
| `FileList.vue` | 59 | `getFileIconSvg()` | Bajo - SVG interno |
| `FileInput.vue` | 205 | `getFileIconSvg()` | Bajo - SVG interno |

**Recommendation:** Props like `item.icon` should always be developer-controlled, never from user input.

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

## Resources

- [Official docs](https://marked.js.org)
- [GitHub repo](https://github.com/markedjs/marked)
- [npm package](https://www.npmjs.com/package/marked)
- [DOMPurify](https://github.com/cure53/DOMPurify)
