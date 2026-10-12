<script setup lang="ts">
// Refleja el ejemplo "Posición y contenido custom": `position`/`align`/`delay`
// y el slot `content` con HTML.
</script>

<template>
  <VanillaDemo :use="['CuTooltip']">
    <cu-tooltip text="Texto simple" position="bottom"></cu-tooltip>

    <cu-tooltip position="right" align="start" delay="300">
      <span>Elemento con tooltip rico</span>
      <span slot="content">
        <strong>Más contexto</strong> con HTML
      </span>
    </cu-tooltip>
  </VanillaDemo>
</template>
