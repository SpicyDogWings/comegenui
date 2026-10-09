# Markdown — `<cu-markdown>` / `<Markdown>`

Renderizador de Markdown que convierte texto en HTML semántico usando los componentes internos de
ComegenUI (tablas, code blocks, blockquotes, listas, headings, párrafos).

## Cuándo usarlo

Para mostrar contenido Markdown ya renderizado y sanitizado (documentación, descripciones largas,
notas). No es un editor ni un campo de entrada.

## Receta

1. Pasá el markdown como **texto dentro del tag** (slot default): no hay prop de contenido.
2. Se parsea **una sola vez al montar**. Para cambiar el contenido, reemplazá el texto y volvé a
   montar el componente.
3. El color sale del tema del host (`<html data-theme="...">`); no hay prop `theme`.
4. Escuchá `parsed` (array de ids de headings) y usá `headingIds()` para armar anclas.
5. El HTML se sanitiza con DOMPurify; las tablas y los code blocks se delegan a los componentes
   internos.

```html
<!-- HTML plano (UMD) -->
<cu-markdown id="doc">
# Título

Párrafo con **negrita**, *cursiva* y `código inline`.

- Item 1
- Item 2

> Blockquote
</cu-markdown>

<script src="dist-libs/umd-core/CuMarkdown.umd.js"></script>
<script>
  const md = document.getElementById('doc');
  md.addEventListener('parsed', (e) => console.log('headings:', e.detail));
  console.log(md.headingIds());
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";
import { ref } from "vue";

const doc = ref<InstanceType<typeof Markdown> | null>(null);
</script>

<template>
  <Markdown ref="doc" @parsed="(ids: string[]) => console.log(ids)">
# Título

Párrafo con **negrita**, *cursiva* y `código inline`.

- Item 1
- Item 2
  </Markdown>
</template>
```

## Qué puede y qué no puede

**Puede:** headings, párrafos, listas, blockquotes, tablas,
code blocks con resaltado, links, imágenes y HTML sanitizado. Emite `parsed` y expone `headingIds()`
(también en el CE).

**No puede:**

- **No hay prop de contenido** (`modelValue`/`content`): el markdown va como texto del slot.
- **Se parsea una sola vez al montar.** No es reactivo: cambiar el texto no vuelve a renderizar;
  hay que remontar el componente.
- **No es un editor** ni emite eventos de edición.
- **No acepta `color`, `variant` ni `size`.**
- **No hay slots de renderers.** Sólo el slot default con el texto; no se pueden customizar tablas,
  code blocks ni blockquotes.
- **El idioma del code block sale del fence**, no de una prop.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">` (ver `theming.md`).

## API del custom element

### Atributos

<!-- @api:atributos -->
Ninguno.
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `parsed` | `string[]` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `headingIds` | Devuelve los ids generados para los encabezados parseados. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
Ninguna.
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `parsed` | `string[]` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `headingIds` | Devuelve los ids generados para los encabezados parseados. |
<!-- /@api:expose -->
