# `Markdown`

Renderizador de Markdown como Custom Element. Convierte markdown en HTML semántico usando los componentes internos de ComegenUI (tablas, code blocks, blockquotes, listas, headings, párrafos).

[← Volver](../README.md)

---

## UMD

```vue
<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";
</script>
```

## Uso en Vue

````vue
<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";
</script>

<template>
  <Markdown>
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
  </Markdown>
</template>
````

El contenido se pasa como **texto dentro del tag** (no como prop). El componente lo parsea al montarse.

## Notas

- El markdown se parsea una vez al montarse. Para actualizar el contenido, reemplazar el texto interno y volver a montar el componente.
- Las tablas se renderizan con `<cu-table>` internamente.
- Los code blocks usan `<cu-code-block>` con resaltado de sintaxis.
- El HTML se sanitiza con DOMPurify antes de renderizar.
- Los tokens CSS se inyectan automáticamente en el shadow DOM.
- **El wrapper CE re-emite `parsed` y expone `headingIds()`**: el evento y el método atraviesan el `.ce.vue`.

---

## Props

<!-- @api:props -->
Ninguna.
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `parsed` | `string[]` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `headingIds` | Devuelve los ids generados para los encabezados parseados. |
<!-- /@api:expose -->
