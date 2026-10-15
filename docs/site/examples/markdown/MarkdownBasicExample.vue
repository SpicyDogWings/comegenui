<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";

// El contenido va por interpolación (`{{ md }}`) y no como texto estático: el compilador de
// plantillas de Vue colapsa los saltos de línea del texto estático.
const md = `# Encabezado principal

Párrafo con **negrita**, *itálica*, \`código inline\` y un [link](https://example.com).

- Primer ítem
- Segundo ítem

> Una cita destacada.

\`\`\`js
const saludo = "hola";
console.log(saludo);
\`\`\`

| Columna A | Columna B |
|-----------|-----------|
| a         | b         |`;
</script>

<template>
  <Markdown>{{ md }}</Markdown>
</template>
