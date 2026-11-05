<script setup lang="ts">
// Refleja el ejemplo "Encabezados": el evento `parsed` y el método `headingIds()`.
//
// El contenido va por interpolación para que el compilador de Vue no colapse los saltos de
// línea (ver `markdown-uso.vue`).
import { ref } from "vue";

type CuMarkdownElement = HTMLElement & { headingIds?: () => string[] };

const doc = ref<CuMarkdownElement | null>(null);
const emitidos = ref<string[]>([]);
const leidos = ref<string[]>([]);

const md = `# Introducción

Texto del documento.

## Detalles

Más texto.`;

function onParsed(e: Event) {
  emitidos.value = (e as CustomEvent<string[]>).detail ?? [];
}

function leerHeadingIds() {
  leidos.value = doc.value?.headingIds?.() ?? [];
}
</script>

<template>
  <VanillaDemo :use="['CuMarkdown']">
    <cu-markdown ref="doc" @parsed="onParsed">{{ md }}</cu-markdown>

    <div class="cu-demo-controls">
      <button type="button" @click="leerHeadingIds">headingIds()</button>
    </div>
    <pre class="cu-demo-output">parsed → {{ emitidos.length ? emitidos.join(", ") : "(sin encabezados)" }}</pre>
    <pre class="cu-demo-output">headingIds() → {{ leidos.length ? leidos.join(", ") : "(vacío)" }}</pre>
  </VanillaDemo>
</template>
