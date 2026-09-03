---
name: marked
description: 'Receta para usar marked (npm) con el componente Markdown de comegen-ui. Usar cuando el usuario pida parsear markdown, renderizar markdown, usar el composable useMarkdown, o resolver errores de marked v15+ (Promise, tokens, parseInline). Frases: "parsear markdown", "renderizar markdown", "usar markdown", "markdown a HTML", "useMarkdown", "parseToBlocks", "error marked Promise".'
---

# Marked + ComegenUI Markdown

Receta para parsear y renderizar markdown usando `marked` (npm) + el componente `Markdown.vue` de comegen-ui.

> **Regla de oro:** marked v15+ devuelve Promise por defecto. Siempre usar `{ async: false }`.

## Cuándo se activa

- "Parsear/renderizar markdown".
- "Usar useMarkdown / parseToBlocks".
- "Error de marked (Promise, tokens, parseInline)".
- "Agregar tipo de bloque al renderer".

## Cuándo NO se activa

- Documentar el componente markdown → `documentar-comegen-ui`.
- Modificar el componente markdown → `comegen-ui-dev`.

---

## Parsear markdown

```ts
import { marked } from 'marked'

// ✅ Correcto (sync)
const html = marked.parse(md, { async: false }) as string

// ❌ Devuelve Promise
const html = marked.parse(md)
```

## Parsear a bloques (para Vue components)

```ts
import { parseToBlocks, extractHeadingIds } from '@/markdown'

const blocks = parseToBlocks(markdown)          // MarkdownBlock[]
const headingIds = extractHeadingIds(blocks)    // string[] (para outline)
```

## Renderizar con componente Vue

```vue
<Markdown
  :content="markdown"
  @parsed="handleParsed"
/>

<script setup>
function handleParsed(headingIds) {
  outlineItems.value = headingIds.map(id => ({ label: id, id }))
}
</script>
```

## Renderizar HTML simple (composable)

```ts
import { useMarkdown } from '@/composables/useMarkdown'

const { html } = useMarkdown(markdown)
```

---

## Agregar un nuevo tipo de bloque

1. Agregar caso en `parseToBlocks()` (`src/markdown/index.ts`):
```ts
else if (token.type === 'nuevo_tipo') {
  result.push({ type: 'nuevo_tipo', /* ... */ })
}
```

2. Agregar render en `Markdown.vue`:
```vue
<MiComponente
  v-else-if="block.type === 'nuevo_tipo'"
  :prop="block.data"
/>
```

3. Validar: `pnpm type-check && pnpm build:lib`.

---

## Errores comunes (marked v18)

| Error | Solución |
|---|---|
| `[object Promise]` | `marked.parse(md, { async: false })` |
| `this.parser is undefined` | Usar `function()` no arrow function en renderers |
| Bold/italic no renderiza en listas | Verificar `token.tokens` y mapear recursivamente |
| Links no redireccionan | `Button` usa `:to`, no `href` |
| Whitespace colapsado | `whitespace: 'preserve'` en vite.config.ts |

---

## Referencia

Para arquitectura completa del componente → [`docs/desarrollar-comegen-ui/arquitectura.md`](../../docs/desarrollar-comegen-ui/arquitectura.md).
