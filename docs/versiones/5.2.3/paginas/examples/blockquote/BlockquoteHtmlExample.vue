<script setup lang="ts">
import Blockquote from "@/components/markdown/Blockquote.vue";

const html = "<p>Versión con <strong>html</strong> y <em>etiquetas</em>.</p>";
</script>

<template>
  <!-- Slot default: el contenido se escribe como hijos. -->
  <Blockquote color="primary">Versión con slot (texto plano).</Blockquote>

  <!-- Prop `html`: tiene prioridad sobre el slot. -->
  <Blockquote color="secondary" :html="html" />
</template>
