[← Volver](../README.md)

# `InlineRenderer`

Renderiza los **tokens inline** que produce marked (el mismo parser que usa `<Markdown>`): texto, negrita, itálica, código, tachado, imagen, link, salto y escapes. No es contenido de bloque — recibe ya los tokens inline y los devuelve como HTML.

## Uso en Vue

```vue
<script setup lang="ts">
import InlineRenderer from "@/components/markdown/InlineRenderer.vue";
import { marked } from "marked";

// Tokens inline reales de marked: el mismo shape que produce el parser interno.
const paragraph = marked.lexer(
  "Texto con **negrita**, *itálica*, `código`, ~~tachado~~ y un [link](https://example.com).",
)[0] as any;

const tokens: any[] = paragraph.tokens ?? [];
</script>

<template>
  <InlineRenderer :tokens="tokens" />
</template>
```

## Tipos de token

Reconoce `text`, `strong`, `em`, `codespan`, `del`, `image`, `link`, `br` y `escape`; cualquier otro tipo se ignora (devuelve vacío). En particular, el HTML inline (`<b>…</b>`) llega como tokens `html` y no se interpreta: el texto que queda adentro se muestra tal cual.

```vue
<script setup lang="ts">
const tokens = [
  { type: "text", text: "Texto plano, " },
  { type: "strong", tokens: [{ type: "text", text: "negrita" }] },
  { type: "text", text: ", " },
  { type: "em", tokens: [{ type: "text", text: "itálica" }] },
  { type: "text", text: ", " },
  { type: "codespan", text: "código inline" },
  { type: "text", text: ", " },
  { type: "del", tokens: [{ type: "text", text: "tachado" }] },
  { type: "text", text: " y " },
  { type: "link", href: "https://vuejs.org", tokens: [{ type: "text", text: "un enlace" }] },
  { type: "br" },
  { type: "text", text: "Segunda línea con " },
  { type: "image", href: "/logo.png", text: "icono" },
  { type: "text", text: " y un escape: " },
  { type: "escape", text: "\\*" },
];
</script>

<template>
  <InlineRenderer :tokens="tokens" />
</template>
```

## Links

Un token `link` no se renderiza como `<a>`: se rinde con `<Button variant="link">`, apuntando a `href` y abriendo en una pestaña nueva (`target="_blank"` + `rel="noopener"`), así hereda el color y el subrayado del tema. Un esquema ejecutable (`javascript:`, `data:`, `vbscript:`) no navega: sale como `<button>` sin `href`. Las URLs de links e imágenes se escapan al construir el HTML, así que una comilla en la URL no puede inyectar atributos (`onerror`, `onmouseover`, …).

```vue
<script setup lang="ts">
const tokens = [{ type: "link", href: "https://vuejs.org", tokens: [{ type: "text", text: "Documentación de Vue" }] }];
</script>

<template>
  <InlineRenderer :tokens="tokens" />
</template>
```

## Tokens anidados

Los tokens con contenido propio (`text`, `strong`, `em`, `del`, `link`) traen `tokens` adentro y se resuelven recursivamente, así que un link con negrita adentro sale con el formato aplicado.

```vue
<script setup lang="ts">
const tokens = [
  {
    type: "strong",
    tokens: [
      { type: "text", text: "Importante: " },
      { type: "link", href: "https://vuejs.org", tokens: [{ type: "text", text: "leé la doc" }] },
    ],
  },
];
</script>

<template>
  <InlineRenderer :tokens="tokens" />
</template>
```

## Props

<!--@include: ../../partials/inline-renderer/props.md-->

## Emits

<!--@include: ../../partials/inline-renderer/eventos.md-->

## Slots

<!--@include: ../../partials/inline-renderer/slots.md-->

## Expose

<!--@include: ../../partials/inline-renderer/metodos.md-->
