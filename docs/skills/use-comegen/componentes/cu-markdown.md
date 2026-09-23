# `<cu-markdown>`

Renderizador de Markdown como Custom Element. Convierte markdown en HTML semántico usando los componentes internos de ComegenUI (tablas, code blocks, blockquotes, listas, headings, párrafos).

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `"light"` | Tema de colores (`light`, `dark`, `sigacadv2`) |

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido markdown a renderizar. Se pasa como texto dentro del tag. |

---

## UMD

```
dist/CuMarkdown.umd.js
```

---

## Uso

```html
<cu-markdown>
# Título

Párrafo con **negrita**, *cita*, y `código inline`.

- Item 1
- Item 2

> Blockquote

```js
const x = 1;
```

| Col A | Col B |
|-------|-------|
| a     | b     |
</cu-markdown>

<script src="dist/CuMarkdown.umd.js"></script>
```

El contenido se pasa como **texto dentro del tag** (no como prop). El componente lo parsea al montarse.

---

## Notas

- El markdown se parsea una vez al montarse. Para actualizar el contenido, reemplazar el texto interno y volver a montar el componente.
- Las tablas se renderizan con `<cu-table>` internamente.
- Los code blocks usan `<cu-code-block>` con resaltado de sintaxis.
- El HTML se sanitiza con DOMPurify antes de renderizar.
- Los tokens CSS se inyectan automáticamente en el shadow DOM.
- **El wrapper CE actual no re-emite `parsed` ni expone `headingIds()`**: esos eventos/métodos existen en el `.vue` interno pero no atraviesan el `.ce.vue`. Ver `docs/notes/06-cu-markdown-api.md`.
