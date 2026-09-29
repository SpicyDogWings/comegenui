<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import Markdown from "@/components/markdown/Markdown.vue";
import Button from "@/components/buttons/Button.vue";

const markdownRef = ref<InstanceType<typeof Markdown> | null>(null);
const emitidos = ref<string[]>([]);
const leidos = ref<string[]>([]);

function onParsed(ids: string[]) {
  emitidos.value = ids;
}

async function leerHeadingIds() {
  await nextTick();
  leidos.value = markdownRef.value?.headingIds() ?? [];
}

onMounted(leerHeadingIds);
</script>

<template>
  <Markdown ref="markdownRef" @parsed="onParsed">
# Introducción

Texto del documento.

## Detalles

Más texto.
  </Markdown>

  <div class="cu-demo-controls">
    <Button variant="outlined" size="sm" @click="leerHeadingIds">Leer headingIds()</Button>
  </div>

  <p class="cu-demo-output">parsed → {{ emitidos.length ? emitidos.join(", ") : "(sin encabezados)" }}</p>
  <p class="cu-demo-output">headingIds() → {{ leidos.length ? leidos.join(", ") : "(vacío)" }}</p>
</template>
