[← Volver](../README.md)

# `Markdown`

Renderizador de Markdown como componente Vue. Convierte markdown en HTML semántico usando los
componentes internos de ComegenUI (tablas, code blocks, blockquotes, listas, headings, párrafos).

## Uso en Vue

````vue
<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";

// El markdown va por interpolación: el compilador de plantillas de Vue colapsa los saltos de
// línea del texto estático.
const md = `# Título

Párrafo con **negrita**, *cita*, y \`código inline\`.

- Item 1
- Item 2

> Blockquote

\`\`\`js
const x = 1;
\`\`\`

| Col A | Col B |
|-------|-------|
| a     | b     |`;
</script>

<template>
  <Markdown>{{ md }}</Markdown>
</template>
````

En HTML plano, cargá el bundle `CuMarkdown` (ver [ficha vanilla](/componentes/cu-markdown)).

> El contenido va por el slot `default`, no como prop, y se parsea **una vez al montarse**: para
> actualizarlo hay que remontar el componente. En un `.vue` **no** sirve el texto multilínea
> literal (Vue colapsa los saltos de línea): pasalo por interpolación.
> Las tablas se renderizan con `<Table>`, los code blocks con `<CodeBlock>`, el HTML se sanitiza
> con DOMPurify y los tokens del tema se inyectan en el shadow DOM.

## Encabezados

Al terminar de parsear, el componente emite `parsed` con los ids de los encabezados;
`headingIds()` los devuelve sobre la `ref`. El `id` es el que queda en cada heading, así que sirve
para anclas.

````vue
<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const doc = ref<InstanceType<typeof Markdown> | null>(null);
const emitidos = ref<string[]>([]);
const leidos = ref<string[]>([]);

const md = `# Introducción

Texto del documento.

## Detalles

Más texto.`;

function onParsed(ids: string[]) {
  emitidos.value = ids;
}

function leerHeadingIds() {
  leidos.value = doc.value?.headingIds() ?? [];
}
</script>

<template>
  <Markdown ref="doc" @parsed="onParsed">{{ md }}</Markdown>

  <Button variant="outlined" size="sm" @click="leerHeadingIds">Leer headingIds()</Button>
  <pre>{{ emitidos.join(", ") }}</pre>
  <pre>{{ leidos.join(", ") }}</pre>
</template>
````

## Props

<!--@include: ../../partials/markdown/props.md-->

## Emits

<!--@include: ../../partials/markdown/eventos.md-->

## Slots

<!--@include: ../../partials/markdown/slots.md-->

## Expose

<!--@include: ../../partials/markdown/metodos.md-->
