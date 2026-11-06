<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": el markdown se pasa como texto dentro del tag.
//
// El contenido va por interpolación (`{{ md }}`) y no como texto estático: el compilador de
// plantillas de Vue colapsa los saltos de línea del texto estático y `cu-markdown` necesita el
// texto tal cual (lo verifica `getText()` leyendo el light DOM del host).
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
  <VanillaDemo :use="['CuMarkdown']">
    <cu-markdown>{{ md }}</cu-markdown>
  </VanillaDemo>
</template>
